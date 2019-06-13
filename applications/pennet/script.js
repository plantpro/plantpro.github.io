function runApplication() {
	let genotype1 = document.mainForm.genotype1.value;
	let genotype2 = document.mainForm.genotype2.value;

	let gametesFirst = makeGametes(genotype1);
	let gametesSecond = makeGametes(genotype2);
	
	document.getElementById("tableplace").innerHTML = createTable(gametesFirst, gametesSecond);
}

function createTable(g1, g2) {
	let result = "<table class='pure-table'><tr><td></td>";

	for(let i of g2) {
		result += "<td>" + i + "</td>";
	}

	result += "</tr>";

	for(let i of g1) {
		result += "<tr>" + "<td>" + i + "</td>";
		for(let j of g2) {
			result += "<td>" + combineGametes(i, j)  + "</td>"
		}
		result += "</tr>"
	}

	return result + "</table>"
}

function combineGametes(g1, g2) {
	let result = "";
	for(let i = 0; i < g1.length; i++) {
		result += g1[i] + g2[i];
	}
	return result;
}

function comb(A, a, B, b) {
	return [...new Set([[A, B], [A, b], [a, B], [a, b]])];
}

function makeGametes(genotype, position=0) {
	if(position >= genotype.length) {
		return;
	}
	let gams = makeGametes(genotype, position + 2);
	if(genotype[position] === genotype[position+1]) {
		if(gams === undefined) {
			return [genotype[position]];
		}
		return (gams.map(i => genotype[position] + i));
	} else {
		if(gams === undefined) {
			return [genotype[position], genotype[position + 1]];
		}
		return ([...gams.map(i => genotype[position] + i), ...gams.map(i => genotype[position + 1] + i)]);
	}
}