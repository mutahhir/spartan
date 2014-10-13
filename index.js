var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	expressHandlebars = require('express-handlebars'),
	MD = require('marked'),
	frontMatter = require('json-front-matter');

var app = express();

MD.setOptions({
  renderer: new MD.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: function (code, lang, callback) {
    require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err, result) {
      callback(err, result.toString());
    });
  }
});

app.engine('handlebars', expressHandlebars({
	layoutsDir: path.join(__dirname, 'blog', 'views', 'layouts'),
	partialsDir: path.join(__dirname, 'blog', 'views', 'partials'),
	defaultLayout: 'index'
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'blog', 'views'));

app.get('/', function (req, res) {
	var postsJsonPath = path.join(__dirname, 'blog', 'data', 'posts.json');
	fs.readFile(postsJsonPath, function (err, data) {
		if (err) {
			return res.send(500);
		}
		
		var posts = JSON.parse(data);
		
		res.render('home', {posts: posts});
	});
});

app.get('/posts/:year/:month/:day/:postName', function (req, res) {
	// check if post-name exists in views/posts
	var day = req.params.day,
		month = req.params.month,
		year = req.params.year,
		postName = req.params.postName,
		viewName = [year, month, day, postName].join('-'),
		viewFilePath = path.join(__dirname, 'blog','views','posts',viewName);

	fs.exists(viewFilePath + '.handlebars', function (exists) {
		if (exists) {
			// just serve it
			console.log(viewFilePath, 'exists');
			res.render('posts/'+viewName);
		} else {
			// check if exists under /blog/posts
			console.log(viewFilePath, 'doesn\'t exist');
			var mdPostFilePath = path.join(__dirname, 'blog', 'posts', viewName)+'.md';
			fs.exists(mdPostFilePath, function (exists) {
				if (exists) {
					console.log(mdPostFilePath, ' exists');
					// render to handlebars, then serve that file
					fs.readFile(mdPostFilePath, 'utf8', function (err, data) {
						if (err) {
							return res.send(404, 'Unable to find post');
						}

						var frontMatterParsed = frontMatter.parse(data);

						MD(frontMatterParsed.body, function (err, content) {
							if (err) {
								return res.send(404, 'unable to find post');
							}

							// write this as a template
							fs.writeFile(viewFilePath + '.handlebars', content, function (err) {
								if (err) {
									return res.send(404, 'Unable to find post');
								}

								return res.render('posts/'+viewName);
							});	
						});
					});
				} else {
					console.log(mdPostFilePath, 'doesn\'t exist');
					fs.readFile(path.join(__dirname, 'public', '404.html'), 'utf8', function (err, data) {
						return res.send(data);
					});
				}
			});

		}
	});
});

// http://asper.me/google8ebf48e5c26a719d.html
app.get('/google8ebf48e5c26a719d.html', function (req, res) {
	fs.readFile(path.join(__dirname, 'public', 'google8ebf48e5c26a719d.html'), 'utf8', function (err, data) {
		if (err) {
			return res.send(404, 'Unable to find the google8ebf48e5c26a719d.html file');
		}

		return res.send(data);
	});
});

app.use('/static/js', express.static(path.join(__dirname, 'blog', 'js')));
app.use('/static/css', express.static(path.join(__dirname, 'blog', 'styles', 'css')));
app.use('/static/img', express.static(path.join(__dirname, 'blog', 'img')));
app.use('/static/fonts', express.static(path.join(__dirname, 'blog', 'fonts')));

var isDevelopment = process.env.NODE_ENV !== 'production';

var server = app.listen(isDevelopment? process.env.PORT : 80, process.env.IP, function () {
	console.log('Listening on port %d', server.address().port);
});