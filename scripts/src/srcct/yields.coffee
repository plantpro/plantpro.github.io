###
	Yield application
	Autor: Tsvikevich Denis 2020
###

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
	elem.innerHTML = inner if inner?
	elem

neueText = (name, inner) ->
	elem = document.createElement name
	elem.innerText = inner if inner?
	elem

div = (inner) ->
	elem = document.createElement "div"
	elem.innerHTML = inner if inner?
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
	if id.startsWith "."
		return document.getElementsByClassName (id.substring 1)
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

unique = (values) ->
	[new Set(values)...]

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

runParser = (input) ->
	parserState = {
		result: []
		currentPosition: 0
		input: input
	}

	getCurrent = (state) ->
		state.input[state.currentPosition]
	
	next = (state) ->
		current = getCurrent state
		state.currentPosition++
		current

	parseNumber = (state) ->
		buffer = next state
		while (current = next state) in "0123456789."
			buffer += current
		state.result.push parseFloat(buffer)

	while parserState.currentPosition < input.length
		if (getCurrent parserState) in "0123456789-"
			parseNumber parserState
		else
			next parserState
	
	parserState.result

runApplication = () ->
	evalPotentialYield()

fail = (error) ->
	htmlset "errorlogs", """<p style="color: red;">#{error}</p>"""
	off

clearError = () ->
	fail ""

evalPotentialYield = () ->
	par = runParser valueof "par"
	coeffpar = runParser valueof "coeff-par"
	cval = runParser valueof "cval"
	wetbase = runParser valueof "wetbase"
	partadd = runParser valueof "partadd"


	py = (par * coeffpar) / (1000 * cval)
	pybase = (py * 100) / ((100 - wetbase) * (1 + partadd))
	pyadd = pybase * partadd

	htmlset "result", "ПУ = #{py}<br>ПУ<sub>осн</sub> = #{pybase}<br>ПУ<sub>поб</sub> = #{pyadd}"

element "runButton"
	.addEventListener("click", runApplication)