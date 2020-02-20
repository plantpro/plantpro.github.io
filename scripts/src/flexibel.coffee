# Operator function for '-'
sub = (x, y) -> x - y

# Operator function for '+', also allow to sum of array
sum = (x, y) ->
	return x.reduce document.flexibel.sum unless y?
	x + y

# Operator function for '*', also allow to mul of array
mul = (x, y) ->
	return x.reduce document.flexibel.mul unless y?
	x * y

# Operator function for '/'
div = (x, y) -> x / y

# Returns the min of two elements, or min of array
min = (x, y) ->
	return x.reduce document.flexibel.min unless y?
	if x < y then x else y

# Returns the max of two elements, or max of array
max = (x, y) ->
	return x.reduce document.flexibel.max unless y?
	if x > y then x else y

last = (container) ->
	container[container.length - 1]

first = (container) ->
	container[0]

neue = (name, inner) ->
	elem = document.createElement name
	elem.innerHTML = inner unless inner?
	elem

neueText = (name, inner) ->
	elem = document.createElement name
	elem.innerText = inner unless inner?
	elem

div = (inner) ->
	elem = document.createElement "div"
	elem.innerHTML = inner unless inner?
	elem

h1 = (text) ->
	neueText "h1", text

h2 = (text) ->
	neueText "h2", text

h3 = (text) ->
	neueText "h3", text

h4 = (text) ->
	neueText "h4", text

h5 = (text) ->
	neueText "h5", text

h6 = (text) ->
	neueText "h6", text

element = (id) ->
	document.getElementById id
	
valueset = (id, value) ->
	document.flexibel.element(id).value = value

valueof = (id) ->
	document.flexibel.element(id).value

checkedof = (id) ->
	document.flexibel.element(id).checked

htmlset = (id, html) ->
	document.flexibel.element(id).innerHTML = html

htmlget = (id) ->
	document.flexibel.element(id).innerHTML

any = (values, f) ->
	for i in values
		return true	if f i
	return false

all = (values, f) ->
	for i in values
		return false unless f i
	return true

ejoin = (values) ->
	values.join ""

delws = (str, sym) ->
	str.replace(/\s+/g, "")

values = (map) ->
	[map.values()...]

keys = (map) ->
	[map.keys()...]

maxKey = (map) ->
	document.flexibel.keys(map).reduce document.flexibel.max

maxValue = (map) ->
	document.flexibel.values(map).reduce document.flexibel.max

countIt = (map, it) ->
	if map.has it
		map.set it, map.get(it) + 1
	else
		map.set it, 1

makeValueCells = (map) ->
	"<td>#{v}</td>" for v from map.values()

makeKeyCells = (map) ->
	"<td>#{k}</td>" for k from map.keys()

makeMapCells = (values, mapper) ->
	"<td>#{mapper k}</td>" for k from values

document.flexibel = {
	makeKeyCells,
	makeValueCells,
	countIt,
	maxValue,
	maxKey,
	keys,
	values,
	delws,
	ejoin,
	htmlset,
	checkedof,
	valueof,
	valueset,
	element,
	first,
	last,
	max,
	min,
	sum,
	sub,
	mul,
	div,
	all,
	any
}