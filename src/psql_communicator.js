const psql_db = require("./psql");

module.exports.logCheckIn = function(values) {
    psql_db.Event.create(values)
    .then(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Success!");
        }
    });
}