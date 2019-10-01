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

startSearch = (name) ->
	input = new RegExp(name, "i")
	for entry in element("search-container").children
		entry.hidden = no
		entry.hidden = yes unless matchContent entry, input

matchContent = (element, input) ->
	firstTest = input.test element.getElementsByClassName("mdl-card__title-text")[0].innerText
	secondTest = input.test element.getElementsByClassName("mdl-card__supporting-text")[0].innerText
	thridTest = any(element.getElementsByClassName("post-category"), (i) -> input.test  i.innerText)
	return firstTest or secondTest or thridTest

searchTag = (name) ->
	input = new RegExp(name.srcElement.innerText, "i")
	for entry in element("search-container").children
		entry.hidden = no
		entry.hidden = yes unless any(entry.getElementsByClassName("post-category"), (i) -> input.test  i.innerText)
	history.pushState({ foo: "bar" }, "page 2", "index.html")

element "text-to-find"
	.addEventListener("input", () -> startSearch(valueof "text-to-find"))

for child in element("search-container").children
	for elem in child.getElementsByClassName("post-category")
		elem.addEventListener("click", searchTag)

window.onpopstate = (event) ->
	searchTag({ srcElement: { innerText: "" } })
	history.replaceState null, "title 2"