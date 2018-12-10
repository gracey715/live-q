const psql_db = require("./psql");

module.exports.logCheckIn = function(values) {
    return new Promise((resolve, reject) => {
        psql_db.Event.create(values)
        .then(function(event) {
            resolve(event);
        }).catch(function(err) {
            reject("Unable to create event.");
        });
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

module.exports.logServe = function(values) {
    return new Promise((resolve, reject) => {
        psql_db.Event.update(
            { time_served: new Date().toISOString() },
            { where: values }
        ).then(function(updatedEvents) {
            resolve(updatedEvents[0] === 1);
        }).catch(function(err) {
            reject(err);
        });
    })
}

module.exports.removeEvent = function(values) {
    return new Promise((resolve, reject) => {
        psql_db.Event.destroy({
            where: values
        }).then(function(eventRemoved) {
            resolve(eventRemoved);
        }).catch(function(err) {
            reject(err);
        });
    })
}