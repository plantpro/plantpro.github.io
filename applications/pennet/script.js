function runApplication() {
	let genotype1 = document.mainForm.genotype1.value;
	let genotype2 = document.mainForm.genotype2.value;

	let gametesFirst = makeGametes(genotype1);
	let gametesSecond = genotype1 === genotype2 ? gametesFirst : makeGametes(genotype2);
	
	document.getElementById("tableplace").innerHTML = createTable(gametesFirst, gametesSecond);
}

function createTable(g1, g2) {
	let counter = new Map();

	let builder = "<table class='pure-table'><tr><td></td>";

	for(let i of g2) {
		builder += "<td>" + i + "</td>"; 
	}

	builder += "</tr>";

	for(let i of g1) {
		builder += "<tr>"+ "<td>"+ i+"</td>";
		for(let j of g2) {
			let genotype = combineGametes(i, j);
			if(counter.has(genotype)) {
				counter.set(genotype, counter.get(genotype) + 1);
			} else {
				counter.set(genotype, 1);
			}
			builder += "<td>" + genotype + "</td>";
		}
		builder += "</tr>"; 
	}
	builder += "</table><br><div>Расщепление: " + [...counter.values()].sort((x, y) => y < x ? -1 : y === x ? 0 : 1).join(" : ") + "</div>";
	return builder;
}

function combineGametes(g1, g2) {
	let result = "";
	for(let i = 0; i < g1.length; i++) {
		if(g1[i] < g2[i]) {
			result += g1[i] + g2[i];
		} else {
			result += g2[i] + g1[i];
		}
	}
	return result;
}

function makeGametes(genotype, position=0) {
	if(position >= genotype.length) {
		return;
	}

	let gams = makeGametes(genotype, position + 2);
	
	if(gams === undefined) {
		return [...new Set([genotype[position], genotype[position + 1]])];
	}

	if(genotype[position] === genotype[position+1]) {
		return (gams.map(i => genotype[position] + i));
	} else {
		return ([...gams.map(i => genotype[position] + i), ...gams.map(i => genotype[position + 1] + i)]);
	}
}