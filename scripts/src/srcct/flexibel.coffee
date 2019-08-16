# Operator function for '-'
sub = (x, y) -> x - y

# Operator function for '+', also allow to sum of array
sum = (x, y) ->
	return x.reduce sum unless y?
	x + y

# Operator function for '*', also allow to mul of array
mul = (x, y) ->
	return x.reduce mul unless y?
	x * y

# Operator function for '/'
div = (x, y) -> x / y

# Returns the min of two elements, or min of array
min = (x, y) ->
	return x.reduce min unless y?
	if x < y then x else y

# Returns the max of two elements, or max of array
max = (x, y) ->
	return x.reduce max unless y?
	if x > y then x else y

last = (container) ->
	container[container.length - 1]

first = (container) ->
	container[0]

element = (id) ->
	document.getElementById id
	
valueset = (id, value) ->
	element(id).value = value

valueof = (id) ->
	element(id).value

checkedof = (id) ->
	element(id).checked

htmlset = (id, html) ->
	element(id).innerHTML = html

ejoin = (values) ->
	values.join ""

del = (str, sym) ->
	str.replace(new Regex(sym, "g"), "")

delws = (str, sym) ->
	str.replace(/\w+/, "")

values = (map) ->
	[map.values()...]

keys = (map) ->
	[map.values()...]

maxKey = (map) ->
	keys(map).reduce max

maxValue = (map) ->
	values(map).reduce max

countIt = (map, it) ->
	if map.has it
		map.set it, map.get(it) + 1
	else
		map.set it, 1

makeValueCells = (map) ->
	"<td>#{v}</td>" for v from map.values()

makeKeyCells = (map) ->
	"<td>#{k}</td>" for k from map.keys()