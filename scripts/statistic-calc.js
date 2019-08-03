function runApplication() {
	let input = parseInput(document.mainForm.seqInput.value);
	let output = document.getElementById("reportPlace");

	output.innerHTML = `<div class="mdl-spinner mdl-js-spinner is-active"></div>`;

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
}

function getFerqsTable(freqs, size) {
	let result = `<table class='mdl-data-table mdl-js-data-table'><tr><td>Значение</td><td>Частота</td><td>Относительная частота</td></tr>`;

	for (let i of freqs) {
		result += `<tr><td>${i[0]}</td><td>${i[1]}</td><td>${i[1] / size}</td></tr>`;
	}

	return result + "</table>";
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