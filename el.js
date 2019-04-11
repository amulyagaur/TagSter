var find = require('find');
var reg = new RegExp('game');
find.file(reg,'/home/amulya/Documents', function(files) {
console.log(files);
})