#format en_word, en_word|ru_word, ru_word

import sys

LANG_DELIM = "|"
WORD_DELIM = ", "

EN_PART_INDEX = 0
RU_PART_INDEX = 1

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
				<a class="mdl-navigation__link" href="../../index.html"><i class="material-icons">subject</i>Статьи</a>
				<a class="mdl-navigation__link" href="../../library/index.html"><i class="material-icons">book</i>Библиотека</a>
				<a class="mdl-navigation__link" href="../../applications/index.html"><i
						class="material-icons">translate</i>Приложения</a>
						<a class="mdl-navigation__link" href="../index.html"><i
							class="material-icons">widgets</i>Словарь</a>
				<a class="mdl-navigation__link" href="../../genetic-tasks/index.html"><i class="material-icons">list_alt</i>Сборник
					задач по генетике</a>
				<a class="mdl-navigation__link" href="../../about.html"><i class="material-icons"
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

class Translation:
	def __init__(self, first_letter, first_lang_word, second_lang_meaning):
		self.first_letter = first_letter
		self.first_lang_word = first_lang_word
		self.second_lang_meaning = second_lang_meaning
	def __str__(self):
		return self.first_lang_word + " -> " + self.second_lang_meaning
	def __repr__(self):
		return self.__str__()

def parseLine(line):
	translation_pair = list(map(lambda i: i.strip(), line.split(LANG_DELIM)))
	en_part = map(lambda i: i.strip(), translation_pair[EN_PART_INDEX].split(WORD_DELIM))
	ru_part = map(lambda i: i.strip(), translation_pair[RU_PART_INDEX].split(WORD_DELIM))
	return ([Translation(i[0].upper(), i, translation_pair[RU_PART_INDEX]) for i in en_part], 
					[Translation(i[0].upper(), i, translation_pair[EN_PART_INDEX]) for i in ru_part])

def generateTable(translations):
	result = """
	<table class="mdl-data-table">
	<thead>
		<tr>
			<td class="mdl-data-table__cell--non-numeric">Слово</td>
			<td class="mdl-data-table__cell--non-numeric">Перевод</td>
		</tr>
	</thead>
	"""
	for translation in translations:
		result += "<tr><td class='mdl-data-table__cell--non-numeric'>" + translation.first_lang_word + "</td><td class='mdl-data-table__cell--non-numeric'>" + translation.second_lang_meaning + "</td></tr>"
	
	result += "</table>"

	return result

def buildPage(pairs, title):
	generated_title = "<h3>" + title + "</h3>"
	generated_table = generateTable(pairs)
	return TEMPLATE_PART_ONE + generated_title + generated_table + TEMPLATE_PART_TWO

input_directory = sys.argv[1]
output_directory = sys.argv[2]

en_words_count = 0
ru_words_count = 0
groupped = dict()
ru_groupped = dict()
with open(input_directory, "r", encoding="utf-8") as file:
	line = file.readline()
	while line:
		parse_result = parseLine(line)
		
		for i in parse_result[EN_PART_INDEX]:
			en_words_count += 1
			if i.first_letter in groupped:
				groupped[i.first_letter].append(i)
			else:
				groupped[i.first_letter] = [i]

		for i in parse_result[RU_PART_INDEX]:
			ru_words_count += 1
			if i.first_letter in ru_groupped:
				ru_groupped[i.first_letter].append(i)
			else:
				ru_groupped[i.first_letter] = [i]

		line = file.readline()

#print(groupped)
for name in groupped:
	with open(output_directory + "\\en-ru\\" + name + "_words.html", "w+", encoding="utf-8") as file:
		file.write(buildPage(groupped[name], name))
for name in ru_groupped:
	with open(output_directory + "\\ru-en\\" + name + "_words.html", "w+", encoding="utf-8") as file:
		file.write(buildPage(ru_groupped[name], name))
print(en_words_count, ru_words_count)