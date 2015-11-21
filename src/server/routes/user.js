// user.js

var pg = require('pg')
  , connectionString = process.env['CONNECTION_STRING']
  , mg_key = process.env['MAILGUN_API_KEY']
  , mg_domain = process.env['MAILGUN_DOMAIN']
  , mg_from = process.env['MAILGUN_FROM']
  , jwtSecret = process.env['JWT_SECRET']
  , jwt = require('jsonwebtoken')
  , multiparty = require('multiparty')
  , fs = require('fs')
  , Mailgun = require('mailgun-js')
  , mailcomposer = require('mailcomposer');

// Create user
exports.create = function(req, res) {
  results = {};
  var data = req.body;
  
  pg.connect(connectionString, function(err, client, done) {
    // Insert data
    var userQuery = client.query("INSERT INTO sb.users (first_name, last_name, email, username, password) VALUES ($1, $2, $3, $4, crypt($5, gen_salt('bf')));", [data.first_name, data.last_name, data.email, data.username, data.password]);
    userQuery.on('error', function(err) {
      results.success = false;
      results.err = err;
      return res.json(results);
    });
    userQuery.on('end', function() {
      var roleQuery = client.query("INSERT INTO sb.user_roles (user_id, role_id) VALUES ((SELECT user_id FROM sb.users WHERE username=$1), (SELECT role_id FROM sb.roles WHERE role_name='writer'));", [data.username]);
      roleQuery.on('error', function(err) {
        console.log(err);
        results.success = false;
        results.err = err;
      });
        
      roleQuery.on('end', function() {
        // Remove invitation
        var invQuery = client.query("DELETE FROM sb.invitations WHERE key = $1;", [data.invKey]);
        invQuery.on('error', function(err) {
          console.log(err);
          results.err = err;
          results.success = false;
          return res.json(results);
        });
        invQuery.on('end', function() {
          client.end();
          results.success = true;
          return res.json(results);
        });
      });
    });
    
  });
}

// Delete user
exports.delete = function(req, res) {
  results = {};
  // Grab data
  var data = req.params.user_id;
  console.log(data);
  pg.connect(connectionString, function(err, client, done) {
    // Insert data
    client.query("DELETE FROM sb.users WHERE user_id=$1;", [data], function(err) {
      if(err){
        results.success = false;
        results.err = err;
        console.log(err);
      } else {
        results.success = true;
      }
      return res.json(results);
    });
  });
}

// User Login
exports.authenticate = function(req, res) {
  // Grab data from http request
  var data = req.body;
  
  pg.connect(connectionString, function(err, client, done) {
    var results = {};
    var pwdhash = "";

    // Get the hashed password
    var pwdQuery = client.query("SELECT password from sb.users WHERE username=$1", [data.username]);
    pwdQuery.on('row', function(row) {
      pwdhash = row.password;
    });
    pwdQuery.on('error', function(err) {
      results.success = false;
      results.err = err;
      return res.json(results);
    });
    pwdQuery.on('end', function() {
      // Check if user is authentic
      var query = client.query("SELECT EXISTS(SELECT 1 FROM sb.users WHERE username=$1 AND password=crypt($2, $3));", [data.username, data.password, pwdhash]);

      query.on('row', function(row) {
        if(row.exists) {
          // Get user info
          client.query("SELECT user_id as user_id, username as username, first_name as first_name, last_name as last_name, since as since, email as email FROM sb.users WHERE username=$1;", [data], function(row) {
            results.user = row;
          });
          results.token = jwt.sign(results, jwtSecret, { expiresIn: 60*60*5 });
          results.success = true;
        } else {
          results.success = false;
          results.message = "Error authenticating user"
        }
      });
      query.on('error', function(err) {
        results.success = false;
        results.err = err;
        return res.json(results);
      });
      query.on('end', function() {
        client.end();
        return res.json(results);
      });
    });
  });
}

// Return a user given their username
exports.getByUsername = function(req, res) {
  results = {};
  var data = req.params.username;

  pg.connect(connectionString, function(err, client, done) {
    var query = client.query("SELECT sb.users.user_id as user_id, sb.users.username as username, sb.users.first_name as first_name, sb.users.last_name as last_name, sb.users.since as since, sb.users.email as email, sb.users.profile_img as profile_img, sb.roles.role_name as role FROM sb.users, sb.user_roles, sb.roles WHERE sb.users.user_id = sb.user_roles.user_id AND sb.user_roles.role_id = sb.roles.role_id AND sb.users.username = $1;", [data]);
    query.on('row', function(row) {
      results.user = row;
      console.log(row.profile_img);
      results.success = true;
    });
    query.on('error', function(err) {
      results.success = false;
      results.err = err;
    });
    query.on('end', function() {
      client.end();
      return res.json(results);
    });
  });
}

