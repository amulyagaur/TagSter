var express = require('express');
var router = express.Router();
const fs = require('fs');
const pathf = require('path');
var se = ["zip","xml","xls","txt","svg","rtf","psd","ppt","pptx","png","pdf","mp3","mp4","json","js","jpg","iso","html","flash","fla","exe","dwg","doc","docx","dir","dbf","csv","css","avi","ai"];

const { exec } = require('child_process');
/* GET home page. */
router.get('/', function(req, res, next) {
  
  var path = req.query.path;
  if(!path)
  path = '/home/amulya';
  var fl = fs.readdirSync(path);
  fl = fl.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
  var dir=[];
  var file=[];
  var extn=[];
  for(var i=0;i<fl.length;i++)
  {
    if(fs.lstatSync(path+'/'+fl[i]).isDirectory())
    {
      dir.push(fl[i]);
    }
    else
    {
      var ext = pathf.extname(fl[i]);
      ext = ext.substring(1);
      if(se.includes(ext))
      extn.push(ext);
      else  
      extn.push("*");
      file.push(fl[i]);
    }
  }
  
  res.render('index', { dir: dir,file:file,path:path,extn:extn });
});

router.get('/file',function(req, res, next){

  var path = req.query.path;
  exec(`xdg-open ${path}`, (error, stdout, stderr) => {
    if (error) {
      return;
    }
    
  });
  res.redirect('back');
});

router.get('/tagfile',function(req, res, next){
  
});

module.exports = router;
