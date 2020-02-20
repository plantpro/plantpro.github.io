###
	Source provider
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

srcProviderShowSrcs = () ->
	provider = element "src-provider"
	sources = []
	k = 0
	for i in provider.children
		i.innerText = "[" + (k + 1) + "] " + i.innerText
		console.log i
		sources.push [i.innerText, k]
		k += 1
	title = document.createElement "h5"
	title.innerText = "Источники"
	provider.prepend title
	provider.style.display = "block"

	providerButton = document.getElementById "src-provider-button"
	providerButton.style.display = "none"

	kinders = document.getElementsByClassName "src-provider-info"

	for element in kinders
		num = Number.parseInt (element.getAttribute "src-no")
		element.innerHTML = element.innerHTML + " [" + num + "]"

document.srcProviderShowSrcs = srcProviderShowSrcs