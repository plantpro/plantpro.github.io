/*
 86 80 25 77 73 76 100 90 69 93 90 83 70 73 73 70 90 83 71 95 40 58 68 69 100 78 87 97 92 74
*/

function runApplication() {
	let input = parseInput(document.mainForm.seqInput.value);
	let output = document.getElementById("reportPlace");

	output.innerHTML = "";

	let isPopulation = document.mainForm.checkbox1.checked;
	let subMessage = isPopulation ? "генеральной совокупности" : "выборки";

	let reportRaw = []

	let n = input.length;
	let sum = input.reduce((x, y) => x + y);
	let mean = sum / n;

	reportRaw.push("<ul class='mdc-list mdc-list--two-line'>");

	reportRaw.push(reportElement(`Размер ${subMessage}:`, n));
	reportRaw.push(reportElement(`Сумма ${subMessage}:`, sum));
	reportRaw.push(reportElement(`Среднее ${subMessage}:`, mean));

	let ordered = input.sort((x, y) => x > y ? 1 : (x === y) ? 0 : -1);
	if (n % 2 === 0) {
		reportRaw.push(reportElement(`Медиана ${subMessage}:`, (ordered[n / 2] + ordered[n / 2 + 1]) / 2));
	} else {
		reportRaw.push(reportElement(`Медиана ${subMessage}:`, ordered[Math.floor(n / 2)]));
	}

	let rng = ordered[n - 1] - ordered[0];
	let variance = ordered.map(x => (x - mean) ** 2).reduce((x, y) => x + y) / (isPopulation ? n : n - 1);
	let freqs = counter(ordered);
	reportRaw.push(reportElement(`Моды ${subMessage}:`, findMode(freqs)));
	reportRaw.push(reportElement(`Размах ${subMessage}:`, rng));
	reportRaw.push(reportElement(`Дисперсия ${subMessage}:`, variance));
	reportRaw.push(reportElement(`Стандартное отклонение ${subMessage}:`, Math.sqrt(variance)));
	reportRaw.push("</ul>");

	reportRaw.push(getFerqsTable(freqs, input.length));

	output.innerHTML = reportRaw.join("");
}

function reportElement(title, value) {
	return `<li class="mdc-list-item ">
	<span class="mdc-list-item__text">
		<span class="mdc-list-item__primary-text" style='color: #3f51b5;font-size: 12px;'>${title}</span> 
		<span class="mdc-list-item__secondary-text" style='padding-left:10px;'>${value}</span>
		</span>
		</li>`;
}

function getFerqsTable(freqs, size) {
	let result = `
	<div style="overflow: auto;">
		<table class="mdl-data-table mdl-js-data-table">
			<tr>
				<td><mi>x</mi></td>`;

	for (let i of freqs) {
		result += `<td>${i[0]}</td>`;
	}

	result += `</tr><tr><td>f</td>`;

	for (let i of freqs) {
		result += `<td>${i[1]}</td>`;
	}

	result += `</tr><tr><td>ω</td>`;

	for (let i of freqs) {
		result += `<td>${new String(i[1] / size).substr(0, 5)}</td>`;
	}

	return result + "</tr></table></div>";
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