// Return all users
exports.getUsers = function(req, res) {
  var results = [];
  pg.connect(connectionString, function(err, client, done) {
    // Select data
    var query = client.query("SELECT * from sb.users;");
    query.on('row', function(row) {
      results.push(row);
    });
    query.on('end', function() {
      client.end();
      return res.json(results);
    });
    if(err) {
      console.log(err);
    }
  });
}

// Update user info
exports.updateInfo = function(req, res) {
  var results = {};
  var data = req.body;

  pg.connect(connectionString, function(err, client, done) {
    var query = client.query("UPDATE sb.users SET first_name=$1, last_name=$2, email=$3 WHERE user_id=$4;", [data.first_name, data.last_name, data.email, data.id]);
    query.on("error", function(err) {
      results.success = false;
      results.err = err;
      return res.json(results);
    });
    query.on("end", function() {
      client.end();
      results.success = true;
      return res.json(results);
    });
  });
}

// Update username
exports.updateUsername = function(req, res) {
  var results = {};
  var data = req.body;

  pg.connect(connectionString, function(err, client, done) {
    var query = client.query("UPDATE sb.users SET username=$1 WHERE user_id=$2;", [data.username, data.id]);
    query.on("error", function(err) {
      results.success = false;
      results.err = err;
      return res.json(results);
    });
    query.on("end", function() {
      client.end();
      results.success = true;
      return res.json(results);
    });
  });
}

// Update password
exports.updatePassword = function(req, res) {
  var results = {};
  var pwdhash = "";
  
  // Grab data
  var data = req.body;

  pg.connect(connectionString, function(err, client, done) {
    var oldpwdQuery = client.query("SELECT EXISTS(SELECT 1 FROM sb.users WHERE user_id=$1 AND password=crypt($2, (SELECT password from sb.users WHERE user_id=$1)));", [data.user_id, data.old_password]);
    oldpwdQuery.on('row', function(row) {
      if(row.exists) {
        var newpwdQuery = client.query("UPDATE sb.users SET password=crypt($1, gen_salt('bf')) WHERE user_id=$2;", [data.new_password, data.user_id]);
        newpwdQuery.on('error', function(err){
          results.success = false;
          results.err = err;
        });
        newpwdQuery.on('end', function() {
          client.end();
          results.success = true;
          return res.json(results);
        });
      } else {
        client.end();
        results.success = false;
        results.err = "Invalid password";
        return res.json(results);
      }
    });
    oldpwdQuery.on('error', function(err) {
      results.success = false;
      results.err = err;
    });
  });
}

// TODO: limit file sizes

// Update profile image
exports.updateProfile = function(req, res) {
  results = {};
  var user_id = req.params.user_id;
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    if(files.file) {
      var file = files.file[0];
      var contentType = file.headers['content-type'];
      var extension = file.path.substring(file.path.lastIndexOf('.'));
      var destPath = '../../dist/img/profiles/' + user_id + extension;
      fs.readFile(file.path, function(err, data) {
        fs.writeFile(destPath, data, function(err) {
          if(err) {
            console.log("error writing to disc");
            results.success = false;
          }
          else {
            // add image url to database
            pg.connect(connectionString, function(err, client, done) {
              client.query("UPDATE sb.users SET profile_img=$1 WHERE user_id=$2;", ['img/profiles/'+user_id+extension, user_id], function(err) {
                if(err){
                  console.log("error inserting into db");
                  results.success = false;
                  results.err = err;
                  return res.json(results);
                } 
              });
            });
          }
          results.success = true;
          return res.json(results);
        });
      });
    } else {
      results.success = false;
      results.err = "invalid file";
      return res.json(results);
    }
  });
}

