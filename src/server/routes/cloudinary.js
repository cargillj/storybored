// cloudinary.js

var cloudinary = require('cloudinary')
  , multiparty = require('multiparty')
  , cloud_name = process.env['CLOUDINARY_CLOUD_NAME']
  , api_key = process.env['CLOUDINARY_API_KEY']
  , api_secret = process.env['CLOUDINARY_API_SECRET'];

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret
});

exports.upload = function(req, res) {
  var results = {};
  var folder = req.params.folder;

  var form = new multiparty.Form();
  form.on('error', function(err) {
    results.success = false;
    return res.json(results);
  });
  form.on('file', function(name, file) {
    cloudinary.uploader.upload(file.path, function(result) {
      console.log("** Uploaded image to cloudinary")
    },
    { public_id: folder+'/'+file.originalFilename.substring(0, file.originalFilename.lastIndexOf('.')) });
  });
  form.on('close', function() {
    results.success = true;
    return res.json(results);
  });
  form.parse(req);
}