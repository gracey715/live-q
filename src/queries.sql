-- QUERIES FOR EVENT TABLE
-- Insert a new event into the event table
INSERT INTO event(restaurant_id, time_joined, time_served, party_size, position) VALUES (?, ?, ?, ?, ?);

-- Update time_served when a party is served
UPDATE event SET time_served = ? WHERE event_id = ?;



-- QUERIES FOR WAIT_TIMES TABLE
-- Get the average wait time for a certain position in line
SELECT avg(estimated_wait) FROM wait_times 
WHERE position = ? AND restaurant_id ILIKE ?;

-- Update the estimated wait time for a position
UPDATE wait_times SET estimated_wait = ? WHERE position = ?;