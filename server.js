const express = require('express');
const session = require('express-session');
const path = require('path');
const psql_communicator = require("./src/psql_communicator");
const twilio_config = require("./src/twilio_config");
const twilio = require("twilio")(twilio_config.getSID(), twilio_config.getToken());

const app = express();

const redis_config = require("./src/redis_config");
const redis = require('redis');
const client = redis.createClient({
    port: redis_config.getPort(),
    host: redis_config.getHost(),
    password: redis_config.getPassword()
});

var assert = require('assert');
client.on('connect', function() {
  console.log('Redis client connected');
});
client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

let queue = [];
let newqueue = [];

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

    psql_communicator.logCheckIn({
        restaurant_id: restaurantID,
        time_joined: new Date().toISOString(),
        time_served: null,
        party_size: partySize,
        position: 1
    }).then(function(event) {
        const eventID = event.event_id;
        // TODO: Add the event to the Redis table
        const cliObj = eventID + "," + restaurantID + "," + firstName + "," + lastName + "," + partySize + "," + phoneNumber + "";
        const eventrest = eventID + "," + restaurantID + "";
        queue.push(cliObj);

        client.lpush('helloworld', cliObj);
        client.lrange('helloworld', 0, -1, function(err, reply) {
          //console.log(reply);
        });

        res.redirect(`/${restaurantID}/status/${eventID}`);
    }).catch(function(err) {
        console.log(err);
        res.redirect(`/check-in/${restaurantID}`);
    });
});

app.get('/:restaurant_id/status/:event_id', (req, res) => {
    const restaurantID = req.params.restaurant_id;
    const eventID = req.params.event_id;
    // TODO: Get the current queue position from the Redis table
    let position = 0;
    let count = 0;
    client.lrange('helloworld', 0, -1, function (error, result) {
      position = result.length;
      if (error) {
        console.log(error);
        throw error;
      }
      let resID = '';
      let objs = [];
      for(let i = 0; i < result.length; i++){
        let resultarray = result[i].split(',');
        if(resultarray[0] == eventID){
          resID = resultarray[1];
          //count = count + 1;
          break;
        }
        //count = count + 1;
        objs.push(result[i]);
      }
      //console.log(objs.length);
      for(let i = 0; i < objs.length; i++){
        let objsarray = objs[i].split(',');
        if(objsarray[1] == resID){
          count = count + 1;
          //position = position + 1;
        }
      }
      position = position - count;

      psql_communicator.getExpectedWaitTime({
        restaurant_id: restaurantID,
        position: position
      }).then(function(waitTime) {
          //const currentPosition = 3;
          const currentPosition = position;
          const estimatedWaitTimeInSeconds = waitTime.estimated_wait;
          const estimatedWaitTimeInMinutes = Math.ceil(estimatedWaitTimeInSeconds / 60);

          res.render("status.hbs", {
              "stylesheet": "status",
              "pageName": "Status",
              "current_position": currentPosition,
              "estimated_wait_time": estimatedWaitTimeInMinutes
            });
        }).catch(err => {
            console.log(err);
          //const currentPosition = 3;
          const currentPosition = position;
          const estimatedWaitTime = "Unknown";
          res.render("status.hbs", {
            "stylesheet": "status",
            "pageName": "Status",
            "current_position": currentPosition,
            "estimated_wait_time": estimatedWaitTime
          });
        });
    })
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
    const positionarray = [];
    // TODO: Get the entire queue from the Redis table
    client.lrange('helloworld', 0, -1, function (error, result) {
      let position = result.length;
      for(let i = 0; i < result.length; i++){
        let resultarray = result[i].split(',');
        if(resultarray[1] == restaurantID){
        //console.log(resultarray);
          let event1 = resultarray[0];
        //console.log(event1);
          position = position - 1;

          let name1 = resultarray[3];
          let size1 = resultarray[4];
          queue.unshift({"restaurantID": restaurantID, "eventID": event1, "position": position + 1, "partyName": name1, "partySize": size1});
        }
      }

      res.render("dashboard.hbs", {
        "stylesheet": "dashboard",
        "pageName": "Dashboard",
        "queue": queue
      });
    });
})

app.post("/serve_from_queue/:restaurant_id/:event_id", (req, res) => {
    const restaurantID = req.params.restaurant_id;
    const eventID = req.params.event_id;
    const restaurant = restaurantID === "la_ratatouille" ? "La Ratatouille" : "Jack Rabbit Slims";

    client.lrange('helloworld', 0, -1, function (error, events) {
        for (let i = 0; i < events.length; i++) {
            const [curEventID, curRestaurantID, firstName, lastName, partySize, phoneNumber] = events[i].split(",");
            if (curEventID === eventID) {
                twilio.messages.create({
                    body: `Hey ${firstName}, a table is now ready for you at ${restaurant}! Thank you for using LiveQ!`,
                    from: "+18627019037",
                    to: `+1${phoneNumber}`
                }).done();
            }
        }

    });

    client.lrange('helloworld',0, -1, function(err, result) {
      console.log("result: " + result);
      for(let i = 0; i < result.length; i++){
        let resultarray = result[i].split(',');
        if(resultarray[0] == eventID){
          client.lrem('helloworld', i, result[i]);
        }
      }

      psql_communicator.logServe({
        event_id: eventID
        }).then(function(eventUpdated) {
            eventUpdated ? console.log("Serve time logged!") : console.log("Event ID not found.");
        }).catch(function(err) {
            console.log(err);
        });

        res.redirect(`/dashboard/${restaurantID}`);
    });
});

app.post("/remove_from_queue/:restaurant_id/:event_id", (req, res) => {
    const restaurantID = req.params.restaurant_id;
    const eventID = req.params.event_id;
    // TODO: Remove the event from the Redis table
    client.lrange('helloworld', 0, -1, function(err, result) {
      console.log(result);
      for(let i = 0; i < result.length; i++){
        let resultarray = result[i].split(',');
        if(resultarray[0] == eventID){
          client.lrem('helloworld', i, result[i]);
        }
      }

      psql_communicator.removeEvent({
        event_id: eventID
    }).then(function(eventRemoved) {
        eventRemoved ? console.log("Event removed") : console.log("Event ID not found.");
    }).catch(function(err) {
        console.log(err);
    })

    res.redirect(`/dashboard/${restaurantID}`);
    });
});

app.listen(process.env.PORT || 3000);
