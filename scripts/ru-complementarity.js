/* 
 * Complimentarity application © 2019
 * Autor: Tsvikevich Denis
 */

const DNA_VALID_CHARS = ["A", "T", "G", "C", "a", "t", "g", "c", "А", "Т", "Г", "Ц", "а", "т", "г", "ц", " "];
const RNA_VALID_CHARS = ["A", "U", "G", "C", "a", "u", "g", "c", "А", "У", "Г", "Ц", "а", "у", "г", "ц", " "];

const DNA_COMPLIMENTARY = new Map([
	["А", "Т"],
	["Т", "А"],
	["Г", "Ц"],
	["У", "А"],
	["Ц", "Г"]
]);
const RNA_COMPLIMENTARY = new Map([
	["А", "У"],
	["Т", "А"],
	["У", "А"],
	["Г", "Ц"],
	["Ц", "Г"]
]);

const GENETIC_CODE = new Map([
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
])

const INPUT_TYPE = {
	DNA1: 1,
	DNA2: 2,
	IRNA: 3,
	TRNA: 4,
	PROTEIN: 5
}

var lastInputType = 1;

// Entry point for application
function runApplication() {
	let dnaInput = document.mainForm.dnaInput;
	let dna2Input = document.mainForm.dna2Input;
	let irnaInput = document.mainForm.irnaInput;
	let trnaInput = document.mainForm.trnaInput;
	let proteinInput = document.mainForm.proteinInput;

	let result;
	switch (lastInputType) {
		case 1:
			result = buildByDnaOne();
			break;
		case 2:
			result = buildByDnaTwo();
			break;
		case 3:
			result = buildByInformationalRna();
			break;
		case 4:
			result = buildByTransferRna();
			break;
	}

	dnaInput.value = formatOutput(result.firstDnaSequence);
	dna2Input.value = formatOutput(result.secondDnaSequence);
	irnaInput.value = formatOutput(result.informationalRnaSequence);
	trnaInput.value = formatOutput(result.transferRnaSequence);
	proteinInput.value = result.proteinSequence;
}

function buildByDnaOne() {
	let firstDnaSequence = uniformSequence(dnaInput.value);
	let secondDnaSequence = makeComplimentaryDna(firstDnaSequence);
	let informationalRnaSequence = makeInformationalRna(firstDnaSequence);
	let transferRnaSequence = makeTransferRna(informationalRnaSequence);
	let proteinSequence = makeProteinFromInformationalRna(informationalRnaSequence);

	return { firstDnaSequence, secondDnaSequence, informationalRnaSequence, transferRnaSequence, proteinSequence };
}

function buildByDnaTwo() {
	let secondDnaSequence = uniformSequence(dna2Input.value);
	let firstDnaSequence = makeComplimentaryDna(secondDnaSequence);
	let informationalRnaSequence = makeInformationalRna(secondDnaSequence);
	let transferRnaSequence = makeTransferRna(informationalRnaSequence);
	let proteinSequence = makeProteinFromInformationalRna(informationalRnaSequence);

	return { firstDnaSequence, secondDnaSequence, informationalRnaSequence, transferRnaSequence, proteinSequence };
}

function buildByInformationalRna() {
	let informationalRnaSequence = uniformSequence(irnaInput.value);
	let firstDnaSequence = makeDnaFromiRna(informationalRnaSequence);
	let secondDnaSequence = makeComplimentaryDna(firstDnaSequence);
	let transferRnaSequence = makeTransferRna(informationalRnaSequence);
	let proteinSequence = makeProteinFromInformationalRna(informationalRnaSequence);

	return { firstDnaSequence, secondDnaSequence, informationalRnaSequence, transferRnaSequence, proteinSequence };
}

function buildByTransferRna() {
	let transferRnaSequence = uniformSequence(trnaInput.value);
	let secondDnaSequence = makeDnaFromiRna(transferRnaSequence);
	let firstDnaSequence = makeComplimentaryDna(secondDnaSequence);
	let informationalRnaSequence = makeInformationalRna(firstDnaSequence);
	let proteinSequence = makeProteinFromInformationalRna(informationalRnaSequence);

	return { firstDnaSequence, secondDnaSequence, informationalRnaSequence, transferRnaSequence, proteinSequence };
}

