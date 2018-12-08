var redis = require('redis'), client = redis.createClient();

let restaurants = [];
let queue = [];

client.on("client", function(req,res){
  queue.push(res);
});

client.set('myqueue', queue);
client.get('myqueue', function(err,res){
  console.log(res);
});
