DROP TABLE IF EXISTS restaurant;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS wait_times;

CREATE TABLE customer(
	-- Customer ID will be the phone number they use to check in
	customer_id INTEGER NOT NULL,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	PRIMARY KEY(customer_id)
);

-- Contains userIDs of users that checked in, their party size
CREATE TABLE restaurant(
	restaurant_id VARCHAR(255),
	customer_id INTEGER REFERENCES customer(customer_id),
	party_size INTEGER NOT NULL,
	PRIMARY KEY(restaurant_id)
);

-- Contains information on each "event", ie. one instance of a party checking in to the restaurant
CREATE TABLE event(
	event_id SERIAL,
	restaurant_id VARCHAR(255) REFERENCES restaurant(restaurant_id),
	time_joined TIMESTAMPTZ NOT NULL,
	time_served TIMESTAMPTZ,
	party_size INTEGER NOT NULL,
	position INTEGER NOT NULL,
	PRIMARY KEY (event_id)
);

CREATE TABLE wait_times(
	restaurant_id VARCHAR(255) REFERENCES restaurant(restaurant_id),
	position INTEGER NOT NULL,
	party_size INTEGER NOT NULL,
	estimated_wait INTEGER
);