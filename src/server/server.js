// Set up
require('./env.js');
var connectionString = process.env['CONNECTION_STRING']
  , jwtSecret = process.env['JWT_SECRET']
  , prToken = process.env['PRERENDER_TOKEN'];

var express = require('express')
	, site = require('./routes/site')
	, user = require('./routes/user')
  , article = require('./routes/article')
  , cloudinary = require('./routes/cloudinary')
  , sitemap = require('./routes/sitemap')
	, router = express.Router()
	, bodyParser = require('body-parser')
	, multer = require('multer')
	, upload  = multer()
	, morgan = require('morgan')
	, expressJwt = require('express-jwt')
  , prerender = require('prerender-node')
	, routes
	, app = express();

// Configuration
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(prerender.set('prerenderToken', prToken));
app.use('/', express.static(__dirname + '../../../dist/'));
app.use('/dashboard', express.static(__dirname + '../../../dist/'));
app.use('/articles/*', express.static(__dirname + '../../../dist/'));
app.use('/login', express.static(__dirname + '../../../dist/'));
app.use('/register', express.static(__dirname + '../../../dist/'));
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
app.post('/authenticate', upload.array(), user.authenticate);

// User API
app.post('/api/public/users', upload.array(), user.create);
app.get('/api/users', user.getUsers);
app.get('/api/users/:username', upload.array(), user.getByUsername);
app.delete('/api/users/:user_id', user.delete);
app.put('/api/users/info/', upload.array(), user.updateInfo);
app.put('/api/users/username/', upload.array(), user.updateUsername);
app.put('/api/users/password/', upload.array(), user.updatePassword);
app.put('/api/users/profile/:user_id', user.updateProfile);
app.put('/api/users/invitation/', upload.array(), user.sendInvitation);
app.get('/api/users/invitation/:key', user.checkInvitation);
app.put('/api/public/users/forgotten/:email', user.forgotten);

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

// Sitemap
app.get('/sitemap.xml', sitemap.sitemap);

// Listen (start app with 'node server.js')
app.listen(3000);
console.log("storybored listening on port 3000");