#!/bin/sh

# bash script to be run by cron job every 30 minutes
# updates the wait_time table with new (average) estimated_wait as generated from event table

# generate wait_times for event table (difference between time_served and time_joined, in seconds)
# calculate wait_time
# group by position, restaurant
# avg_wait = (sum(wait_time)::decimal) / count(*)

dbname="liveq"
username="postgres"
psql $dbname $username << EOF
begin;
update event 
set wait_time = extract(epoch from(time_served - time_joined))
where time_served is not null;
commit;

begin;
drop table if exists temp_table;
create temp table temp_table as
select 
	restaurant_id as res_id, position as pos, (sum(wait_time)::decimal) / count(*) as avg_wait from event
	group by position, restaurant_id;
commit;

begin;
insert into wait_times(restaurant_id, position, estimated_wait)
select res_id, pos, avg_wait from temp_table;
commit;
EOF

