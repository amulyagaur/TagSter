var find = require('find');
var fs = require('fs');
var files = find.fileSync('/home/amulya/Documents');
const path = require('path');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'trace'
});
for(var i=0;i<files.length;i++)
{
    var ext = path.extname(files[i]);
    ext = ext.substring(1);
    var stats = fs.statSync(files[i]);
    var date = stats.mtime.toISOString().substr(0,10);
    date=date.replace(/-/g,"");
    console.log(date);
    if(ext.length>0)
    {
        client.index({
            index: ext,
            type: '_doc',
            body: {
                name: path.posix.basename(files[i]),
                path: files[i],
                date: date
            }
        }).then(function (resp) {
            console.log(resp);
        });
    }
}