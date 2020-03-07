import matplotlib.pyplot as plt

def die(population_size):
	return population_size * 0.9

def birth(population_size):
	return population_size + (population_size * 0.1)

def steps(population_size, months=20):
	begin = [population_size]
	begin = map(begin, )
	border_counter = 1
	counter = 1
	while True:
		if border_counter == border:
			break
		yield population_size
		border_counter += 1
		population_size = birth(die(population_size))
		counter += 1

initial_population_size = 100

ys = [y for y in step(initial_population_size,1, 8)]
print(ys)

plt.plot(ys)
plt.show()