exports.sendInvitation = function(req, res) {
  var results = {};
  var invKey = "";
  
  pg.connect(connectionString, function(err, client, done) {
    var invQuery = client.query("INSERT INTO sb.invitations (email) VALUES ($1) RETURNING key", [req.body.email]);
    invQuery.on('error', function(err) {
      console.log(err);
      results.err = err;
      results.success = false;
      return res.json(results);
    });
    invQuery.on('row', function(row) {
      invKey = row.key;
    });
    invQuery.on('end', function() {
      client.end();

      var mailgun = new Mailgun({apiKey: mg_key, domain: mg_domain});
      var mail = mailcomposer({
        from: mg_from,
        to: req.body.email,
        subject: 'Invitation to write for StoryBored',
        text: 'Welcome to the StoryBored Team!\n\nHello,\nYou have been invited by StoryBored writer '+req.body.inviter+' to join the ever-growing team of writers bringing quality content to storybored.news.\n\nYour invitation key is '+invKey+'\n\nPlease go to storybored.news/register within the next 3 days to create your account and start writing!\nAfter you create your account you can log in anytime at storybored.news/login.\n\nThanks,\nStoryBored Team',
        html: '<h1>Welcome to the StoryBored Team!</h1>Hello,<br>You have been invited by StoryBored writer <b>'+req.body.inviter+'</b> to join the ever-growing team of writers bringing quality content to storybored.news.<br><br><strong>Your invitation key is '+invKey+'</strong><br><br>Please go to storybored.news/register within the next 3 days to create your account and start writing!<br>After you create your account you can log in anytime at storybored.news/login.<br><br><strong>Thanks,<br>StoryBored Team</strong>'
      });

      mail.build(function(mailBuildError, message) {

        var dataToSend = {
          to: req.body.email,
          message: message.toString('ascii')
        };

        mailgun.messages().sendMime(dataToSend, function(sendError, body) {
          if (sendError) {
            console.log(sendError);
            results.success = false;
            return res.json(results);
          } else {
            results.success = true;
            return res.json(results);
          }
        });
      });
    });
  });
}

exports.checkInvitation = function(req, res) {
  var results = {};
  key = req.params.key;

  pg.connect(connectionString, function(err, client, done) {
    var query = client.query("SELECT EXISTS(SELECT 1 FROM sb.invitations WHERE key=$1);", [key]);
    query.on('error', function(err) {
      console.log(err);
      results.err = err;
      results.success = false;
      return res.json(results);
    });
    query.on('row', function(row) {
      if(row.exists) {
        results.invitation = true;
      } else {
        results.invitation = false;
      }
    });
    query.on('end', function() {
      client.end();
      results.success = true;
      return res.json(results);
    });
  });
}

exports.forgotten = function(req, res) {
  var results = {};
  var email = req.params.email;
  var username = "";
  var newPwd = "";
  pg.connect(connectionString, function(err, client, done) {
    var userQuery = client.query("SELECT username FROM sb.users WHERE email = $1 LIMIT 1;", [email]);
    userQuery.on('error', function(err) {
      console.log(err);
      results.success = false;
      results.err = err;
      return res.json(results);
    });
    userQuery.on('row', function(row) {
      username = row.username;
      results.exists = true;
    });
    userQuery.on('end', function() {
      if(username == "") {
        results.exists = false;
        return res.json(results);
      } else {
        // make new password
        var newPwdQuery = client.query("SELECT random_slug();");
        newPwdQuery.on('row', function(row) {
          newPwd = row.random_slug;
        });
        newPwdQuery.on('error', function(err) {
          console.log(err);
          results.success = false;
          return res.json(results);
        });
        newPwdQuery.on('end', function() {
          // set new password
          var pwdQuery = client.query("UPDATE sb.users SET password=crypt($1, gen_salt('bf')) WHERE email=$2;", [newPwd, email]);
          pwdQuery.on('error', function(err) {
            console.log(err);
            results.success = false;
            results.err = err;
            return res.json(results);
          });
          pwdQuery.on('end', function() {
            client.end();

            // send email with credentials
            var mailgun = new Mailgun({apiKey: mg_key, domain: mg_domain});
            var mail = mailcomposer({
              from: mg_from,
              to: email,
              subject: 'Request for Account Credentials',
              text: 'Forgotten password/username request\nWe received a request to send you your account credentials. For security, we have reset your password.\nYour current credentials are:\n<br>username: '+username+'\npassword: '+newPwd+'\n\nThanks for using StoryBored,\nStoryBored Team',
              html: '<h1>Forgotten password/username request</h1><p>We received a request to send you your account credentials. For security, we have reset your password.<br>Your current credentials are:<br><strong>username:</strong> '+username+'<br><strong>password:</strong> '+newPwd+'<br><br><strong>Thanks for using StoryBored,<br>StoryBored Team</strong></p>'
            });

            mail.build(function(mailBuildError, message) {

              var dataToSend = {
                to: email,
                message: message.toString('ascii')
              };

              mailgun.messages().sendMime(dataToSend, function(sendError, body) {
                if (sendError) {
                  console.log(sendError);
                  results.success = false;
                  return res.json(results);
                } else {
                  results.success = true;
                  return res.json(results);
                }
              });
            });
          });
        });
      }
    });
  });
}