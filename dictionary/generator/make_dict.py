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
	<div id="search-area">
		<input type="text" placeholder="Что ищем?" id="search-input">

		<button type="button" id="search-clear">
			<svg style="width:18px;height:18px;fill:rgba(255, 255, 255, .3);" viewBox="0 0 24 24">
				<path d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' />
			</svg>
		</button>

		<button id="search-button">Поиск</button>
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
		<dl>
		{"".join([f"<dt>{tr.word}</dt><dd>{tr.meaning}</dd>" for tr in translations])}
		</dl>
		"""

	def _buildPage(self, pairs, title):
		return f"""
<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <title>Словарь</title>

  <link rel="apple-touch-icon" sizes="57x57" href="../../resources/images/icons/apple-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="60x60" href="../../resources/images/icons/apple-icon-60x60.png">
  <link rel="apple-touch-icon" sizes="72x72" href="../../resources/images/icons/apple-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="76x76" href="../../resources/images/icons/apple-icon-76x76.png">
  <link rel="apple-touch-icon" sizes="114x114" href="../../resources/images/icons/apple-icon-114x114.png">
  <link rel="apple-touch-icon" sizes="120x120" href="../../resources/images/icons/apple-icon-120x120.png">
  <link rel="apple-touch-icon" sizes="144x144" href="../../resources/images/icons/apple-icon-144x144.png">
  <link rel="apple-touch-icon" sizes="152x152" href="../../resources/images/icons/apple-icon-152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="../../resources/images/icons/apple-icon-180x180.png">
  <link rel="icon" type="image/png" sizes="192x192" href="../../resources/images/icons/android-icon-192x192.png">
  <link rel="icon" type="image/png" sizes="32x32" href="../../resources/images/icons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="96x96" href="../../resources/images/icons/favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="16x16" href="../../resources/images/icons/favicon-16x16.png">
  <link rel="icon" type="image/ico" href="./favicon.ico" />
  <meta name="msapplication-TileColor" content="#ffffff">
  <meta name="msapplication-TileImage" content="../../resources/images/icons/ms-icon-144x144.png">
  <meta name="theme-color" content="#ffffff">

  <link
    href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
    integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
  <link rel="stylesheet" href="../../stylesheets/common.css">
  <link rel="stylesheet" href="../../stylesheets/dictionary.css">
</head>

