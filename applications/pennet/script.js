let alleles = null;
function runApplication() {
	let genotype1 = document.mainForm.genotype1.value;
	let genotype2 = document.mainForm.genotype2.value;

	let gametesFirst = makeGametes(genotype1);
	let gametesSecond = genotype1 === genotype2 ? gametesFirst : makeGametes(genotype2);
	
	document.getElementById("tableplace").innerHTML = createTable(gametesFirst, gametesSecond);
}

function createTable(g1, g2) {
	let counter = new Map();
	let phenotypeCounter = new Map();

	let builder = "Решётка Пеннета: <table class='pure-table'><tr><td></td>";

	for(let i of g2) {
		builder += "<td>" + i + "</td>"; 
	}

	builder += "</tr>";

	for(let i of g1) {
		builder += "<tr>"+ "<td>"+ i + "</td>";
		for(let j of g2) {
			let genotype = combineGametes(i, j);
			let phenotype = evalPhenotype(genotype);

			if(counter.has(genotype)) {
				counter.set(genotype, counter.get(genotype) + 1);
			} else {
				counter.set(genotype, 1);
			}

			if(phenotypeCounter.has(phenotype)) {
				phenotypeCounter.set(phenotype, phenotypeCounter.get(phenotype) + 1);
			} else {
				phenotypeCounter.set(phenotype, 1);
			}

			builder += "<td>" + genotype + "<br>(" + phenotype + ")</td>";
		}
		builder += "</tr>"; 
	}

	let subbuilder = "Расщепление по генотипу: <br><table class='pure-table'><tr>";

	for(let k of counter.keys()) {
			subbuilder += "<td>" + k + "</td>"
	}

	subbuilder += "</tr><tr>"

	for(let v of counter.values()) {
		subbuilder += "<td>" + v + "</td>"
	}

	subbuilder += "</tr></table>";

 	subbuilder += "<br>Расщепление по фенотипу: <br><table class='pure-table'><tr>";

	for(let k of phenotypeCounter.keys()) {
			subbuilder += "<td>" + k + "</td>"
	}

	subbuilder += "</tr><tr>"

	for(let v of phenotypeCounter.values()) {
		subbuilder += "<td>" + v + "</td>"
	}

	subbuilder += "</tr></table>";

	builder += "</table><br><div> " + subbuilder + "</div>";
	return builder;
}

function evalPhenotype(genotype) {
	let phenotypeParts = new Map();

	for (const allel of genotype) {
		let element = document.getElementById("inputFor" + allel);
		if(allel.toUpperCase() === allel && element !== null) {
			phenotypeParts.set(allel, element.value)
		} else {
			if(!phenotypeParts.has(allel.toUpperCase()) && element !== null)
			phenotypeParts.set(allel, element.value)
		}
	}

	return [...phenotypeParts.values()].join(", ")
}

// Комбинирует гаметы для создания нового генотипа
function combineGametes(gamet1, gamet2) {
	if(gamet1.length != gamet2.length) {
		throw "wrong gamet length";
	}

	let genotype = "";
	for(let i = 0; i < gamet1.length; i++) {
		if(gamet1[i] < gamet2[i]) {
			genotype += gamet1[i] + gamet2[i];
		} else {
			genotype += gamet2[i] + gamet1[i];
		}
	}
	return genotype;
}

/// Создаёт набор гамет для заданного генотипа
function makeGametes(genotype) {
	if(genotype.length % 2 !== 0) {
		return [];
	}

	function helper(genotype, position) {
		if(position >= genotype.length) {
			return;
		}
	
		let gams = helper(genotype, position + 2);
		
		if(gams === undefined) {
			return [...new Set([genotype[position], genotype[position + 1]])];
		}
	
		if(genotype[position] === genotype[position+1]) { // гомозиготные по аллели?
			return gams.map(i => genotype[position] + i);
		} else {
			return [...gams.map(i => genotype[position] + i), ...gams.map(i => genotype[position + 1] + i)];
		}
	}

	return helper(genotype, 0);
}

function onChangeText(event) {
	document.getElementById("gametparams").innerHTML = "";
	
	let genotype = document.mainForm.genotype1.value;
	if(genotype.length % 2 == 0) {
		let gametes = makeGametes(genotype);
		alleles = gametes[0].toUpperCase() + gametes[0].toLowerCase();
		let result = "";
		for(let allel of alleles) {
			result += allel + " - <input type='text' class='pure-input pure-input-1-2' id='inputFor" + 
				allel + "' placeholder='Фенотип " + allel + "'> <br><br>";
		} 
		document.getElementById("gametparams").innerHTML = result;
	}
}