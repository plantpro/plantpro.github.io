###
	Complementarity application
	Autor: Tsvikevich Denis
###

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