// Creates protein sequence from iRNA
function makeProteinFromInformationalRna(irna) {
	// Helper function for splitting iRNA sequence into triplets
	function divideIntoTriplets(irna) {
		// Result array
		let triplets = [];

		let currentTriplet = "";
		let index = 0;
		for (let i of irna) {
			currentTriplet += i;
			index++;

			if (index === 3) {
				triplets.push(currentTriplet);
				currentTriplet = "";
				index = 0;
			}
		}
		return triplets;
	}

	let triplets = divideIntoTriplets(irna);
	return triplets.map(x => GENETIC_CODE.get(x)).join("-");
}

function mapString(string, mapper) {
	let result = "";
	for (let char of string) {
		result += mapper(char);
	}
	return result;
}

// Creates complemetary sequence from DNA
function makeComplimentaryDna(dna) {
	return mapString(dna, x => DNA_COMPLIMENTARY.get(x));
}

// Creates iRNA sequence from DNA
function makeInformationalRna(dna1) {
	return mapString(dna1, x => RNA_COMPLIMENTARY.get(x));
}

function makeDnaFromiRna(irna) {
	return mapString(irna, x => DNA_COMPLIMENTARY.get(x));
}

// Creates tRNA sequence from DNA
function makeTransferRna(irna) {
	return mapString(irna, x => RNA_COMPLIMENTARY.get(x));
}

// Uniforming of DNA
function uniformSequence(dna) {
	return mapString(dna.replace(/\s/g, ''), uniformNucleotide);
}

// Uniforming of nucleotide
function uniformNucleotide(nucleotide) {
	switch (nucleotide.toUpperCase()) {
		case "A":
			return "А";
		case "T":
			return "Т";
		case "G":
			return "Г";
		case "C":
			return "Ц";
		case "U":
			return "У";
		default:
			return nucleotide.toUpperCase();
	}
}

function validateInput(event, type) {
	lastInputType = type;
	clearError();

	let { checker, inputElement } = getCheckerAndInputElement(type);

	for (let i of inputElement.value) {
		if (!checker(i)) {
			logError(`Ошибка: неожиданный символ "${i}"`, type);
			return;
		}
	}

	inputElement.value = formatOutput(inputElement.value)

	if (uniformSequence(inputElement.value).length % 3 !== 0) {
		logError(`Ошибка: неполный триплет`, type);
	}
}


function getCheckerAndInputElement(inputType) {
	switch (inputType) {
		case 1:
			return { checker: isValidDnaChar, inputElement: document.mainForm.dnaInput };
		case 2:
			return { checker: isValidDnaChar, inputElement: document.mainForm.dna2Input };
		case 3:
			return { checker: isValidRnaChar, inputElement: document.mainForm.irnaInput };
		case 4:
			return { checker: isValidRnaChar, inputElement: document.mainForm.trnaInput };
		default:
			return { checker: isValidDnaChar, inputElement: document.mainForm.dnaInput };
	}
}

function isValidDnaChar(char) {
	return DNA_VALID_CHARS.includes(char);
}

function isValidRnaChar(char) {
	return RNA_VALID_CHARS.includes(char);
}

function logError(message, inputType) {
	let logger;

	switch (inputType) {
		case INPUT_TYPE.DNA1:
			logger = document.getElementById("dna1err");
			break;
		case INPUT_TYPE.DNA2:
			logger = document.getElementById("dna2err");
			break;
		case INPUT_TYPE.IRNA:
			logger = document.getElementById("irnaerr");
			break;
		case INPUT_TYPE.TRNA:
			logger = document.getElementById("trnaerr");
			break;
		case INPUT_TYPE.PROTEIN:
			logger = document.getElementById("proteinerr");
			break;
	}

	logger.innerHTML = message;
}

function clearError() {
	document.getElementById("dna1err").innerHTML = "";
	document.getElementById("dna2err").innerHTML = "";
	document.getElementById("irnaerr").innerHTML = "";
	document.getElementById("trnaerr").innerHTML = "";
	document.getElementById("proteinerr").innerHTML = "";
}

function formatOutput(sequence) {
	let triplets = [];

	let currentTriplet = "";
	let index = 0;
	for (let i of uniformSequence(sequence)) {
		currentTriplet += i;
		index++;

		if (index === 3) {
			triplets.push(currentTriplet);
			currentTriplet = "";
			index = 0;
		}
	}

	if (currentTriplet.length > 0) {
		triplets.push(currentTriplet);
	}

	return triplets.join(" ");
}