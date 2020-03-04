###
	Complementarity application (EN version)
	Autor: Tsvikevich Denis 2019
###

#: import flexibel.coffee

DNA_VALID_CHARS = "ATGCatgcАTGCаTGC "
RNA_VALID_CHARS = "AUGCaugcАUGCаUGC "

DNA_COMPLIMENTARY = new Map [
	["A", "T"],
	["T", "A"],
	["G", "C"],
	["U", "A"],
	["C", "G"]
]

RNA_COMPLIMENTARY = new Map [
	["A", "U"],
	["T", "A"],
	["U", "A"],
	["G", "C"],
	["C", "G"]
]

GENETIC_CODE = new Map [
	["UUU", "Phe"],
	["UUC", "Phe"],
	["UUA", "Leu"],
	["UCU", "Ser"],
	["UCC", "Ser"],
	["UCА", "Ser"],
	["UCG", "Ser"],
	["UАU", "Tyr"],
	["UАC", "Tyr"],
	["UАА", "Stop"],
	["UАG", "Stop"],
	["UGU", "Cys"],
	["UGC", "Cys"],
	["UGА", "Stop"],
	["UGG", "Trp"],
	["CUU", "Leu"],
	["CUC", "Leu"],
	["CUА", "Leu"],
	["CUG", "Leu"],
	["CCU", "Pro"],
	["CCC", "Pro"],
	["CCА", "Pro"],
	["CCG", "Pro"],
	["CАU", "His"],
	["CАC", "His"],
	["CАА", "Glu"],
	["CАG", "Glu"],
	["CGU", "Arg"],
	["CGC", "Arg"],
	["CGА", "Arg"],
	["CGG", "Arg"],
	["АUU", "Ile"],
	["АUC", "Ile"],
	["АUА", "Ile"],
	["АUG", "Met"],
	["GUU", "Val"],
	["GUC", "Val"],
	["GUА", "Val"],
	["GUG", "Val"],
	["АCU", "Thr"],
	["АCC", "Thr"],
	["АCА", "Thr"],
	["АCG", "Thr"],
	["GCU", "Ala"],
	["GCC", "Ala"],
	["GCА", "Ala"],
	["GCG", "Ala"],
	["ААU", "Asn"],
	["ААC", "Asn"],
	["ААА", "Lys"],
	["ААG", "Lys"],
	["GАU", "Asp"],
	["GАC", "Asp"],
	["GАА", "Glu"],
	["GАG", "Glu"],
	["АGU", "Ser"],
	["АGC", "Ser"],
	["АGА", "Arg"],
	["АGG", "Arg"],
	["GGU", "Gly"],
	["GGC", "Gly"],
	["GGА", "Gly"],
	["GGG", "Gly"],
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
	mapString delws(dna), uniformNucleotide

uniformNucleotide = (nucleotide) ->
	switch nucleotide.toUpperCase()
		when "A" then "А"
		when "T" then "T"
		when "G" then "G"
		when "C" then "C"
		when "U" then "U"
		else nucleotide.toUpperCase()

validateInput = (type) ->
	lastInputType = type
	clearError()

	if type is INPUT_TYPE.PROTEIN
		formatedInput = formatProteinSequence valueof("proteinInput").replace(/\-/g, '')
		for aminoacid in formatedInput.split "-"
			unless isValidAminoacid aminoacid
				return logError "Error: unknown aminoacid '#{aminoacid}'", type

		document.mainForm.proteinInput.value = formatedInput
	else
		{ checker, inputElement } = getCheckerAndInputElement type

		for i in inputElement.value
			unless checker i
				return logError "Error: unexpected symbol '#{i}'", type
		
		inputElement.value = formatOutput delws inputElement.value

		logError "Error: partial triplet", type if uniformSequence(inputElement.value).length % 3 != 0


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

		if (index == 3 and currentTriplet != "STO") or (index == 4)
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