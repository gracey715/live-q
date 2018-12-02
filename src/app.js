const express = require('express');
const session = require('express-session');
const path = require('path');

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
        "stylesheet": "home"
    });
});

app.get('/check-in/:restaurant_id', (req, res) => {
    res.render("check-in.hbs", {
        "stylesheet": "check-in"
    });
});

app.post('/check-in/:restaurant_id', (req, res) => {
    const restaurantID = req.params.restaurant_id;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const partySize = req.body.party_size;
    const phoneNumber = req.body.phone_number;
    //Add event to logging and Redis databases
    res.redirect(`/status/${phoneNumber}`);
});

app.get('/status/:event_id', (req, res) => {
    const eventID = req.params.event_id;
    const currentPosition = 3; //placeholder; get this from the Redis database for the queue
    const estimatedWaitTime = 10; //placeholder; get this from the SQL database for the wait time averages
    res.render("status.hbs", {
        "stylesheet": "status",
        "current_position": currentPosition,
        "estimated_wait_time": estimatedWaitTime
    });
});

app.listen(process.env.PORT || 3000);