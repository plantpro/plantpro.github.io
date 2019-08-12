/*
 86 80 25 77 73 76 100 90 69 93 90 83 70 73 73 70 90 83 71 95 40 58 68 69 100 78 87 97 92 74
*/

function runApplication() {
	let input = parseInput(document.mainForm.seqInput.value);
	let output = document.getElementById("reportPlace");

	output.innerHTML = "";

	let reportRaw = []

	let n = input.length;
	let sum = input.reduce((x, y) => x + y);
	let mean = sum / n;

	reportRaw.push(`Размер выборки: ${n}`);
	reportRaw.push(`Сумма выборки: ${sum}`);
	reportRaw.push(`Среднее выборки: ${mean}`);

	let ordered = input.sort((x, y) => x > y ? 1 : (x === y) ? 0 : -1);
	if (n % 2 === 0) {
		reportRaw.push(`Медиана выборки: ${(ordered[n / 2] + ordered[n / 2 + 1]) / 2}`);
	} else {
		reportRaw.push(`Медиана выборки: ${ordered[Math.floor(n / 2)]}`);
	}

	let rng = ordered[n - 1] - ordered[0];
	let variance = ordered.map(x => (x - mean) ** 2).reduce((x, y) => x + y) / (n - 1);
	let freqs = counter(ordered);
	reportRaw.push(`Моды выборки: ${findMode(freqs)}`);
	reportRaw.push(`Размах выборки: ${rng}`);
	reportRaw.push(`Дисперсия выборки: ${variance}`);
	reportRaw.push(`Стандартное отклонение выборки: ${Math.sqrt(variance)}`);

	reportRaw.push(getFerqsTable(freqs, input.length));

	output.innerHTML = reportRaw.join("<br>");

	var script = document.createElement("script");
  script.type = "text/javascript";
  script.src  = "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=MML_HTMLorMML";
  document.getElementsByTagName("head")[0].appendChild(script);
}

function getFerqsTable(freqs, size) {
	let result = `
	<math display="block">
		<mrow>
			<mtable columnspacing="0.5em" columnlines="solid none none none none none none none" rowlines="solid">
				<mtr>
					<mtd columnalign="center"><mi>x</mi></mtd>`;

	for (let i of freqs) {
		result += `<mtd columnalign="center"><mi>${i[0]}</mi></mtd>`;
	}

	result += `</mtr><mtr><mtd columnalign="center"><mi>f</mi></mtd>`;

	for (let i of freqs) {
		result += `<mtd columnalign="center"><mi>${i[1]}</mi></mtd>`;
	}

	result += `</mtr><mtr><mtd columnalign="center"><mi>ω</mi></mtd>`;

	for (let i of freqs) {
		result += `<mtd columnalign="center"><mi>${new String(i[1] / size).substr(0, 5)}</mi></mtd>`;
	}

	return result + "</mtr></mtable></mrow></math>";
}

function findMode(freqs) {
	let maxKeys = [];
	let maxValue = [...freqs.values()].reduce((x, y) => x > y ? x : y);
	for (let i of freqs) {
		if (i[1] === maxValue) {
			maxKeys.push(i[0]);
		}
	}
	return maxKeys;
}

function counter(values) {
	let map = new Map();
	for (let i of values) {
		if (map.has(i)) {
			console.log("HAS")
			map.set(i, map.get(i) + 1);
		} else {
			map.set(i, 1);
		}
	}
	return map;
}

function parseInput(inputstr) {
	let result = [];
	inputstr.split(",").forEach(i => {
		let t = i.trim();
		if (t.length != 0) {
			if (t.includes(" ")) {
				let subNumbers = t.split(" ");
				for (let x of subNumbers) {
					result.push(parseFloat(x.trim()));
				}
			} else {
				result.push(parseFloat(i.trim()));
			}
		}
	});
	return result;
}