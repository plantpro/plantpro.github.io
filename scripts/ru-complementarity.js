const DNA_VALID_CHARS = ["A", "T", "G", "C", "a", "t", "g", "c", "А", "Т", "Г", "Ц", "а", "т", "г", "ц"];

const DNA_COMPLIMENTARY = new Map([
	["А", "Т"],
	["Т", "А"],
	["Г", "Ц"],
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


function runApplication() {
	let dnaInput = document.mainForm.dnaInput;
	let dna2Input = document.mainForm.dna2Input;
	let irnaInput = document.mainForm.irnaInput;
	let trnaInput = document.mainForm.trnaInput;
	let proteinInput = document.mainForm.proteinInput;

	let dna1Sequence = uniformDNA(dnaInput.value);
	let dna2Sequence = makeDNA2(dna1Sequence);
	let irnaSequence = makeiRNA(dna1Sequence);
	let trnaSequence = maketRNA(irnaSequence);
  let proteinSequence = makeProtein(irnaSequence);

	dnaInput.value = dna1Sequence;
	dna2Input.value = dna2Sequence;
	irnaInput.value = irnaSequence;
	trnaInput.value = trnaSequence;
	proteinInput.value = proteinSequence;
}

function makeProtein(irna) {
	function divideIntoTriplets(irna) {
		let triplets = [];
		let triplet = "";
		let index = 0;
		for(let i of irna) {
			triplet += i;
			index++;
			if(index === 3) {
				triplets.push(triplet);
				triplet = "";
				index = 0;
			}
		}
		return triplets;
	}

	let triplets = divideIntoTriplets(irna);
	return triplets.map(x => GENETIC_CODE.get(x)).join("-");
}

function makeDNA2(dna1) {
	let dna2 = "";
	for(let symbol of dna1) {
		dna2 += DNA_COMPLIMENTARY.get(symbol);
	}
	return dna2;
}

function makeiRNA(dna1) {
	let irna = "";
	for(let symbol of dna1) {
		irna += RNA_COMPLIMENTARY.get(symbol);
	}
	return irna;
}

function maketRNA(irna) {
	let trna = "";
	for(let symbol of irna) {
		trna += RNA_COMPLIMENTARY.get(symbol);
	}
	return trna;
}

function uniformDNA(dna) {
	let uniformedDNA = "";
	for(let i of dna) {
		uniformedDNA += uniform(i);
	}
	return uniformedDNA;
}

function uniform(nucleotideProto) {
	nucleotideProto = nucleotideProto.toUpperCase();

	if (nucleotideProto === "A") {
		return "А";
	}

	if (nucleotideProto === "T") {
		return "Т";
	}

	if (nucleotideProto === "G") {
		return "Г";
	}

	if (nucleotideProto === "C") {
		return "Ц";
	}

	if (nucleotideProto === "U") {
		return "У";
	}

	return nucleotideProto;
}

function filterDNA(event) {
	let char = String.fromCharCode(event.keyCode);
	event.returnValue = isValidChar(char);
}

function isValidChar(char) {
	return DNA_VALID_CHARS.includes(char);
}