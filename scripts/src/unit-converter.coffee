#: import flexibel.coffee

converter = (name) ->
	{ name }

makeSelect = (id, items) ->
	result = "<select id=#{id}>"
	result += """<option value="#{i.name}">#{i.name}</option>""" for i in items
	result + "</select>"

fromUnitsList = element "from-units"
toUnitsList = element "to-units"

weightGroup = [
	converter "мкг"
	converter "мг"
	converter "г"
	converter "кг"
	converter "ц"
	converter "т"
	converter "а.е.м."
]

weightConverter = (value, fr, to) ->
	switch fr.name
		when "мкг"
			return switch to.name
				when "мкг" then value
				when "мг" then value / 10**3
				when "г" then value / 10**6
				when "кг" then value / 10**9
				when "ц" then value / 10**11
				when "т" then value / 10**12
				when "а.е.м." then value / (1.66053906660*10**(-19))
		when "мг"
			return switch to.name
				when "мкг" then value * 10**3
				when "мг" then value
				when "г" then value / 10**3
				when "кг" then value  / 10**6
				when "ц" then value  / 10**8
				when "т" then value  / 10**9
				when "а.е.м." then value / (1.66053906660*10**(-21))
		when "г"
			return switch to.name
				when "мкг" then value * 10**6
				when "мг" then value * 10**3
				when "г" then value
				when "кг" then value  / 10**3
				when "ц" then value  / 10**5
				when "т" then value  / 10**6
				when "а.е.м." then value / (1.66053906660*10**(-24))
		when "кг"
			return switch to.name
				when "мкг" then value * 10**9
				when "мг" then value * 10**6
				when "г" then value * 10**3
				when "кг" then value 
				when "ц" then value / 10**2
				when "т" then value  / 10**3
				when "а.е.м." then value / (1.66053906660*10**(-27))
		when "ц"
			return switch to.name
				when "мкг" then value * 10**11
				when "мг" then value * 10**8
				when "г" then value * 10**5
				when "кг" then value * 10**2
				when "ц" then value
				when "т" then value / 10
				when "а.е.м." then value / (1.66053906660*10**(-29))
		when "т"
			return switch to.name
				when "мкг" then value * 10**12
				when "мг" then value * 10**9
				when "г" then value * 10**6
				when "кг" then value * 10**3
				when "ц" then value * 10**2
				when "т" then value
				when "а.е.м." then value / (1.66053906660*10**(-30))
		when "а.е.м."
			return switch to.name
				when "мкг" then value * 1.66053906660*10**(-19)
				when "мг" then value * 1.66053906660*10**(-21)
				when "г" then value * 1.66053906660*10**(-24)
				when "кг" then value * 1.66053906660*10**(-27)
				when "ц" then value * 1.66053906660*10**(-29)
				when "т" then value * 1.66053906660*10**(-30)
				when "а.е.м." then value

yieldGroup = [
	converter "т/га"
	converter "ц/га"
	converter "кг/м^2"
	converter "кг/га"
	converter "т/акр"
	converter "ц/акр"
	converter "кг/акр"
]

yieldConverter = (value, fr, to) ->
	switch fr.name
		when "т/га"
			return switch to.name
				when "т/га" then value
				when "ц/га" then value * 10
				when "кг/га" then value * 1000
				when "кг/м^2" then value * 1000 * 10000
				when "т/акр" then value * 0.405
				when "ц/акр" then (value * 0.405) / 100
				when "кг/акр" then value * 0.405
		when "ц/га"
			return switch to.name
				when "ц/га" then value
				when "т/га" then value / 10
				when "кг/га" then value * 100
				when "кг/м^2" then value * 100 * 10000
				when "т/акр" then (value * 0.405) / 10000
				when "ц/акр" then (value * 0.405) / 1000
				when "кг/акр" then value * 0.405 / 100
		when "кг/м^2"
			return switch to.name
				when "ц/га" then value / 100 / 10000
				when "т/га" then value / 1000 / 10000
				when "кг/га" then value / 10000
				when "кг/м^2" then value
				when "т/акр" then (value * 0.405) / 1000 / 1000 / 10000
				when "ц/акр" then (value * 0.405) / 1000 / 100 / 10000
				when "кг/акр" then value * 0.405  / 10000 / 1000
		when "кг/га"
			return switch to.name
				when "ц/га" then value * 100
				when "т/га" then value * 1000
				when "кг/га" then value
				when "кг/м^2" then value * 10000

state = {
	group: yieldGroup
	convert: yieldConverter
}

findInGroup = (name) ->
	for i in state.group
		if i.name == name
			return i

onselec = (e) ->
	fromUnit = element "from-unit"
	fromu = findInGroup fromUnit.options[fromUnit.selectedIndex].value
	toUnit = element "to-unit"
	tou = findInGroup toUnit.options[toUnit.selectedIndex].value

	fromValue = runParser(valueof "from-unit-value")
	valueset "to-unit-value", (state.convert fromValue, fromu, tou)

changeGroup = () ->
	unitGroup = element "unit-group"
	groupName = unitGroup.options[unitGroup.selectedIndex].value
	switch groupName
		when "yield"
			state.group = yieldGroup
			state.convert = yieldConverter
		when "mass"
			state.group = weightGroup
			state.convert = weightConverter

	fromUnitsList.innerHTML = makeSelect "from-unit", state.group
	toUnitsList.innerHTML = makeSelect "to-unit", state.group

	element "from-unit"
		.addEventListener("change", onselec)
	element "to-unit"
		.addEventListener("change", onselec)

element "from-unit-value"
	.addEventListener("change", onselec)
element "unit-group"
	.addEventListener("change", changeGroup)

changeGroup()