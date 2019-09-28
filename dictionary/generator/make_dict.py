import sys

TEMPLATE_PART_ONE = """
<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<title>Словарь агронома</title>

	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
	<link rel="stylesheet" href="../../stylesheets/material.min.css">
	<script src="../../scripts/material.min.js"></script>
</head>

<body>
	<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
		<header class="mdl-layout__header">
			<div class="mdl-layout__header-row">
				<span class="mdl-layout-title">PLANT PROTECTION</span>
				<div class="mdl-layout-spacer"></div>
				<nav class="mdl-navigation mdl-layout--large-screen-only">
					<a class="mdl-navigation__link" href="about.html">О сайте</a>
				</nav>
			</div>
		</header>

		<div class="mdl-layout__drawer">
			<span class="mdl-layout-title">Разделы</span>
			<nav class="mdl-navigation">
				<a class="mdl-navigation__link" href="index.html"><i class="material-icons">subject</i>Статьи</a>
				<a class="mdl-navigation__link" href="library/index.html"><i class="material-icons">book</i>Библиотека</a>
				<a class="mdl-navigation__link" href="applications/index.html"><i
						class="material-icons">translate</i>Приложения</a>
						<a class="mdl-navigation__link" href="dictionary/index.html"><i
							class="material-icons">widgets</i>Словарь</a>
				<a class="mdl-navigation__link" href="genetic-tasks/index.html"><i class="material-icons">list_alt</i>Сборник
					задач по генетике</a>
				<a class="mdl-navigation__link" href="about.html"><i class="material-icons"
						style="font-size: 24px">live_help</i> О сайте</a>
			</nav>
		</div>

		<main class="mdl-layout__content">
			<div class="page-content">
				<div class="mdl-grid">
					<div class="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
"""
TEMPLATE_PART_TWO = """
					</div>
				</div>
			</div>
		</main>
	</div>
</body>
</html>
"""

def normalizePair(pair):
	return (pair[0].capitalize(), pair[1].capitalize())

def generateTable(pairs):
	result = """
	<table class="mdl-data-table">
	<thead>
		<tr>
			<td class="mdl-data-table__cell--non-numeric">Слово</td>
			<td class="mdl-data-table__cell--non-numeric">Перевод</td>
		</tr>
	</thead>
	"""
	for word, translated_word in pairs:
		result += "<tr><td>" + word + "</td><td>" + translated_word + "</td></tr>"
	
	result += "</table>"

	return result

def buildPage(pairs):
	generated_title = "<h3>" + pairs[0][0][0] + "</h3>"
	generated_table = generateTable(pairs)
	return TEMPLATE_PART_ONE + generated_title + generated_table + TEMPLATE_PART_TWO

input_directory = sys.argv[1]
output_directory = sys.argv[2]

groupped = dict()
with open(input_directory, "r", encoding="utf-8") as file:
	line = file.readline()
	while line:
		pair = normalizePair(line.split("|"))
		first_letter = pair[0][0]
		if first_letter in groupped:
			groupped[first_letter].append(pair)
		else:
			groupped[first_letter] = [pair]
		line = file.readline()

print(groupped)
for name in groupped:
	with open(output_directory + "\\" + name + "_words.html", "w+", encoding="utf-8") as file:
		file.write(buildPage(groupped[name]))
