const DNA_VALID_CHARS = ["A", "T", "G", "C", "a", "t", "g", "c", "А", "Т", "Г", "Ц", "а", "т", "г", "ц"];

const DNA_COMPLIMENTARY = new Map([
	["A", "T"],
	["T", "A"],
	["G", "C"],
	["C", "G"]
]);

const RNA_COMPLIMENTARY = new Map([
	["A", "U"],
	["T", "A"],
	["U", "A"],
	["G", "C"],
	["C", "G"]
]);

const GENETIC_CODE = new Map([
	["UUU", "Phe"],
	["UUC", "Phe"],
	["UUA", "Leu"],
	["UCU", "Ser"],
	["UCC", "Ser"],
	["UCA", "Ser"],
	["UCG", "Ser"],
	["UAU", "Tyr"],
	["UAC", "Tyr"],
	["UAA", "Stop"],
	["UAG", "Stop"],
	["UGU", "Cys"],
	["UGC", "Cys"],
	["UGA", "Stop"],
	["UGG", "Trp"],
	["CUU", "Leu"],
	["CUC", "Leu"],
	["CUA", "Leu"],
	["CUG", "Leu"],
	["CCU", "Pro"],
	["CCC", "Pro"],
	["CCA", "Pro"],
	["CCG", "Pro"],
	["CAU", "His"],
	["CAC", "His"],
	["CAA", "Gln"],
	["CAG", "Gln"],
	["CGU", "Arg"],
	["CGC", "Arg"],
	["CGA", "Arg"],
	["CGG", "Arg"],
	["AUU", "Ile"],
	["AUC", "Ile"],
	["AUA", "Ile"],
	["AUG", "Met"],
	["GUU", "Val"],
	["GUC", "Val"],
	["GUA", "Val"],
	["GUG", "Val"],
	["ACU", "Thr"],
	["ACC", "Thr"],
	["ACA", "Thr"],
	["ACG", "Thr"],
	["GCU", "Ala"],
	["GCC", "Ala"],
	["GCA", "Ala"],
	["GCG", "Ala"],
	["AAU", "Asn"],
	["AAC", "Asn"],
	["AAA", "Lys"],
	["AAG", "Lys"],
	["GAU", "Asp"],
	["GAC", "Asp"],
	["GAA", "Gln"],
	["GAG", "Gln"],
	["AGU", "Ser"],
	["AGC", "Ser"],
	["AGA", "Arg"],
	["AGG", "Arg"],
	["GGU", "Gly"],
	["GGC", "Gly"],
	["GGA", "Gly"],
	["GGG", "Gly"],
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
		return "A";
	}

	if (nucleotideProto === "T") {
		return "T";
	}

	if (nucleotideProto === "G") {
		return "G";
	}

	if (nucleotideProto === "C") {
		return "C";
	}

	if (nucleotideProto === "U") {
		return "U";
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