var express = require('express'),
	fs = require('fs'),
	path = require('path');

var app = express();

app.get('/', function (req, res) {
	fs.readFile(path.join(__dirname, 'blog', 'index.html'), 'utf8', function (err, data) {
		if (err) {
			return res.send(500, 'Unable to find index.html file');
		}

		return res.send(data);
	});
});

app.use('/static/js', express.static(path.join(__dirname, 'blog', 'js')));
app.use('/static/css', express.static(path.join(__dirname, 'blog', 'styles', 'css')));
app.use('/static/img', express.static(path.join(__dirname, 'blog', 'img')));
app.use('/static/fonts', express.static(path.join(__dirname, 'blog', 'fonts')));

var server = app.listen(3000, function () {
	console.log('Listening on port %d', server.address().port);
});