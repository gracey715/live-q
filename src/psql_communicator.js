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
};

module.exports.getExpectedWaitTime = function(values) {
    return new Promise((resolve, reject) => {
        psql_db.WaitTime.findOne({
            where: values,
        }).then(function(waitTime) {
            if (waitTime != null) resolve(waitTime);
            reject("Record not found");
        });
    });
};