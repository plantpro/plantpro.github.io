#: import flexibel.coffee

converter = (name, toBase, fromBase) ->
	{ name, toBase, fromBase }


makeSelect = (id, items) ->
	result = "<select id=#{id}>"
	result += """<option value="#{i.name}">#{i.name}</option>""" for i in items
	result + "</select>"

fromUnitsList = element "from-units"
toUnitsList = element "to-units"

weightGroup = [
	converter("мкг", ((x) -> x * 10 ** 6), (x) -> x / (10 ** 6)),
	converter("мг", ((x) -> x * 10 ** 3), (x) -> x / (10 ** 3)),
	converter("г", ((x) -> x), (x) -> x),
	converter("кг", ((x) -> x * 1000), (x) -> x / 1000)
]

findInGroup = (name, group) ->
	for i in group
		if i.name == name
			return i

onselec = (e) ->
	fromUnit = element "from-unit"
	fromu = findInGroup fromUnit.selectedOptions[0].value, weightGroup
	toUnit = element "to-unit"
	tou = findInGroup fromUnit.selectedOptions[0].value, weightGroup

	fromValue = Number.parse(valueof "from-unit-value")
	valueset "to-unit-value", (tou.fromBase (fromu.toBase fromValue))

fromUnitsList.innerHTML = makeSelect "from-unit", weightGroup
toUnitsList.innerHTML = makeSelect "to-unit", weightGroup

element "from-unit-value"
	.addEventListener("change", onselec)
element "from-unit"
	.addEventListener("select", onselec)
element "to-unit"
	.addEventListener("select", onselec)