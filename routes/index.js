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
	exec(`xdg-open "${path}"`, (error, stdout, stderr) => {
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
	var stats = fs.statSync(path);
		var date = stats.mtime.toISOString().substr(0,10);
		date=date.replace(/-/g,"");
	client.index({
		index: tag,
		type: '_doc',
		body: {
			name: name,
			path: path,
			date: date
		}
	}).then(function (resp) {
		console.log(resp);
	});
	req.flash('success', "File tagged successfully");
	res.redirect('back');
});

router.get('/search', function (req, res, next) {

	var qry_tag = req.query.search_tag;
	var qry_name = req.query.search_name;
	var qry_extn = req.query.search_extn;
	var qry_date = req.query.search_date;

	console.log(qry_tag);
	console.log(qry_name);
	console.log(qry_extn);
	console.log(qry_date);

	var file = [];
	var extn = [];
	var filep=[];

	if(qry_tag.length >0)
	{

	client.search({
		index: qry_tag,
		type:'_doc',
		size:500,
		body:{
			query:{
					regexp:{
							date: ".*"    
									}
			}
	}
	  }, (err, result) => {
		if (err){
			console.log(err);
			req.flash('alert','No file found');
			res.redirect('/');
		} 
		else
		{
			var list = result.hits.hits;
		for(var i=0;i<list.length;i++)
		{
			console.log(list[i]._source.name,list[i]._source.path);
			file.push(list[i]._source.name);
			filep.push(list[i]._source.path);
			var ext = pathf.extname(list[i]._source.name);
			ext = ext.substring(1);
			if (se.includes(ext))
				extn.push(ext);
			else
				extn.push("*");
		}
		req.flash('success',file.length+' file(s) found');
		res.render('searchres', { file: file, extn: extn,filep:filep });
			
		}
	  });
	}
	
	else
	if(qry_date.length >0)
	{
		var idx;
		if(qry_extn.length>0)
		{
			idx=qry_extn;
		}
		else
		{
			idx="*";
		}
		client.search({
			index: idx,
			type:'_doc',
			size:500,
			body:{
				query:{
						regexp:{
								date: qry_date    
										}
				}
		}
			}, (err, result) => {
			if (err){
				console.log(err);
				req.flash('alert','No file found');
				res.redirect('/');
			} 
			else
			{
				var list = result.hits.hits;
			for(var i=0;i<list.length;i++)
			{
				console.log(list[i]._source.name,list[i]._source.path);
				file.push(list[i]._source.name);
				filep.push(list[i]._source.path);
				var ext = pathf.extname(list[i]._source.name);
				ext = ext.substring(1);
				if (se.includes(ext))
					extn.push(ext);
				else
					extn.push("*");
			}
			req.flash('success',file.length+' file(s) found');
			res.render('searchres', { file: file, extn: extn,filep:filep });
				
			}
			});
	}
	else
	if(qry_extn.length >0)
	{
		client.search({
			index: qry_extn,
			type:'_doc',
			size:500,
			// body:{
			// 	query:{
			// 		match:{
			// 			name:qry_name
			// 		}
			// 	}
			// }
		  }, (err, result) => {
			if (err){
				console.log(err);
				req.flash('alert','No file found');
				res.redirect('/');
			} 
			else
			{
				var list = result.hits.hits;
			for(var i=0;i<list.length;i++)
			{
				console.log(list[i]._source.name,list[i]._source.path);
				file.push(list[i]._source.name);
				filep.push(list[i]._source.path);
				var ext = pathf.extname(list[i]._source.name);
				ext = ext.substring(1);
				if (se.includes(ext))
					extn.push(ext);
				else
					extn.push("*");
			}
			req.flash('success',file.length+' file(s) found');
			res.render('searchres', { file: file, extn: extn,filep:filep });
				
			}
		  });
	}
	else
	{
		req.flash('alert','Please enter correct search query');
		res.redirect('/');
	}

});


module.exports = router;
