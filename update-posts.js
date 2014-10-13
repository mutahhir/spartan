var fs = require("fs"),
    path = require("path"),
    _ = require('lodash'),
    moment = require('moment'),
    async = require('async'),
    frontMatter = require('json-front-matter');
    
var postsPath = path.join(__dirname, 'blog', 'posts');

fs.readdir(postsPath, function (err, filenames) {
    if (err) {
        return console.error('Error: ', err);
    }
    
    async.map(filenames, function (fname, callback) {
        var nameparts = fname.split('-');
        if (nameparts.length > 3) {
            // the very least we *require* is 4, the file has to be in the format of year-month-date-postnamewithdashes
            var year = parseInt(nameparts[0], 10),
                month = parseInt(nameparts[1], 10),
                day = parseInt(nameparts[2], 10),
                postDate = moment({year: year, month: month, day: day}),
                postName = nameparts.slice(3).join(' ').replace('.md', ''),
                filePath = path.join(__dirname, 'blog', 'posts', fname);
                
            fs.readFile(filePath, 'utf8', function (err, fileData) {
                if (err) {
                    console.error(err);
                    return callback(err);
                }
                
                var frontMatterParsed = frontMatter.parse(fileData);
                
                return callback(null, {
                    name: fname,
                    postName: postName,
                    postDate: postDate,
                    frontMatter: frontMatterParsed.attributes
                });
            });
        } else {
           // error
           callback(new Error('The post (' + fname + ') does not conform to the required template'));
        }
    }, function done(err, results) {
        var postsListFilePath = path.join(__dirname, 'blog', 'data', 'posts.json');
        fs.writeFile(postsListFilePath, JSON.stringify(results, true, 4), 'utf8', function (err, result) {
            if (err) {
                return console.error(err);
            }
            console.log('Done!');
        });
    });

    // open each file and read up their file front-matter
})