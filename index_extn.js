var find = require('find');
var files = find.fileSync('/home/amulya/Pictures');
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
    if(ext.length>0)
    {
        client.index({
            index: ext,
            type: '_doc',
            body: {
                name: path.posix.basename(files[i]),
                path: files[i]
            }
        }).then(function (resp) {
            console.log(resp);
        });
    }
}