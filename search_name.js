
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'trace'
});
client.search({
    index: 'pdf',
    type:'_doc',
    size:500,
    body:{
        query:{
            match:{
                name:'Softablitz'
            }
        }
    }
  }, (err, result) => {
    if (err){
        console.log(err);
    } 
    else
    {
        var list = result.hits.hits;
    for(var i=0;i<list.length;i++)
    {
        console.log(list[i]._source.name,list[i]._source.path);
       
    }
       
    }
  });