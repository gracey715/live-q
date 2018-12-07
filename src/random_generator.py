# from faker import Faker 
# from faker.providers import date_time, person, phone_number
import random
import csv

# fake = Faker()

position_to_time = {1: list(range(10)), 2: list(range(3, 15)), 3: list(range(8, 20)), 4: list(range(12, 25)), 5: list(range(15, 30)),
					6: list(range(18, 35)), 7: list(range(20, 38)), 8: list(range(23, 40)), 9: list(range(25, 45)), 10: list(range(30, 50))}

restaurants = ['la_ratatouille', 'jack_rabbit_slims']

with open ('mock.csv', 'w', newline='') as file:
	writer = csv.writer(file, quotechar='|', quoting=csv.QUOTE_MINIMAL)
	for i in range(1000):
		# restaurant id, position, party size, estimated wait
		position = random.randint(1, 10)
		line = [random.choice(restaurants), str(position), str(random.randint(1, 10)), str(random.choice(position_to_time[position]))]
		writer.writerow(line)

