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
	<input class="form-control mr-sm-2" id="text-to-find" type="search" placeholder="Поиск" aria-label="Search">
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
		<table class="table table-bordered">
		<thead>
			<tr>
				<th>Слово</th>
				<th>Перевод</th>
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
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<title>Словарь</title>

	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
		integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
	<link rel="stylesheet" href="../../stylesheets/style.css">
	<style>
		.letter-group {{
			font-size: 3em;
			text-align: center;
		}}

		.letter {{
			color: var(--secondary);
		}}

		.letter:hover {{
			color: var(--secondary);
			text-decoration: none;
		}}
	</style>
</head>

<body>
	<nav class="navbar navbar-expand-lg navbar-grey d-flex d-md-none">
		<a class="navbar-brand">
			<img src="../../resources/images/logo-black.svg" />
		</a>

		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"
			aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon navbar-toggler-dark-icon"></span>
		</button>

		<div class="collapse navbar-collapse" id="navbarText">
			<ul class="navbar-nav ml-auto">
				<li class="nav-item mr-lg-5">
					<a class="nav-link nav-link-grey" href="../../index.html">Главная</a>
				</li>
				<li class="nav-item mr-lg-5">
					<a class="nav-link nav-link-grey" href="../../articles/index.html">Статьи</a>
				</li>
				<li class="nav-item mr-lg-5">
					<a class="nav-link nav-link-grey" href="../../library/index.html">Книги</a>
				</li>
				<li class="nav-item mr-lg-5">
					<a class="nav-link nav-link-grey" href="../../applets/index.html">Апплеты</a>
				</li>
				<li class="nav-item mr-lg-5">
					<a class="nav-link nav-link-grey" href="../../media/index.html">Медиа</a>
				</li>
			</ul>
		</div>
	</nav>

	<div class="division-header">
		<div class="row">
			<div class="col-md-4 col-lg-2 text-center">
				<img class="division-header-img" src="../../resources/images/dictionary-cover.jpg" />
			</div>

			<div class="col-md-8 col-lg-10 text-center text-sm-left">
				<nav class="navbar navbar-expand-lg navbar-grey d-none d-md-flex">
					<a class="navbar-brand">
					</a>

					<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#inline-navbar"
						aria-controls="inline-navbar" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon navbar-toggler-dark-icon"></span>
					</button>

					<div class="collapse navbar-collapse" id="inline-navbar">
						<ul class="navbar-nav ml-auto">
							<li class="nav-item mr-lg-5">
								<a class="nav-link nav-link-grey" href="../../index.html">Главная</a>
							</li>
							<li class="nav-item mr-lg-5">
								<a class="nav-link nav-link-grey" href="../../articles/index.html">Статьи</a>
							</li>
							<li class="nav-item mr-lg-5">
								<a class="nav-link nav-link-grey" href="../../library/index.html">Книги</a>
							</li>
							<li class="nav-item mr-lg-5">
								<a class="nav-link nav-link-grey" href="../../applets/index.html">Апплеты</a>
							</li>
							<li class="nav-item mr-lg-5">
								<a class="nav-link nav-link-grey" href="../../media/index.html">Медиа</a>
							</li>
						</ul>
					</div>
				</nav>
				<h1 class="division-header-title">Словарь</h1>
				<span class="division-header-description">

				</span>
				{SEARCH_FORM}		
			</div>
		</div>
	</div>

	<div class="container-fluid mt-3 mb-3">
			<h3>{title}</h3>
			{self._generateTable(sorted(pairs, key=lambda x: x.word))}
		</div>
		
    <script
      src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
      integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
      integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"
      integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI"
      crossorigin="anonymous"
    ></script>
		<script src="../../scripts/lib/search_engine.min.js"> </script>
  </body>
</html>
"""

# Parse line of input file
# Returns a tuple ([Translation], [Translation])
def parseLine(line):
	# Split input line by LANG_DELIM to [en_part: str, ru_part: str]
	translation_pair = list(map(lambda i: i.strip(), line.split(LANG_DELIM)))
	# Split en_part by WORD_DELIM to [word1, word2, ..., wordn]
	en_part = map(lambda i: i.strip(), translation_pair[EN_PART_INDEX].split(WORD_DELIM))
	# Split ru_part by WORD_DELIM to [word1, word2, ..., wordn]
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