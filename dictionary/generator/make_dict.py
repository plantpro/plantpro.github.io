# Usage: py .\dictionary\generator\make_dict.py .\dictionary\generator\src.txt .\dictionary\
# Generic usage: py make_dict.py [input-file] [output-dir]
# Input file line format: en_word, en_word|ru_word, ru_word

import sys

from collections import defaultdict

# Delimiter between two translations
LANG_DELIM = "|"
# Delimiter between synonyms
WORD_DELIM = ", "

# English is left of LANG_DELIM
EN_PART_INDEX = 0
# Russian is rigth of LANG_DELIM
RU_PART_INDEX = 1

SEARCH_FORM = """
		<div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable" style="float: right;margin-top: 12px;">
			<label class="mdl-button mdl-js-button mdl-button--icon" for="text-to-find">
				<i class="material-icons">search</i>
			</label>
			<div class="mdl-textfield__expandable-holder">
				<input class="mdl-textfield__input" type="text" id="text-to-find">
				<label class="mdl-textfield__label" for="sample-expandable">Expandable Input</label>
			</div>
		</div>
"""

SEARCH_SCRIPT = "../../scripts/lib/search_engine.js"

class Translation:
	def __init__(self, word, meaning):
		self.word = word
		self.meaning = meaning
	
	def get_letter(self):
		return self.word[0].upper()

	def __str__(self):
		return self.word + " -> " + self.meaning
	
	def __repr__(self):
		return self.__str__()

class WordCounter:
	def __init__(self):
		self.count = 0
		self.dict = dict()
	
	def countIt(self, translations):
		for i in translations:
			self.count += 1
			if i.get_letter() in self.dict:
				self.dict[i.get_letter()].append(i)
			else:
				self.dict[i.get_letter()] = [i]
	
	def saveTo(self, dir):
		def groupIt(self):
			result = defaultdict(list)
			for i in self.dict:
				res = defaultdict(list)
				for j in self.dict[i]:
					res[j.word].append(j.meaning)
				result[i] = [Translation(w, ", ".join(m)) for w, m in res.items()]
			return result

		for name, tr in groupIt(self).items():
			with open(dir + "\\" + name + "_words.html", "w+", encoding="utf-8") as file:
				file.write(self._buildPage(tr, name))
	
	def _generateTable(self, translations):
		return f"""
		<table class="mdl-data-table">
		<thead>
			<tr>
				<td class="mdl-data-table__cell--non-numeric">Слово</td>
				<td class="mdl-data-table__cell--non-numeric">Перевод</td>
			</tr>
		</thead>
		<tbody id="dict-entries">
		{"".join([f"<tr><td class='mdl-data-table__cell--non-numeric'>{tr.word}</td><td class='mdl-data-table__cell--non-numeric'>{tr.meaning}</td></tr>" for tr in translations])}
		</tbody>
		</table>
		"""

	def _buildPage(self, pairs, title):
		return f"""
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
									<div class="mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--2-col-phone">
										<h3>{title}</h3>
									</div>
									<div class="mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--2-col-phone">
										{SEARCH_FORM}
									</div>
									<div class="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
										{self._generateTable(sorted(pairs, key=lambda x: x.word))}
									</div>
								</div>
							</div>
						</main>
					</div>
				</body>
				<script src="{SEARCH_SCRIPT}"></script>
			</html>"""

# Parse line of input file
# Returns a tuple ([Translation], [Translation])
def parseLine(line):
	# Split input line by | to [en_part: str, ru_part: str]
	translation_pair = list(map(lambda i: i.strip(), line.split(LANG_DELIM)))
	# Split en_part by , to [word1, word2, ..., wordn]
	en_part = map(lambda i: i.strip(), translation_pair[EN_PART_INDEX].split(WORD_DELIM))
	# Split ru_part by , to [word1, word2, ..., wordn]
	ru_part = map(lambda i: i.strip(), translation_pair[RU_PART_INDEX].split(WORD_DELIM))
	return ([Translation(i, translation_pair[RU_PART_INDEX]) for i in en_part], 
					[Translation(i, translation_pair[EN_PART_INDEX]) for i in ru_part])

input_file = sys.argv[1]
output_directory = sys.argv[2]

en_counter = WordCounter()
ru_counter = WordCounter()

with open(input_file, "r", encoding="utf-8") as file:
	line = file.readline()
	while line:
		if line.startswith("#"):
			line = file.readline()
			continue
		
		parse_result = parseLine(line)

		en_counter.countIt(parse_result[EN_PART_INDEX])
		ru_counter.countIt(parse_result[RU_PART_INDEX])

		line = file.readline()

en_counter.saveTo(output_directory + "\\en-ru")
ru_counter.saveTo(output_directory + "\\ru-en")

print(en_counter.count, ru_counter.count)