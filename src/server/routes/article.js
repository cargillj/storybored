// article.js
var pg = require('pg')
  , connectionString = process.env['CONNECTION_STRING']
  , jwt = require('jsonwebtoken');

// Add article to database
exports.create = function(req, res) {
  results = {};
  var article = req.body;

  pg.connect(connectionString, function(err, client, done) {
    articleQuery = client.query("INSERT INTO sb.articles (user_id, title, byline, body, img, img_tint) VALUES ($1, $2, $3, $4, $5, $6) RETURNING article_id;", [article.user_id, article.title, article.byline, article.body, article.img, article.img_tint]);
    articleQuery.on('error', function(err) {
      console.log(err);
      results.success = false;
      results.err = err;
      return res.json(results);
    });
    articleQuery.on('row', function(row) {
      results.article_id = row.article_id;
    });
    articleQuery.on('end', function() {
      tsQuery = client.query("UPDATE sb.articles SET textsearch = to_tsvector('english', coalesce(title,'') || ' ' || coalesce(byline, '') || ' ' || coalesce(body, '')) WHERE article_id = $1", [results.article_id]);
      tsQuery.on('error', function(err) {
        console.log(err);
        results.success = false;
        results.err = err;
        return res.json(results);
      });
      tsQuery.on('end', function() {
        client.end();
        results.success = true;
        return res.json(results);
      });
    });
  });
}

exports.update = function(req, res) {
  var results = {};
  var article = req.body;

  pg.connect(connectionString, function(err, client, done) {
    articleQuery = client.query("UPDATE sb.articles SET (title, byline, body, img, img_tint) = ($1, $2, $3, $4, $5) WHERE article_id = $6;", [article.title, article.byline, article.body, article.img, article.img_tint, article.article_id]);
    articleQuery.on('error', function(err) {
      console.log(err);
      results.success = false;
      results.err = err;
      return res.json(results);
    });
    articleQuery.on('end', function() {
      client.end();
      results.success = true;
      return res.json(results);
    });
  });
}

exports.delete = function(req, res) {
  var results = {};
  var article_id = req.params.article_id;

  pg.connect(connectionString, function(err, client, done) {
    articleQuery = client.query("DELETE FROM sb.articles WHERE article_id = $1", [article_id]);
    articleQuery.on('error', function(err) {
      console.log(err);
      results.success = false;
      results.err = err;
      return res.json(results);
    });
    articleQuery.on('end', function() {
      client.end();
      results.success = true;
      return res.json(results);
    });
  });
}

// Get an article with its id
exports.getById = function(req, res) {
  results = {};
  var article_id = req.params.article_id;

  pg.connect(connectionString, function(err, client, done) {
    articleQuery = client.query("SELECT sb.articles.article_id as article_id, sb.articles.title as title, sb.articles.byline as byline, sb.articles.body as body, sb.articles.img as img, sb.articles.img_tint as img_tint, sb.articles.date as date, sb.users.username as author, sb.roles.role_name as role FROM sb.articles, sb.users, sb.user_roles, sb.roles WHERE sb.articles.user_id = sb.users.user_id AND sb.user_roles.role_id = sb.roles.role_id AND sb.user_roles.user_id = sb.articles.user_id AND article_id=$1;", [article_id]);
    articleQuery.on('error', function(err) {
      results.success = false;
      results.err = err;
      return res.json(results);
    });
    articleQuery.on('row', function(row) {
      results.article = row;
    });
    articleQuery.on('end', function() {
      client.end();
      results.success = true;
      return res.json(results);
    });
  });
}

// Get n recent articles for lists
exports.getRecent = function(req, res) {
  results = {};
  results.articles = [];
  var n = req.params.n;

  pg.connect(connectionString, function(err, client, done) {
    recentQuery = client.query("SELECT sb.articles.article_id as article_id, sb.articles.title as title, sb.articles.byline as byline, sb.articles.img as img, sb.articles.img_tint as img_tint, sb.articles.date as date, sb.users.username as author FROM sb.articles, sb.users WHERE sb.articles.user_id = sb.users.user_id ORDER BY date DESC LIMIT $1;", [n]);
    recentQuery.on('error', function(err) {
      results.success = false;
      results.err = err;
      return res.json(results);
    });
    recentQuery.on('row', function(row) {
      results.articles.push(row);
    });
    recentQuery.on('end', function() {
      var countQuery = client.query("SELECT count(*) FROM sb.articles;");
      countQuery.on('error', function(err) {
        console.log(err);
        results.success = false;
        results.err = err;
        return res.json(results);
      });
      countQuery.on('row', function(row) {
        results.count = row.count;
      });
      countQuery.on('end', function() {
        client.end();
        results.success = true;
        return res.json(results);
      });
    });
  });
}

