var express = require('express');
var router = express.Router();
const fs = require('fs');
const pathf = require('path');
var se = ["zip", "xml", "xls", "txt", "svg", "rtf", "psd", "ppt", "pptx", "png", "pdf", "mp3", "mp4", "json", "js", "jpg", "iso", "html", "flash", "fla", "exe", "dwg", "doc", "docx", "dir", "dbf", "csv", "css", "avi", "ai"];
var bodyParser = require('body-parser')
const { exec } = require('child_process');
/* GET home page. */
var flash = require('connect-flash');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'trace'
});

client.ping({
	requestTimeout: 30000,
}, function (error) {
	if (error) {
		console.error('elasticsearch cluster is down!');
	} else {
		console.log('All is well');
	}
});


router.get('/', function (req, res, next) {

	var path = req.query.path;
	if (!path)
		path = '/home/amulya';
	var fl = fs.readdirSync(path);
	fl = fl.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
	var dir = [];
	var file = [];
	var extn = [];
	for (var i = 0; i < fl.length; i++) {
		if (fs.lstatSync(path + '/' + fl[i]).isDirectory()) {
			dir.push(fl[i]);
		}
		else {
			var ext = pathf.extname(fl[i]);
			ext = ext.substring(1);
			if (se.includes(ext))
				extn.push(ext);
			else
				extn.push("*");
			file.push(fl[i]);
		}
	}

	res.render('index', { dir: dir, file: file, path: path, extn: extn });
});

router.get('/file', function (req, res, next) {

	var path = req.query.path;
	exec(`xdg-open ${path}`, (error, stdout, stderr) => {
		if (error) {
			return;
		}

	});
	res.redirect('back');
});

router.post('/tagfile', function (req, res, next) {
	var path = req.query.path;
	var name = req.query.name;
	var tag = req.body.tagfield;

	client.index({
		index: tag,
		type: '_doc',
		body: {
			name: name,
			path: path
		}
	}).then(function (resp) {
		console.log(resp);
	});
	req.flash('success', "File tagged successfully");
	res.redirect('back');
});

router.post('/search', function (req, res, next) {
	var qry = req.body.query;
});
module.exports = router;
