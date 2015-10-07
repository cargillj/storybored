exports.index = function(req, res) {
  res.sendFile(__dirname + '/../../../dist/index.html');
}