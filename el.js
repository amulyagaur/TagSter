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

client.search({
index: 'ddos'
}).then(function (resp) {

var list = resp.hits.hits;
for(var i=0;i<list.length;i++)
{
    console.log(list[i]._source.name,list[i]._source.path);
}

}, function (err) {
    console.trace(err.message);
});


// client.index({
//     index: 'ddos',
//     type: '_doc',
//     body: {
//         name: 'huhu.txt',
//         path: '/home/amulya/DR.txt'
//     }
// }).then(function (resp) {
//     console.log(resp);
// });
