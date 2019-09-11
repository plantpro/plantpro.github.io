#: import flexibel.coffee

# 86 80 25 77 73 76 100 90 69 93 90 83 70 73 73 70 90 83 71 95 40 58 68 69 100 78 87 97 92 74
runApplication = () ->
	input = runParser valueof "seqInput"
	isPopulation = checkedof "checkbox1"

	htmlset "reportPlace", makeReport(input, isPopulation)

makeReport = (data, isPopulation) ->
	parameters = getStatisticParameters data, isPopulation
	target = if isPopulation then "генеральной совокупности" else "выборки"

	[
		"<ul class='mdc-list mdc-list--two-line'>"
		reportElement "Размер #{target}:", parameters.size
		reportElement "Сумма #{target}:", parameters.summa
		reportElement "Максимум #{target}:", parameters.maximum
		reportElement "Минимум #{target}:", parameters.minimum
		reportElement "Среднее #{target}:", parameters.mean
		reportElement "Медиана #{target}:", parameters.median
		reportElement "Моды #{target}:", parameters.modes.join ", "
		reportElement "Размах #{target}:", parameters.range
		reportElement "Дисперсия #{target}:", parameters.variance
		reportElement "Стандартное отклонение #{target}:", parameters.sd
		"</ul>"
		getFerqsTable(parameters.freqs, parameters.size)
	].join ""

reportElement = (title, value) ->
	return """
		<li class="mdc-list-item">
			<span class="mdc-list-item__text">
				<span class="mdc-list-item__primary-text" style="color: #3f51b5; font-size: 12px;">
					#{title}
				</span>
				<span class="mdc-list-item__secondary-text" style="padding-left: 10px;">
					#{value}
				</span>
			</span>
		</li>
	"""

getStatisticParameters = (data, isPopulation) ->
	size = data.length
	summa = sum data
	mean = summa / size
	orderedData = data.sort sub
	maximum = document.flexibel.max orderedData
	minimum = document.flexibel.min orderedData
	median = findMedian orderedData
	range = maximum - minimum
	variance = orderedData
		.map (x) -> (x - mean) ** 2
		.reduce(sum) / if isPopulation then size else size - 1
	sd = Math.sqrt variance
	freqs = counter orderedData
	modes = findMode freqs

	{ size, summa, mean, median, maximum, minimum, range, variance, sd, freqs, modes }

getFerqsTable = (freqs, size) ->
	"""
	<div style="overflow: auto; width: 100%;">
	<table class="mdl-data-table mdl-js-data-table">
		<tr>
			<td>x</td>
			#{ejoin makeKeyCells freqs}
		</tr>
		<tr>
			<td>f</td>
			#{ejoin makeValueCells freqs}
		</tr>
		<tr>
			<td>ω</td>
			#{ejoin(makeMapCells freqs, (i) -> new String(i[1] / size).substr(0, 5))}
		</tr>
	</table>
</div>
"""

findMode = (freqs) ->
	max = maxValue freqs
	for i from freqs when i[1] == max then i[0]

findMedian = (data) ->
	return (data[data.length / 2] + data[data.length / 2 + 1]) / 2 if data.length % 2 is 0
	data[Math.floor(data.length / 2)]

counter = (values) ->
	map = new Map
	countIt map, i for i in values
	map

runParser = (input) ->
	parserState = {
		result: []
		currentPosition: 0
		input: input
	}

	getCurrent = (state) ->
		state.input[state.currentPosition]
	
	next = (state) ->
		current = getCurrent state
		state.currentPosition++
		current

	parseNumber = (state) ->
		buffer = next state
		while (current = next state) in "0123456789."
			buffer += current
		state.result.push parseFloat(buffer)

	while parserState.currentPosition < input.length
		if (getCurrent parserState) in "0123456789"
			parseNumber parserState
		else
			next parserState
	
	parserState.result

element "runButton"
	.addEventListener("click", runApplication)
