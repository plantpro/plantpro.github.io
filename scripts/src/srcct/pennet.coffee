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

class Counter
	constructor: ->
		@counter = new Map()

	count: (element) ->
		countIt @counter, element

	getSize: () ->
		@counter.size

	getTable: (tableName) ->
		builder =
		"""
		<label class="tblbl">#{tableName}: </label><br>
		<table class="mdl-data-table mdl-js-data-table">
			<tr>#{ejoin(makeKeyCells(@counter))}</tr>
			<tr>#{ejoin(makeValueCells(@counter))}</tr>
		</table>
		"""

runApplication = () ->
	clearError()

	genotype1 = valueof("genotype1").trim()
	genotype2 = valueof("genotype2").trim()

	return unless checkGenotypes genotype1, genotype2

	gametesFirst = makeGametes genotype1
	gametesSecond = if genotype1 == genotype2 then gametesFirst else makeGametes genotype2

	htmlset "tableplace", createOutput(gametesFirst, gametesSecond)

fail = (error) ->
	htmlset "errorlogs", """<p style="color: red;">#{error}</p>"""
	off

clearError = () ->
	fail ""

createOutput = (g1, g2) ->
	genotypeCounter = new Counter
	phenotypeCounter = new Counter

	builder =
	"""<br><label class="tblbl">Решётка Пеннета: </label><br>
		 <table class='mdl-data-table mdl-js-data-table'><tr><td></td>"""

	builder += "<td>#{i}</td>" for i in g2
	builder += "</tr>"

	for i in g1
		builder += "<tr><td>#{i}</td>"
		for j in g2
			genotype = combineGametes i, j
			return "" if genotype is null
		
			phenotype = evalPhenotype genotype
			genotypeCounter.count genotype
			phenotypeCounter.count phenotype

			builder +=
				if phenotype != null then "<td>#{genotype}<br>(#{phenotype})</td>"	else "<td>#{genotype}</td>"
		builder += "</tr>"
	
	subbuilder = genotypeCounter.getTable "Расщепление по генотипу"

	subbuilder += "<br>" +
		phenotypeCounter.getTable "Расщепление по фенотипу" if phenotypeCounter.getSize() > 1

	builder + "</table><br><div>#{subbuilder}</div>"

evalPhenotype = (genotype) ->
	phenotypeParts = new Map

	for allel in genotype
		val = valueof("inputFor" + allel)
		continue if val == ""
		phenotypeParts.set allel, val if allel.toUpperCase() == allel
		phenotypeParts.set allel, val unless phenotypeParts.has allel.toUpperCase()
	
	return null unless phenotypeParts.size
	values(phenotypeParts).join ", "

combineGametes = (g1, g2) ->
	return fail("wrong gamet length") if g1.length != g2.length
	ejoin((if g1[i] < g2[i] then g1[i] + g2[i] else g2[i] + g1[i]) for i in [0...g1.length])

# Создаёт набор гамет для заданного генотипа
makeGametes = (genotype) ->
	helper = (genotype, position) ->
		return if position >= genotype.length

		gams = helper(genotype, position + 2)

		return [new Set([genotype[position], genotype[position + 1]])...] if gams == undefined
	
		return if (genotype[position] == genotype[position + 1])
			gams.map((i) -> genotype[position] + i)
		else
			[gams.map((i) -> genotype[position] + i)..., gams.map((i) -> genotype[position + 1] + i)...]
	helper genotype, 0

onChangeText = () ->
	clearError()
	htmlset "gametparams", ""

	return unless checkGenotypes valueof("genotype1"), valueof("genotype2")

	gametes = makeGametes valueof "genotype1"

	return if gametes == null

	alleles = mergeStrings(gametes[0].toUpperCase(), gametes[0].toLowerCase())

	htmlset "gametparams", (createPhenotypeInput allel for allel in alleles).join ""

createPhenotypeInput = (allel) ->
	"""
		<div class="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
			<div class="mdl-textfield mdl-js-textfield">
				<label class="tblbl">Фенотип #{allel}</label>
				<input type="text" class="mdl-textfield__input" id="inputFor#{allel}">
			</div>
		</div>
	"""

checkGenotype = (genotype) ->
	msg = "Введён некорректный генотип #{genotype}"
	return fail msg if genotype.length % 2 != 0

	member = []

	#for i in genotype.toLowerCase()
	#	return fail msg if i in member
	#	member.push i

	return true

checkGenotypes = (genotype1, genotype2) ->
	return false unless checkGenotype genotype1
	return false unless checkGenotype genotype2

	msg = "Генотипы #{genotype1} и #{genotype2} некорректны"
	return fail msg if genotype1.length != genotype2.length

	for i in [0...genotype1.length]
		return fail msg if genotype1[i].toLowerCase() != genotype2[i].toLowerCase()
		
	return true

mergeStrings = (string1, string2) ->
	(string1[i] + string2[i] for i in [0...string1.length]).join ""

element "genotype1"
	.addEventListener("input", onChangeText)
element "genotype2"
	.addEventListener("input", onChangeText)
element "runButton"
	.addEventListener("click", runApplication)