// Get tint values from database
exports.getTints = function(req, res) {
  var results = {};
  results.tints = [];
  pg.connect(connectionString, function(err, client, done) {
    var tintQuery = client.query("SELECT unnest(enum_range(NULL::tint));");
    tintQuery.on('error', function(err) {
      console.log(err);
      results.success = false;
      results.err = err;
      return res.json(results);
    });
    tintQuery.on('row', function(row) {
      results.tints.push(row.unnest);
    });
    tintQuery.on('end', function() {
      client.end();
      results.success = true;
      return res.json(results);
    });
  });
}

// Get archive results
exports.archive = function(req, res) {
  results = {};
  results.articles = [];
  var textsearch = "";
  var username = "";
  var order = "DESC";
  var limit = 10;
  var offset = 0;
  if (req.query.textsearch) {
    textsearch = " AND textsearch @@ to_tsquery('english', '" + decodeURIComponent(req.query.textsearch).replace(/ /g, ' & ') + "') ";
  }
  if (req.query.username) {
    username = " AND sb.users.username = '" + req.query.username + "'";
  }
  if (req.query.order) {
    order = req.query.order;
  }
  if(req.query.limit) {
    limit = req.query.limit;
  }
  if(req.query.offset) {
    offset = req.query.offset;
  }
  
  pg.connect(connectionString, function(err, client, done) {
    var archiveQuery = client.query("SELECT sb.articles.article_id as article_id, sb.articles.title as title, sb.articles.byline as byline, sb.articles.img as img, sb.articles.date as date, sb.users.username as author FROM sb.articles, sb.users WHERE sb.articles.user_id = sb.users.user_id " + textsearch + username + " ORDER BY date " + order + " LIMIT " + limit + " OFFSET " + offset + ";");
    archiveQuery.on('error', function(err) {
      console.log(err);
      results.success = false;
      results.err = err;
      return res.json(results);
    });
    archiveQuery.on('row', function(row) {
      results.articles.push(row);
    });
    archiveQuery.on('end', function() {
      var countQuery = client.query("SELECT count(*) FROM sb.articles, sb.users WHERE sb.articles.user_id = sb.users.user_id " + textsearch + username + ";");
      countQuery.on('error', function(err) {
        console.log(err);
        results.success = false;
        results.err = err;
        return res.json(results);
      });
      countQuery.on('row', function(row) {
        results.count = row.count;
      });
      countQuery.on('end', function() {
        client.end();
        results.success = true;
        return res.json(results);
      });
    });
  });
}

exports.getTitles = function(req, res) {
  var results = {};
  results.titles = [];
  username = req.params.username;

  pg.connect(connectionString, function(err, client, done) {
    var titleQuery = client.query("SELECT sb.articles.title as title, sb.articles.article_id as article_id FROM sb.articles, sb.users WHERE sb.users.username=$1 AND sb.articles.user_id = sb.users.user_id;", [username]);
    titleQuery.on('error', function(err) {
      console.log(err);
      results.success = false;
      results.err = err;
      return res.json(results);
    });
    titleQuery.on('row', function(row) {
      results.titles.push(row);
    });
    titleQuery.on('end', function() {
      client.end();
      results.success = true;
      return res.json(results);
    });
  });
}

exports.titleArchive = function(req, res) {
  var results = {};
  results.titles = [];
  username = " AND sb.users.username = '" + req.query.username + "'";
  textsearch = " AND textsearch @@ to_tsquery('english', '" + decodeURIComponent(req.query.textsearch).replace(/ /g, ' & ') + "') ";

  pg.connect(connectionString, function(err, client, done) {
    var titleQuery = client.query("SELECT sb.articles.article_id as article_id, sb.articles.title as title FROM sb.articles, sb.users WHERE sb.articles.user_id = sb.users.user_id " + textsearch + username + " ORDER BY date DESC;");
    titleQuery.on('error', function(err) {
      console.log(err);
      results.success = false;
      results.err = err;
      return res.json(results);
    });
    titleQuery.on('row', function(row) {
      results.titles.push(row);
    });
    titleQuery.on('end', function() {
      client.end();
      results.success = true;
      return res.json(results);
    });
  });
}