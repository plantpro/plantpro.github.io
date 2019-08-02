function runApplication() {
	clearError();

	let genotype1 = document.mainForm.genotype1.value.trim();
	let genotype2 = document.mainForm.genotype2.value.trim();

	if (!checkGenotypes(genotype1, genotype2)) {
		return;
	}

	let gametesFirst = makeGametes(genotype1);
	let gametesSecond = genotype1 === genotype2 ? gametesFirst : makeGametes(genotype2);

	document.getElementById("tableplace").innerHTML = createOutput(gametesFirst, gametesSecond);
}

function browseError(error) {
	document.getElementById("errorlogs").innerHTML = `<p style="color: red;">${error}</p>`;
}

function clearError() {
	document.getElementById("errorlogs").innerHTML = "";
}

class Counter {
	constructor() {
		this.counter = new Map();
	}

	count(element) {
		if (this.counter.has(element)) {
			this.counter.set(element, this.counter.get(element) + 1);
		} else {
			this.counter.set(element, 1);
		}
	}

	getSize() {
		return this.counter.size;
	}

	getTable(tableName) {
		let builder = `<label class="tblbl">` + tableName + ": </label><br><table class='mdl-data-table mdl-js-data-table'><tr>";

		for (let k of this.counter.keys()) {
			builder += "<td>" + k + "</td>"
		}

		builder += "</tr><tr>"

		for (let v of this.counter.values()) {
			builder += "<td>" + v + "</td>"
		}

		return builder + "</tr></table>";
	}
}

function createOutput(g1, g2) {
	let genotypeCounter = new Counter();
	let phenotypeCounter = new Counter();

	let builder = "<br><label class=\"tblbl\">Решётка Пеннета: </label><br><table class='mdl-data-table mdl-js-data-table'><tr><td></td>";

	for (let i of g2) {
		builder += `<td>${i}</td>`;
	}

	builder += "</tr>";

	for (let i of g1) {
		builder += `<tr><td>${i}</td>`;
		for (let j of g2) {
			let genotype = combineGametes(i, j);
			if (genotype === null) {
				return "";
			}
			let phenotype = evalPhenotype(genotype);

			genotypeCounter.count(genotype);
			phenotypeCounter.count(phenotype);

			if (phenotype !== null) {
				builder += `<td>${genotype}<br>(${phenotype})</td>`;
			} else {
				builder += `<td>${genotype}</td>`;
			}
		}
		builder += "</tr>";
	}

	let subbuilder = genotypeCounter.getTable("Расщепление по генотипу");

	if (phenotypeCounter.getSize() > 1) {
		subbuilder += "<br>" + phenotypeCounter.getTable("Расщепление по фенотипу");
	}

	builder += `</table><br><div>${subbuilder}</div>`;
	return builder;
}

function evalPhenotype(genotype) {
	let phenotypeParts = new Map();

	for (const allel of genotype) {
		let element = document.getElementById("inputFor" + allel);
		if (element.value !== "" && allel.toUpperCase() === allel && element !== null) {
			phenotypeParts.set(allel, element.value)
		} else if (element.value !== "" && !phenotypeParts.has(allel.toUpperCase()) && element !== null) {
			phenotypeParts.set(allel, element.value)
		}
	}

	return phenotypeParts.size === 0 ? null : [...phenotypeParts.values()].join(", ")
}

// Комбинирует гаметы для создания нового генотипа
function combineGametes(gamet1, gamet2) {
	if (gamet1.length != gamet2.length) {
		browseError("wrong gamet length");
		return null;
	}

	let genotype = "";
	for (let i = 0; i < gamet1.length; i++) {
		if (gamet1[i] < gamet2[i]) {
			genotype += gamet1[i] + gamet2[i];
		} else {
			genotype += gamet2[i] + gamet1[i];
		}
	}
	return genotype;
}

/// Создаёт набор гамет для заданного генотипа
function makeGametes(genotype) {
	clearError();

	if (!checkGenotype(genotype)) {
		return null;
	}

	function helper(genotype, position) {
		if (position >= genotype.length) {
			return;
		}

		let gams = helper(genotype, position + 2);

		if (gams === undefined) {
			return [...new Set([genotype[position], genotype[position + 1]])];
		}

		if (genotype[position] === genotype[position + 1]) { // гомозиготные по аллели?
			return gams.map(i => genotype[position] + i);
		} else {
			return [...gams.map(i => genotype[position] + i), ...gams.map(i => genotype[position + 1] + i)];
		}
	}

	return helper(genotype, 0);
}

function onChangeText() {
	document.getElementById("gametparams").innerHTML = "";

	if (!checkGenotypes(document.mainForm.genotype1.value, document.mainForm.genotype2.value)) {
		return;
	}

	let genotype = document.mainForm.genotype1.value;
	let gametes = makeGametes(genotype);
	if (gametes === null) {
		return;
	}
	let alleles = mergeStrings(gametes[0].toUpperCase(), gametes[0].toLowerCase());
	let result = "";
	for (let allel of alleles) {
		result += `<div class="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
		<div class="mdl-textfield mdl-js-textfield"><label class="tblbl">Фенотип ${allel}</label> <input type='text' class='mdl-textfield__input' id='inputFor${allel}'></div></div>`;
	}
	document.getElementById("gametparams").innerHTML = result;
}

function getInter(allel, alleles) {
	let result = `<select id="optionFor${allel}" name="optionFor${allel}">`;

	result += `<option selected value="no">Полное доминирование</option>`;
	for (let a of alleles) {
		if (a !== allel && a.toLowerCase() !== allel.toLowerCase()) {
			result += `<option value="epi-${a}">Эпистаз к ${a}</option>`;
		}

		if (a !== allel && a.toLowerCase() !== allel.toLowerCase()) {
			result += `<option value="sce-${a}">Сцеплен с ${a}</option>`;
		}
	}

	return result + "</select>";
}

function checkGenotype(genotype) {
	if (genotype.length % 2 !== 0) {
		browseError("Веедён некорректный генотип " + genotype);
		return false;
	}

	let member = [];

	for (let i = 0; i < genotype.length; i += 2) {
		if (member.includes(genotype[i].toLowerCase())) {
			browseError("Веедён некорректный генотип " + genotype);
			return false;
		}
		member.push(genotype[i].toLowerCase());
	}

	return true;
}

function checkGenotypes(genotype1, genotype2) {
	if (!checkGenotype(genotype1)) {
		return false;
	}

	if (!checkGenotype(genotype2)) {
		return false;
	}

	if (genotype1.length !== genotype2.length) {
		browseError(`Генотипы ${genotype1} и ${genotype2} некорректны`);
		return false;
	}

	for (let i = 0; i < genotype1.length; i += 1) {
		if (genotype1[i].toLowerCase() !== genotype2[i].toLowerCase()) {
			browseError(`Генотипы ${genotype1} и ${genotype2} некорректны`);
			return false;
		}
	}

	return true;
}

function mergeStrings(string1, string2) {
	let result = "";
	for (let i = 0; i < string1.length; i++) {
		result += string1[i] + string2[i];
	}
	return result;
}