<body>
  <nav>
    <button class="darker" id="menu-show">
      <img src="../../resources/images/menu.svg" >
    </button>
    <a href="../../index.html">
      <img src="../../resources/images/home.svg" />
    </a>
  </nav>

  <main class="offseted">
	  <h1>Слова на букву {title}</h1>
    {self._generateTable(sorted(pairs, key=lambda x: x.word))}
  </main>

	  <div id="content-panel" class="nav-panel hide">
	   <span class="nav-panel-title">Англо-русский словарь</span>

          <div class="main-panel-group">
            <h6>Количество слов в базе данных: 1354</h6>
            <div class="letter-group">
              <a class="letter" href="../en-ru/A_words.html">
                A
              </a>
              <a class="letter" href="../en-ru/B_words.html">
                B
              </a>
              <a class="letter" href="../en-ru/C_words.html">
                C
              </a>
              <a class="letter" href="../en-ru/D_words.html">
                D
              </a>
              <a class="letter" href="../en-ru/E_words.html">
                E
              </a>
              <a class="letter" href="../en-ru/F_words.html">
                F
              </a>
              <a class="letter" href="../en-ru/G_words.html">
                G
              </a>
              <a class="letter" href="../en-ru/H_words.html">
                H
              </a>
              <a class="letter" href="../en-ru/I_words.html">
                I
              </a>
              <span class="letter" href="../en-ru/K_words.html">
                K
              </a>
              <a class="letter" href="../en-ru/L_words.html">
                L
              </a>
              <a class="letter" href="../en-ru/M_words.html">
                M
              </a>
              <a class="letter" href="../en-ru/N_words.html">
                N
              </a>
              <a class="letter" href="../en-ru/O_words.html">
                O
              </a>
              <a class="letter" href="../en-ru/P_words.html">
                P
              </a>
              <a class="letter" href="../en-ru/R_words.html">
                R
              </a>
              <a class="letter" href="../en-ru/S_words.html">
                S
              </a>
              <a class="letter" href="../en-ru/T_words.html">
                T
              </a>
              <a class="letter" href="../en-ru/U_words.html">
                U
              </a>
              <a class="letter" href="../en-ru/Q_words.html">
                Q
              </a>
              <a class="letter" href="../en-ru/V_words.html">
                V
              </a>
              <a class="letter" href="../en-ru/W_words.html">
                W
              </a>
              <a class="letter" href="../en-ru/X_words.html">
                X
              </a>
              <a class="letter" href="../en-ru/Y_words.html">
                Y
              </a>
              <a class="letter" href="../en-ru/Z_words.html">
                Z
              </a>
            </div>
          </div>

          <span class="nav-panel-title">Русско-английский словарь</span>
          <div class="main-panel-group">
            <h6>Количество слов в базе данных: 2847</h6>
            <div class="letter-group">
              <a class="letter" href="../ru-en/А_words.html">
                А
              </a>
              <a class="letter" href="../ru-en/Б_words.html">
                Б
              </a>
              <a class="letter" href="../ru-en/В_words.html">
                В
              </a>
              <a class="letter" href="../ru-en/Г_words.html">
                Г
              </a>
              <a class="letter" href="../ru-en/Д_words.html">
                Д
              </a>
              <a class="letter" href="../ru-en/Е_words.html">
                Е
              </a>
              <a class="letter" href="../ru-en/Ё_words.html">
                Ё
              </a>
              <a class="letter" href="../ru-en/Ж_words.html">
                Ж
              </a>
              <a class="letter" href="../ru-en/З_words.html">
                З
              </a>
              <a class="letter" href="../ru-en/И_words.html">
                И
              </a>
              <a class="letter" href="../ru-en/Й_words.html">
                Й
              </a>
              <a class="letter" href="../ru-en/К_words.html">
                К
              </a>
              <a class="letter" href="../ru-en/Л_words.html">
                Л
              </a>
              <a class="letter" href="../ru-en/М_words.html">
                М
              </a>
              <a class="letter" href="../ru-en/Н_words.html">
                Н
              </a>
              <a class="letter" href="../ru-en/О_words.html">
                О
              </a>
              <a class="letter" href="../ru-en/П_words.html">
                П
              </a>
              <a class="letter" href="../ru-en/Р_words.html">
                Р
              </a>
              <a class="letter" href="../ru-en/С_words.html">
                С
              </a>
              <a class="letter" href="../ru-en/Т_words.html">
                Т
              </a>
              <a class="letter" href="../ru-en/У_words.html">
                У
              </a>
              <a class="letter" href="../ru-en/Ф_words.html">
                Ф
              </a>
              <a class="letter" href="../ru-en/Х_words.html">
                Х
              </a>
              <a class="letter" href="../ru-en/Ц_words.html">
                Ц
              </a>
              <a class="letter" href="../ru-en/Ч_words.html">
                Ч
              </a>
              <a class="letter" href="../ru-en/Ш_words.html">
                Ш
              </a>
              <a class="letter" href="../ru-en/Щ_words.html">
                Щ
              </a>
              <a class="letter" href="../ru-en/Э_words.html">
                Э
              </a>
              <a class="letter" href="../ru-en/Ю_words.html">
                Ю
              </a>
              <a class="letter" href="../ru-en/Я_words.html">
                Я
              </a>
            </div>
          </div>
	  </div>
  </main>

  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
    integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
    crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
    integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
    crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"
    integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI"
    crossorigin="anonymous"></script>
  <script src="../../scripts/lib/search_engine.min.js"> </script>
  <script>
    for(let a of $("a")) {{
      if(a.innerText.trim() === "{title}") {{
        a.style.color = "hsl(293, 100%, 30%)";
      }}
    }}

    function menuToggle() {{
      $("#content-panel").toggle();
      $("main").toggleClass("offseted");
      $("#menu-show").toggleClass("darker");
    }}

    document.getElementById("menu-show").addEventListener("click", menuToggle);
  </script>
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