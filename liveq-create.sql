DROP TABLE IF EXISTS restaurant;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS event;

-- Contains userIDs of users that checked in, their party size
CREATE TABLE restaurant {
	restaurant_id SERIAL,
	user_id INTEGER REFERENCES user(user_id),
	party_size INTEGER NOT NULL,
	PRIMARY KEY(restaurant_id)
}

CREATE TABLE user {
	-- User ID will be the phone number they use to check in
	user_id INTEGER NOT NULL,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	PRIMARY KEY(user_id)
}

-- Contains information on each "event", ie. one instance of a party checking in to the restaurant
CREATE TABLE event {
	event_id SERIAL,
	restaurant_id INTEGER REFERENCES restaurant(restaurant_id),
	time_joined TIMESTAMP NOT NULL,
	time_served TIMESTAMP NOT NULL,
	party_size INTEGER NOT NULL,
	position INTEGER NOT NULL,
	PRIMARY KEY (event_id)
}