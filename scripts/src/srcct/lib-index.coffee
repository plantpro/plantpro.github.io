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

predicates = []

isAll = (record) ->
	for predicate in predicates
		if not predicate record
			return false
	return true

makeChip = (text, num) -> "
		<span class='mdl-chip mdl-chip--deletable'>
			<span class='mdl-chip__text'>#{text}</span>
			<button type='button' class='mdl-chip__action' onclick='document.clearFilter(this, #{num})'>
				<svg style='width:18px;height:18px' viewBox='0 0 24 24'>
					<path fill='#ffffff' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' />
				</svg>
			</button>
		</span>
	"

makeChipWithColor = (text, color) -> "
		<span class='mdl-chip mdl-chip--deletable' style='background-color: #{color}'>
			<span class='mdl-chip__text'>#{text}</span>
			<button type='button' class='mdl-chip__action' onclick='document.clearFilter()'>
				<svg style='width:18px;height:18px' viewBox='0 0 24 24'>
					<path fill='#ffffff' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' />
				</svg>
			</button>
		</span>
	"

updateFilter = (text) ->
	htmlset "filter", makeChip text

clearFilter = (self, num) ->
	filterDiv = element "filter"
	console.log self
	htmlset "filter", filterDiv.innerHTML.replace(self.parent.innerHTML)

	predicates.splice(num, 1)
	doit()

	#searchBox = element "search-box"

	#	for i in searchBox.children
	#	i.style.display = "block" if i.className == "plpro-lib-record"

searchAutor = (text) ->
	searchBox = element "search-box"
	for i in searchBox.children
		if i.className == "plpro-lib-record"
			i.style.display = "none"
			for j in i.children
				if j.className == "plpro-lib-record-autor" and j.innerText == text
					i.style.display = "block"

document.stateChanged = (self) ->
	searchBox = element "search-box"
	if self.control.checked
		for i in searchBox.children
			if i.className == "plpro-lib-record"
				span = i.getElementsByClassName "plpro-lib-record-article"
				if span.length == 0
					i.style.display = "none"
	else
		for i in searchBox.children
			if i.className == "plpro-lib-record"
				i.style.display = "block"

doit = () ->
	searchBox = element "search-box"
	for i in searchBox.children
		if i.className == "plpro-lib-record"
			i.style.display = "none"
			if isAll i
				i.style.display = "block"

document.autorOnClick = (self) ->
	text = self.innerText
	predicates.push(
		(record) ->
			for j in record.children
				return true if j.className == "plpro-lib-record-autor" and j.innerText == text
			return false
	)

	doit()
	#searchAutor self.innerText
	filterDiv = element "filter"
	filterDiv.innerHTML = filterDiv.innerHTML +
		makeChip("Автор: #{self.innerText}", predicates.length - 1)

document.filterByType = (self) ->
	searchBox = element "search-box"
	for i in searchBox.children
		if i.className == "plpro-lib-record"
			i.style.display = "none"
			k = (i.getElementsByClassName "filetype-tag")[0]
			if k.innerText.trim() == self.innerText.trim()
				i.style.display = "block"

	if self.innerText == "pdf"
		htmlset "filter", (makeChipWithColor "Тип: .pdf", "rgb(231, 47, 47)")
	if self.innerText == "djvu"
		htmlset "filter", (makeChipWithColor "Тип: .djvu", "rgb(160, 0, 160)")
	if self.innerText == "online"
		htmlset "filter", (makeChipWithColor "Тип: online", "rgb(112, 112, 112)")

document.clearFilter = clearFilter
