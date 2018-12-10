const express = require('express');
const session = require('express-session');
const path = require('path');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + "/views");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: '6FF28FF9314996EBA7ABDC484A7A6',
    resave: false,
    saveUninitialized: true,
}));

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
    // TODO: Add the event to the Redis table
    // TODO: Add the event to the logging table
    res.redirect(`/status/${phoneNumber}`);
});

app.get('/status/:event_id', (req, res) => {
    const eventID = req.params.event_id;
    // TODO: Get the current queue position from the Redis table
    // TODO: Get the estimated wait time from the averages table
    const currentPosition = 3; //placeholder
    const estimatedWaitTime = 10; //placeholder
    res.render("status.hbs", {
        "stylesheet": "status",
        "pageName": "Status",
        "current_position": currentPosition,
        "estimated_wait_time": estimatedWaitTime
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
    // TODO: Handle the event where an invalid restaurant ID is given
    res.redirect(`/dashboard/${restaurantID}`);
});

app.get("/dashboard/:restaurant_id", (req, res) => {
    const restaurantID = req.params.restaurant_id;

    const queue = [];
    // TODO: Get the entire queue from the Redis table
    // TODO: Push each row from the Redis table into "queue", matching the structure of the placeholder
    queue.push({"eventID": 123, "position": 1, "partyName": "Mason", "partySize": 4}); //placeholder

    res.render("dashboard.hbs", {
        "stylesheet": "dashboard",
        "pageName": "Dashboard",
        "queue": queue
    });
})

app.post("/serve_from_queue/:event_id", (req, res) => {
    const eventID = req.params.event_id;
    // TODO: Send an alert to the user
    // TODO: Remove the event from Redis table
    // TODO: Update the event in the logging table
    res.send("Serve route triggered");
});

app.post("/remove_from_queue/:event_id", (req, res) => {
    const eventID = req.params.event_id;
    // TODO: Remove the event from the Redis table
    // TODO: Remove the event from the logging table
    require('dotenv').config();

    client.messages
        .create({
            body: 'You\'re the next in line!',
            from: '+18627019037',
            to: '+16464794830'
        })
    .then(message => console.log(message.sid))
    .done();
    res.send("Remove route triggered");
});

app.listen(process.env.PORT || 3000);
