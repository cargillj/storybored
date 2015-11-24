var sm = require('sitemap')
  , pg = require('pg')
  , connectionString = process.env['CONNECTION_STRING'];

exports.sitemap = function(req, res) {
  // get article ids from database
  var articles = [];
  pg.connect(connectionString, function(err, client, done) {
    var articleQuery = client.query('SELECT article_id FROM sb.articles;');
    articleQuery.on('error', function(err) {
      client.end();
      console.log(err);
      return res.status(500).end();
    });
    articleQuery.on('row', function(row) {
      articles.push({ url: '/articles/'+row.article_id, changefreq: 'monthly', priority: 0.7 });
    });
    articleQuery.on('end', function() {
      client.end();
      var sitemap = sm.createSitemap({
        hostname: 'http://storybored.news',
        cacheTime: 600000,
        urls: [
          { url: '/', changefreq: 'daily', priority: 0.3 },
          { url: '/archive', changefreq: 'daily', priority: 0.3 },
          { url: '/login', changefreq: 'daily', priority: 0.3 },
          { url: '/register', changefreq: 'daily', priority: 0.3 },
          { url: '/dashboard', changefreq: 'daily', priority: 0.3 },
        ].concat(articles)
      });
      sitemap.toXML(function(err, xml) {
        if(err) {
          return res.status(500).end();
        }
        res.header('Content-Type', 'application/xml');
        res.send(xml);
      });
    });
  });
}