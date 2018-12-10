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


/*const cliObj = restaurantID + "," + firstName + "," + lastName + "," + partySize + "," + phoneNumber + "";
// TODO: Add the event to the Redis table

client.on("cliObj", function(req,res){
  queue.push(res);
  console.log(queue);
});

client.set('myqueue', queue);
client.get('myqueue', function(err,res){
  console.log(res);
});*/
