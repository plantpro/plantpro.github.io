const COMPLIMENTARY = new Map([
	["A", "U"],
	["G", "C"],
	["U", "A"],
	["T", "A"],
	["C", "G"]
])

function runApplication(language) {
	let dnaInput = document.mainForm.dnaInput;
	let irnaInput = document.mainForm.irnaInput;
	let trnaInput = document.mainForm.trnaInput;

	let uniformedDNA = uniformChain(dnaInput.value);
	let irnaChain = makeChain(uniformedDNA);
	let trnaChain = makeChain(irnaChain);

	dnaInput.value = localizeChain(uniformedDNA, language);
	irnaInput.value = localizeChain(irnaChain, language);
	trnaInput.value = localizeChain(trnaChain, language);
}

function localizeChain(chain, language) {
	if(language === "ru") {
		let complimentaryChain = "";
		for(let char of chain) {
			complimentaryChain += uniformRuChar(char);
		}
		return complimentaryChain;
	}
	return chain;
}

function makeChain(dna, language) {
	let complimentaryChain = "";
	for(let char of dna) {
		complimentaryChain += findComplimentary(char);
	}
	return uniformChain(complimentaryChain, language);
}

function uniformChain(dna) {
	let uniformed = "";
	for(let char of dna) {
		uniformed += uniformEnChar(char);
	}
	return uniformed;
}

function uniformEnChar(char) {
	char = char.toUpperCase();

	if (char === "А") {
		return "A";
	}

	if (char === "Т") {
		return "T";
	}

	if (char === "Г") {
		return "G";
	}

	if (char === "Ц") {
		return "C";
	}

	if (char === "У") {
		return "U";
	}

	return char;
}

function uniformRuChar(char) {
	char = char.toUpperCase();

	if (char === "A") {
		return "А";
	}

	if (char === "T") {
		return "Т";
	}

	if (char === "G") {
		return "Г";
	}

	if (char === "C") {
		return "Ц";
	}

	if (char === "U") {
		return "У";
	}

	return char;
}

function findComplimentary(char) {
	return COMPLIMENTARY.get(char);
}


const DNA_VALID_CHARS = ["A", "T", "G", "C", "a", "t", "g", "c", "А", "Т", "Г", "Ц", "а", "т", "г", "ц"]

function filterDNA(e) {
	let i = String.fromCharCode(e.keyCode);
	if(DNA_VALID_CHARS.includes(i)) {
		e.returnValue = true;
		return;
	}
	e.returnValue = false;
}