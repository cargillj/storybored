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
      results.success = false;
      results.err = err;
      return res.json(results);
    });
    articleQuery.on('row', function(row) {
      results.article_id = row.article_id;
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
    articleQuery = client.query("SELECT sb.articles.article_id as article_id, sb.articles.title as title, sb.articles.byline as byline, sb.articles.body as body, sb.articles.img as img, sb.articles.img_tint as img_tint, sb.articles.date as date, sb.users.username as author FROM sb.articles, sb.users WHERE sb.articles.user_id = sb.users.user_id AND article_id=$1;", [article_id]);
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
    recentQuery = client.query("SELECT sb.articles.article_id as article_id, sb.articles.title as title, sb.articles.byline as byline, sb.articles.img as img, sb.articles.img_tint as img_tint, sb.articles.date as date, sb.users.username as author FROM sb.articles, sb.users WHERE sb.articles.user_id = sb.users.user_id ORDER BY date DESC LIMIT $1", [n]);
    recentQuery.on('error', function(err) {
      results.success = false;
      results.err = err;
      return res.json(results);
    });
    recentQuery.on('row', function(row) {
      results.articles.push(row);
    });
    recentQuery.on('end', function() {
      client.end();
      results.success = true;
      return res.json(results);
    });
  });
}

// Get tint values from database
exports.getTints = function(req, res) {
  results = {};
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