// Set up
require('./env.js');
var connectionString = process.env['CONNECTION_STRING']
  , jwtSecret = process.env['JWT_SECRET'];

var express = require('express')
	, site = require('./routes/site')
	, user = require('./routes/user')
  , article = require('./routes/article')
  , cloudinary = require('./routes/cloudinary')
	, router = express.Router()
	, bodyParser = require('body-parser')
	, multer = require('multer')
	, upload  = multer()
	, morgan = require('morgan')
	, expressJwt = require('express-jwt')
	, routes
	, app = express();

// Configuration
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/', express.static(__dirname + '../../../dist/'));
app.use('/dashboard', express.static(__dirname + '../../../dist/'));
app.use('/articles/*', express.static(__dirname + '../../../dist/'));
app.use('/login', express.static(__dirname + '../../../dist/'));
app.use('/archive', express.static(__dirname + '../../../dist/'));

// Log requests
app.use(morgan('dev'));
// protect /api routes with JWT
app.use('/api', expressJwt({secret: jwtSecret})
  .unless({
    path: [/\/api\/public\/\w*.*/]
  }));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send("Invalid token");
  }
});

// General
app.get('/', site.index);

// User
app.post('/create_user/', upload.array(), user.create);
app.post('/authenticate', upload.array(), user.authenticate);

// User API
app.get('/api/users', user.getUsers);
app.get('/api/users/:username', upload.array(), user.getByUsername);
app.delete('/api/users/:user_id', user.delete);
app.put('/api/users/info/', upload.array(), user.updateInfo);
app.put('/api/users/username/', upload.array(), user.updateUsername);
app.put('/api/users/password/', upload.array(), user.updatePassword);
app.put('/api/users/profile/:user_id', user.updateProfile);

// Article API
app.post('/api/articles', upload.array(), article.create);
app.put('/api/articles', upload.array(), article.update);
app.delete('/api/articles/:article_id', article.delete);
app.get('/api/public/articles/tints', article.getTints);
app.get('/api/public/articles/archive', article.archive);
app.get('/api/public/articles/:article_id', article.getById);
app.get('/api/public/articles/recent/:n', article.getRecent);
app.get('/api/public/articles/titles/archive', article.titleArchive);
app.get('/api/public/articles/titles/:username', article.getTitles);

// Cloudinary API
app.post('/api/cloudinary/:folder', cloudinary.upload);

// Listen (start app with 'node server.js')
app.listen(3000);
console.log("storybored listening on port 3000");