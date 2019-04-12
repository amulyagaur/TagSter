var find = require('find');
var files = find.fileSync('/home/amulya/Documents');
const path = require('path');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'trace'
});
for(var i=0;i<files.length;i++)
{
    var file_name = path.posix.basename(files[i]);
    client.index({
        index: file_name,
        type: '_doc',
        body: {
            name: file_name,
            path: files[i]
        }
    }).then(function (resp) {
        console.log(resp);
    });

}
console.log('Done');