# 86 80 25 77 73 76 100 90 69 93 90 83 70 73 73 70 90 83 71 95 40 58 68 69 100 78 87 97 92 74
runApplication = () ->
	input = runParser valueof "seqInput"
	isPopulation = checkedof "checkbox1"

	htmlset "reportPlace", makeReport(input, isPopulation)

makeReport = (data, isPopulation) ->
	parameters = getStatisticParameters data, isPopulation
	target = if isPopulation then "генеральной совокупности" else "выборки"

	[
		"<ul class='mdc-list mdc-list--two-line'>"
		reportElement "Размер #{target}:", parameters.size
		reportElement "Сумма #{target}:", parameters.sum
		reportElement "Максимум #{target}:", parameters.max
		reportElement "Минимум #{target}:", parameters.min
		reportElement "Среднее #{target}:", parameters.mean
		reportElement "Медиана #{target}:", parameters.median
		reportElement "Моды #{target}:", parameters.modes.join ", "
		reportElement "Размах #{target}:", parameters.range
		reportElement "Дисперсия #{target}:", parameters.variance
		reportElement "Стандартное отклонение #{target}:", parameters.sd
		"</ul>"
		getFerqsTable(parameters.freqs, parameters.size)
	].join ""

reportElement = (title, value) ->
	return """
		<li class="mdc-list-item">
			<span class="mdc-list-item__text">
				<span class="mdc-list-item__primary-text" style="color: #3f51b5; font-size: 12px;">
					#{title}
				</span>
				<span class="mdc-list-item__secondary-text" style="padding-left: 10px;">
					#{value}
				</span>
			</span>
		</li>
	"""

getStatisticParameters = (data, isPopulation) ->
	size = data.length
	sum = data.reduce fsum
	mean = sum / size
	orderedData = data.sort sub
	max = last orderedData
	min = first orderedData
	median = findMedian orderedData
	range = max - min
	variance = orderedData
		.map (x) -> (x - mean) ** 2
		.reduce(fsum) / if isPopulation then size else size - 1
	sd = Math.sqrt(variance)
	freqs = counter(orderedData)
	modes = findMode freqs

	{ size, sum, mean, median, max, min, range, variance, sd, freqs, modes }

getFerqsTable = (freqs, size) ->
	"""
	<div>
	<table class="mdl-data-table mdl-js-data-table">
		<tr>
			<td>x</td>
			#{ejoin map.makeKeyCells freqs}
		</tr>
		<tr>
			<td>f</td>
			#{ejoin map.makeValueCells freqs}
		</tr>
		<tr>
			<td>ω</td>
			#{ejoin(("<td>" + new String(i[1] / size).substr(0, 5) + "</td>") for i from freqs)}
		</tr>
	</table>
</div>
"""

findMode = (freqs) ->
	maxValue = map.maxValue freqs
	for i from freqs when i[1] == maxValue then i[0]

findMedian = (data) ->
	return (data[data.length / 2] + data[data.length / 2 + 1]) / 2 if data.length % 2 is 0
	data[Math.floor(data.length / 2)]

counter = (values) ->
	map = new Map
	map.countIt map, i for i in values
	map

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
		if (getCurrent parserState) in "0123456789"
			parseNumber parserState
		else
			next parserState
	
	parserState.result

{
	valueof, checkedof, htmlset,
	first, last, fsum,
	sub, map, ejoin, element
} = document.flexibel

element "runButton"
	.addEventListener("click", runApplication)

.coffee

