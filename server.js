const express = require('express');
const session = require('express-session');
const path = require('path');
const psql_communicator = require("./src/psql_communicator");

const app = express();

var redis = require('redis'), client = redis.createClient();
client.on('connect', function() {
  console.log('Redis client connected');
});
client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

let queue = [];

app.set('view engine', 'hbs');
app.set('views', __dirname + "/views");

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({secret: '6FF28FF9314996EBA7ABDC484A7A6', resave: false, saveUninitialized: true }));

app.get("/", (req, res) => {
    res.render("home.hbs", {
        "stylesheet": "home",
        "pageName": "Home"
    });
});

app.get('/check-in/:restaurant_id', (req, res) => {
    res.render("check-in.hbs", {
        "stylesheet": "check-in",
        "pageName": "Check-In"
    });
});

app.post('/check-in/:restaurant_id', (req, res) => {
    const restaurantID = req.params.restaurant_id;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const partySize = req.body.party_size;
    const phoneNumber = req.body.phone_number;
<<<<<<< HEAD
    // TODO: Add the event to the Redis table
    const eventID = req.params.event_id;
    const cliObj = eventID + "," + restaurantID + "," + firstName + "," + lastName + "," + partySize + "," + phoneNumber + "";
    //console.log(cliObj);
    queue.push(cliObj);
    console.log(cliObj);

    client.set('my test key', queue, redis.print);
    client.get('my test key', function (error, result) {
      if (error) {
        console.log(error);
        throw error;
      }
      //console.log('GET result ->' + result);
    });
=======
>>>>>>> 4c1f0212b85b7a6e6b93698495069414a359e47f

    psql_communicator.logCheckIn({
        restaurant_id: restaurantID,
        time_joined: new Date().toISOString(),
        time_served: null,
        party_size: partySize,
        position: 1
    }).then(function(event) {
        const eventID = event.event_id;
        // TODO: Add the event to the Redis table
    }).catch(function(err) {
        console.log(err);
    });



    res.redirect(`/status/${phoneNumber}`);
});

app.get('/:restaurant_id/status/:event_id', (req, res) => {
    console.log("hi");
    const restaurantID = req.params.restaurant_id;
    const eventID = req.params.event_id;
    // TODO: Get the current queue position from the Redis table
    const phone = req.params.phone_number;
    let splitarray = [];
    let restaurantarray = [];
    let restaurantIDcount = 0;
    for(let i = 0; i < queue.length; i++){
      splitarray = queue[i].split(",");
      restaurantarray.push(splitarray[0]);
    }
    let correct = "";
    for(let i = 0; i < queue.length; i++){
      for(let j = 0; j < queue.length; j++){
        if(queue[i] == restaurantID){
          if(queue[j] == eventID){
            correct = i;
          }
        }
      }
    }
    client.get(correct, function (error, result) {
      if (error) {
        console.log(error);
        throw error;
      }
      //console.log('GET result ->' + result);
    });

    psql_communicator.getExpectedWaitTime({
        restaurant_id: restaurantID,
        position: 1
    }).then(function(waitTime) {
        const currentPosition = 3;
        const estimatedWaitTime = waitTime.estimated_wait;

        res.render("status.hbs", {
            "stylesheet": "status",
            "pageName": "Status",
            "current_position": currentPosition,
            "estimated_wait_time": estimatedWaitTime
        });
    }).catch(err => {
        console.log(err);
        const currentPosition = 3;
        const estimatedWaitTime = "Unknown";
        res.render("status.hbs", {
            "stylesheet": "status",
            "pageName": "Status",
            "current_position": currentPosition,
            "estimated_wait_time": estimatedWaitTime
        });
    });
});

app.get('/restaurant_login', (req, res) => {
    res.render("restaurant_login.hbs", {
        "stylesheet": "restaurant_login",
        "pageName": "Restaurant Login"
    })
})

app.post('/restaurant_login', (req, res) => {
    const restaurantID = req.body.restaurant_id;
    const restaurants = ["la_ratatouille", "jack_rabbit_slims"];
    if (restaurants.includes(restaurantID)) {
        res.redirect(`/dashboard/${restaurantID}`);
    } else {
        res.redirect('/restaurant_login');
    }
});

app.get("/dashboard/:restaurant_id", (req, res) => {
    const restaurantID = req.params.restaurant_id;
    const queue = [];
    // TODO: Get the entire queue from the Redis table
    // TODO: Push each row from the Redis table into "queue", matching the structure of the placeholder
    queue.push({"restaurantID": restaurantID, "eventID": 40, "position": 1, "partyName": "Mason", "partySize": 4}); //placeholder

    res.render("dashboard.hbs", {
        "stylesheet": "dashboard",
        "pageName": "Dashboard",
        "queue": queue
    });
})

app.post("/serve_from_queue/:restaurant_id/:event_id", (req, res) => {
    const restaurantID = req.params.restaurant_id;
    const eventID = req.params.event_id;
    // TODO: Send an alert to the user
    // TODO: Remove the event from Redis table

    psql_communicator.logServe({
        event_id: eventID
    }).then(function(eventUpdated) {
        eventUpdated ? console.log("Serve time logged!") : console.log("Event ID not found.");
    }).catch(function(err) {
        console.log(err);
    });

    res.redirect(`/dashboard/${restaurantID}`);
});

app.post("/remove_from_queue/:restaurant_id/:event_id", (req, res) => {
    const restaurantID = req.params.restaurant_id;
    const eventID = req.params.event_id;
    // TODO: Remove the event from the Redis table

    psql_communicator.removeEvent({
        event_id: eventID
    }).then(function(eventRemoved) {
        eventRemoved ? console.log("Event removed") : console.log("Event ID not found.");
    }).catch(function(err) {
        console.log(err);
    })

    res.redirect(`/dashboard/${restaurantID}`);
});

app.listen(process.env.PORT || 3000);
