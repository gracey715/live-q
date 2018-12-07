const Sequelize = require("sequelize");
const config = require("./psql_config");
const sequelize = new Sequelize(config.getURI());

const Customer = sequelize.define("customer", {
    customer_id: { type: Sequelize.INTEGER, primaryKey: true },
    first_name: { type: Sequelize.STRING },
    last_name: { type: Sequelize.STRING }
}, { freezeTableName: true, timestamps: false });

const Event = sequelize.define("event", {
    event_id: { type: Sequelize.INTEGER, primaryKey: true },
    restaurant_id: { type: Sequelize.STRING },
    time_joined: { type: Sequelize.TIME },
    time_served: { type: Sequelize.TIME },
    party_size: { type: Sequelize.INTEGER },
    position: { type: Sequelize.INTEGER }
}, { freezeTableName: true, timestamps: false });

const Restaurant = sequelize.define("restaurant", {
    restaurant_id: { type: Sequelize.STRING, primaryKey: true },
    customer_id: { type: Sequelize.INTEGER },
    party_size: { type: Sequelize.INTEGER }
}, { freezeTableName: true, timestamps: false });

const WaitTime = sequelize.define("wait_times", {
    restaurant_id: { type: Sequelize.STRING },
    position: { type: Sequelize.INTEGER },
    party_size: { type: Sequelize.INTEGER },
    estimated_wait: { type: Sequelize.INTEGER }
}, { freezeTableName: true, timestamps: false });
WaitTime.removeAttribute('id');