const Sequelize = require("sequelize");
const config = require("./psql_config");
const sequelize = new Sequelize(config.getURI(), { logging: false } );

module.exports.Event = sequelize.define("event", {
    event_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    restaurant_id: { type: Sequelize.STRING },
    time_joined: { type: Sequelize.NOW },
    time_served: { type: Sequelize.NOW },
    party_size: { type: Sequelize.INTEGER },
    position: { type: Sequelize.INTEGER }
}, { freezeTableName: true, timestamps: false });

module.exports.WaitTime = sequelize.define("wait_times", {
    restaurant_id: { type: Sequelize.STRING },
    position: { type: Sequelize.INTEGER },
    estimated_wait: { type: Sequelize.INTEGER }
}, { freezeTableName: true, timestamps: false });
module.exports.WaitTime.removeAttribute('id');