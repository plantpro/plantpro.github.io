#: import flexibel.coffee

converter = (name, toBase, fromBase) ->
	{ name, toBase, fromBase }

makeSelect = (id, items) ->
	result = "<select id=#{id}>"
	result += """<option value="#{i.name}">#{i.name}</option>""" for i of items
	result + "</select>"

fromUnitsList = element "from-units"
toUnitsList = element "to-units"

weightGroup = [
	converter("мкг", ((x) -> x * 10 ** 6), (x) -> x / (10 ** 6)),
	converter("мг", ((x) -> x * 10 ** 3), (x) -> x / (10 ** 3)),
	converter("г", ((x) -> x), (x) -> x),
	converter("кг", ((x) -> x * 1000), (x) -> x / 1000)
]

fromUnitsList.innerHTML = makeSelect "from-unit", weightGroup
toUnitsList.innerHTML = makeSelect "to-unit", weightGroup