class Counter
	constructor: ->
		@counter = new Map()

	count: (element) ->
		map.countIt @counter, element

	getSize: () ->
		@counter.size

	getTable: (tableName) ->
		builder =
		"""
		<label class="tblbl">#{tableName}: </label><br>
		<table class="mdl-data-table mdl-js-data-table">
			<tr>#{ejoin(map.makeKeyCells(@counter))}</tr>
			<tr>#{ejoin(map.makeValueCells(@counter))}</tr>
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
	map.values(phenotypeParts).join ", "

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
###
	Complementarity application
	Autor: Tsvikevich Denis
###

DNA_VALID_CHARS = "ATGCatgcАТГЦатгц "
RNA_VALID_CHARS = "AUGCaugcАУГЦаугц "

DNA_COMPLIMENTARY = new Map [
	["А", "Т"],
	["Т", "А"],
	["Г", "Ц"],
	["У", "А"],
	["Ц", "Г"]
]

RNA_COMPLIMENTARY = new Map [
	["А", "У"],
	["Т", "А"],
	["У", "А"],
	["Г", "Ц"],
	["Ц", "Г"]
]

GENETIC_CODE = new Map [
	["УУУ", "ФЕН"],
	["УУЦ", "ФЕН"],
	["УУА", "ЛЕЙ"],
	["УЦУ", "СЕР"],
	["УЦЦ", "СЕР"],
	["УЦА", "СЕР"],
	["УЦГ", "СЕР"],
	["УАУ", "ТИР"],
	["УАЦ", "ТИР"],
	["УАА", "СТОП"],
	["УАГ", "СТОП"],
	["УГУ", "ЦИС"],
	["УГЦ", "ЦИС"],
	["УГА", "СТОП"],
	["УГГ", "ТРИ"],
	["ЦУУ", "ЛЕЙ"],
	["ЦУЦ", "ЛЕЙ"],
	["ЦУА", "ЛЕЙ"],
	["ЦУГ", "ЛЕЙ"],
	["ЦЦУ", "ПРО"],
	["ЦЦЦ", "ПРО"],
	["ЦЦА", "ПРО"],
	["ЦЦГ", "ПРО"],
	["ЦАУ", "ГИС"],
	["ЦАЦ", "ГИС"],
	["ЦАА", "ГЛУ"],
	["ЦАГ", "ГЛУ"],
	["ЦГУ", "АРГ"],
	["ЦГЦ", "АРГ"],
	["ЦГА", "АРГ"],
	["ЦГГ", "АРГ"],
	["АУУ", "ИЛЕ"],
	["АУЦ", "ИЛЕ"],
	["АУА", "ИЛЕ"],
	["АУГ", "МЕТ"],
	["ГУУ", "ВАЛ"],
	["ГУЦ", "ВАЛ"],
	["ГУА", "ВАЛ"],
	["ГУГ", "ВАЛ"],
	["АЦУ", "ТРЕ"],
	["АЦЦ", "ТРЕ"],
	["АЦА", "ТРЕ"],
	["АЦГ", "ТРЕ"],
	["ГЦУ", "АЛА"],
	["ГЦЦ", "АЛА"],
	["ГЦА", "АЛА"],
	["ГЦГ", "АЛА"],
	["ААУ", "АСН"],
	["ААЦ", "АСН"],
	["ААА", "ЛИЗ"],
	["ААГ", "ЛИЗ"],
	["ГАУ", "АСП"],
	["ГАЦ", "АСП"],
	["ГАА", "ГЛУ"],
	["ГАГ", "ГЛУ"],
	["АГУ", "СЕР"],
	["АГЦ", "СЕР"],
	["АГА", "АРГ"],
	["АГГ", "АРГ"],
	["ГГУ", "ГЛИ"],
	["ГГЦ", "ГЛИ"],
	["ГГА", "ГЛИ"],
	["ГГГ", "ГЛИ"],
]

INPUT_TYPE = {
	DNA1: 1,
	DNA2: 2,
	IRNA: 3,
	TRNA: 4,
	PROTEIN: 5
}

lastInputType = 1

runApplication = () ->
	result = switch lastInputType
		when 1 then buildByDnaOne()
		when 2 then buildByDnaTwo()
		when 3 then buildByInformationalRna()
		when 4 then buildByTransferRna()
		when 5 then buildByProtein()

	valueset "dnaInput",     formatOutput result.firstDna
	valueset "dna2Input",    formatOutput result.secondDna
	valueset "irnaInput",    formatOutput result.informationalRna
	valueset "trnaInput",    formatOutput result.transferRna
	valueset "proteinInput", result.protein

buildByDnaOne = () ->
	firstDna = uniformSequence valueof "dnaInput"
	secondDna = makeComplimentaryDna firstDna
	informationalRna = makeInformationalRna firstDna
	transferRna = makeTransferRna informationalRna
	protein = makeProteinFromInformationalRna informationalRna

	{ firstDna, secondDna, informationalRna, transferRna, protein }

buildByDnaTwo = () ->
	secondDna = uniformSequence valueof "dna2Input"
	firstDna = makeComplimentaryDna secondDna
	informationalRna = makeInformationalRna firstDna
	transferRna = makeTransferRna informationalRna
	protein = makeProteinFromInformationalRna informationalRna

	{ firstDna, secondDna, informationalRna, transferRna, protein }

buildByInformationalRna = () ->
	informationalRna = uniformSequence valueof "irnaInput"
	firstDna = makeDnaFromiRna informationalRna
	secondDna = makeComplimentaryDna firstDna
	transferRna = makeTransferRna informationalRna
	protein = makeProteinFromInformationalRna informationalRna

	{ firstDna, secondDna, informationalRna, transferRna, protein }

buildByTransferRna = () ->
	transferRna = uniformSequence valueof "trnaInput"
	secondDna = makeDnaFromiRna transferRna
	firstDna = makeComplimentaryDna secondDna
	informationalRna = makeInformationalRna firstDna
	protein = makeProteinFromInformationalRna informationalRna

	{ firstDna, secondDna, informationalRna, transferRna, protein }

buildByProtein = () ->
	protein = valueof "proteinInput"
	informationalRna = makeInformationalRnaFromProtein protein
	firstDna = makeDnaFromiRna informationalRna
	secondDna = makeComplimentaryDna firstDna
	transferRna = makeTransferRna informationalRna

	{ firstDna, secondDna, informationalRna, transferRna, protein }

makeProteinFromInformationalRna = (irna) ->
	divideIntoTriplets = (irna) ->
		triplets = []

		currentTriplet = ""
		index = 0
		for i in irna
			currentTriplet += i
			index++

			if index == 3
				triplets.push currentTriplet
				currentTriplet = ""
				index = 0
		triplets

	divideIntoTriplets irna
		.map (x) -> GENETIC_CODE.get(x)
		.join("-")

makeInformationalRnaFromProtein = (protein) ->
	result = ""
	for aminoacid in protein.split "-"
		for i from GENETIC_CODE
			if i[1] == aminoacid
				result += i[0]
				break
	result

mapString = (string, mapper) ->
	(mapper char for char in string).join ""

makeComplimentaryDna = (dna) ->
	mapString dna, (x) -> DNA_COMPLIMENTARY.get x

makeInformationalRna = (dna1) ->
	mapString dna1, (x) -> RNA_COMPLIMENTARY.get x

makeDnaFromiRna = (irna) ->
	mapString irna, (x) -> DNA_COMPLIMENTARY.get x

makeTransferRna = (irna) ->
	mapString irna, (x) -> RNA_COMPLIMENTARY.get x

uniformSequence = (dna) ->
	mapString del dna, " ", uniformNucleotide

uniformNucleotide = (nucleotide) ->
	switch nucleotide.toUpperCase()
		when "A" then "А"
		when "T" then "Т"
		when "G" then "Г"
		when "C" then "Ц"
		when "U" then "У"
		else nucleotide.toUpperCase()

validateInput = (type) ->
	lastInputType = type
	clearError()

	if type is INPUT_TYPE.PROTEIN
		aminoacids =
			formatProteinSequence(valueof("proteinInput").replace(/\-/g, '')).split("-")
		for aminoacid in aminoacids
			unless isValidAminoacid aminoacid
				logError "Ошибка: неизвестная аминокислота '#{aminoacid}'", type
				return

		document.mainForm.proteinInput.value =
			formatProteinSequence valueof("proteinInput").replace(/\-/g, '')
	else
		{ checker, inputElement } = getCheckerAndInputElement type

		for i in inputElement.value
			unless checker i
				logError "Ошибка: неожиданный символ '#{i}'", type
				return

		inputElement.value = formatOutput inputElement.value

		logError "Ошибка: неполный триплет", type if uniformSequence(inputElement.value).length % 3 != 0


getCheckerAndInputElement = (inputType) ->
	switch inputType
		when 1 then { checker: isValidDnaChar, inputElement: element "dnaInput" }
		when 2 then { checker: isValidDnaChar, inputElement: element "dna2Input" }
		when 3 then { checker: isValidRnaChar, inputElement: element "irnaInput" }
		when 4 then { checker: isValidRnaChar, inputElement: element "trnaInput" }
		else { checker: isValidDnaChar, inputElement: element "dnaInput" }

isValidAminoacid = (aminoacid) ->
	return true if aminoacid.length == 0

	normalizedAminoacid = aminoacid.toUpperCase()
	for v from GENETIC_CODE.values()
		isPart = v.startsWith normalizedAminoacid
		break if isPart
	isPart

isValidDnaChar = (char) ->
	char in DNA_VALID_CHARS

isValidRnaChar = (char) ->
	char in RNA_VALID_CHARS

logError = (message, inputType) ->
	logger = switch inputType
		when INPUT_TYPE.DNA1 then element "dna1err"
		when INPUT_TYPE.DNA2 then element "dna2err"
		when INPUT_TYPE.IRNA then element "irnaerr"
		when INPUT_TYPE.TRNA then element "trnaerr"
		when INPUT_TYPE.PROTEIN then element "proteinerr"

	logger.innerHTML = message

clearError = () ->
	logError "", i for i in [1..5]

formatOutput = (sequence) ->
	triplets = []

	currentTriplet = ""
	index = 0
	for i in uniformSequence sequence
		currentTriplet += i
		index++

		if index == 3
			triplets.push currentTriplet
			currentTriplet = ""
			index = 0

	triplets.push currentTriplet if currentTriplet.length > 0

	triplets.join " "

formatProteinSequence = (sequence) ->
	triplets = []

	currentTriplet = ""
	index = 0
	for i in sequence.toUpperCase()
		currentTriplet += i
		index++

		if (index == 3 and currentTriplet != "СТО") or (index == 4)
			triplets.push currentTriplet
			currentTriplet = ""
			index = 0

	triplets.push currentTriplet if currentTriplet.length > 0
	
	triplets.join "-"

{ valueset, valueof, element, del } = document.flexibel

element "dnaInput"
	.addEventListener("input", -> validateInput INPUT_TYPE.DNA1)
element "dna2Input"
	.addEventListener("input", -> validateInput INPUT_TYPE.DNA2)
element "irnaInput"
	.addEventListener("input", -> validateInput INPUT_TYPE.IRNA)
element "trnaInput"
	.addEventListener("input", -> validateInput INPUT_TYPE.TRNA)
element "proteinInput"
	.addEventListener("input", -> validateInput INPUT_TYPE.PROTEIN)
element "runButton"
	.addEventListener("click", runApplication)
