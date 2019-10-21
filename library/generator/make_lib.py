# Usage: py .\dictionary\generator\make_dict.py .\dictionary\generator\src.txt .\dictionary\
# Generic usage: py make_dict.py [input-file] [output-dir]
# Input file line format: en_word, en_word|ru_word, ru_word

import sys

CAT_GOST = """<a class="post-category post-category-biochemistry">ГОСТ</a>"""
CAT_SOIL = """<a class="post-category post-category-geology">Почвоведение</a>"""
CAT_AGRO_SOIL = """<a class="post-category post-category-geology">Земледелие</a>"""
CAT_AGRO_CHEM = """<a class="post-category post-category-organic-chemistry">Агрохимия</a>"""
CAT_ATLAS = """<a class="post-category post-category-statistics">Атласы</a>"""
CAT_MICRO = """<a class="post-category post-category-microbiology">Микробиология</a>"""
CAT_BIO_CHEM = """<a class="post-category post-category-biochemistry">Биохимия</a>"""
CAT_BOTANY = """<a class="post-category post-category-plant-anatomy">Ботаника</a>"""

# name, rating, hardeness, catregories, link, main cat. name
LIBRARY_SRC = [
	["ГОСТ 3040-55. Зерно. Методы определения качества", 5, 0, [CAT_GOST], "https://drive.google.com/open?id=17QHxQnZMydfnyzoX215Rf_5pgCaT-T6O", "post-category-biochemistry"],
	["ГОСТ 10840-2017. Зерно. Метод определения натуры", 5, 0, [CAT_GOST], "https://drive.google.com/open?id=18ZoDBOvlQx0-se8mADhHip21u4XDpWKI", "post-category-biochemistry"],
	["Пестряков. Почвы Ленинградской области", 5, 0, [CAT_SOIL], "https://drive.google.com/open?id=1DYoANT-KNIB133Efb-ajg-CdL9jBDytz", "post-category-geology"],
	["Атлас СССР (1983)", 5, 0, [CAT_ATLAS], "https://drive.google.com/open?id=1JHZt-ROquT0BOpYF0OCew4cK4XQSxbx3", "post-category-statistics"],
	["Земледелие с основами почвоведения и агрохимии", 5, 3, [CAT_SOIL, CAT_AGRO_SOIL, CAT_AGRO_CHEM], "https://drive.google.com/file/d/1TFuXEHKQKnuusicduuuM808Vfu8UFwgt/view?usp=sharing", "post-category-geology"],
	["Пиневич. Микробиология в 3-х томах", 5, 4, [CAT_MICRO, CAT_BIO_CHEM], "https://drive.google.com/open?id=1DHHn4ElLM46k91iX0kk07oVqM1XeXeY0", "post-category-microbiology"],
	["Основы биохимии Ленинджера", 5, 3, [CAT_BIO_CHEM], "https://drive.google.com/open?id=1qRPv_SrkH5Ak-i1Ys7r1_67YhQxvggEk", "post-category-biochemistry"],
	["Страсбургер. Ботаника", 4, 4, [CAT_BOTANY], "https://drive.google.com/open?id=1rwqjry1pAjqjvPZGYTnqi8iDfmlJ631J", "post-category-plant-anatomy"],
	["Шлегель. Общая микробиология", 5, 3, [CAT_MICRO, CAT_BIO_CHEM], "https://drive.google.com/open?id=1E7JOA67H07szlvnI6GCDM61H_pUcPL0R", "post-category-microbiology"],
	["Гусев. Микробиология", 2, 2, [CAT_MICRO], "https://drive.google.com/open?id=1VQwqYJ_n4df_bIESAtrknQMA9Xkm3I86", "post-category-microbiology"],
	["Нетрусов. Микробиология", 3, 2, [CAT_MICRO], "https://drive.google.com/open?id=16syzS8v6O1jGV-wzMBXln5vN5MyDfr_q", "post-category-microbiology"],
]

RATING_STRING = """<svg width="18" height="18" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="gold"/><path d="M0 0h24v24H0z" fill="none"/></svg>"""
HARDENESS_STRING = """<svg width="18" height="18" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="orangered"/><path d="M0 0h24v24H0z" fill="none"/></svg>"""

EMPTY_RATING_STRING = """<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" fill="gold"/><path d="M0 0h24v24H0z" fill="none"/></svg>"""
EMPTY_HARDENESS_STRING = """<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" fill="orangered"/><path d="M0 0h24v24H0z" fill="none"/></svg>"""

def processRating(rating):
	return (RATING_STRING * rating) + (EMPTY_RATING_STRING * (5 - rating))

def processHardeness(hardeness):
	return (HARDENESS_STRING * hardeness) + (EMPTY_HARDENESS_STRING * (5 - hardeness))

def processCategories(categories):
	return "".join(categories)

def makeItem(itemSrc):
	return f"""
	<div class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone">
		<div class="article-card mdl-card mdl-shadow--2dp">
			<div class="mdl-card__title mdl-card--expand {itemSrc[5]}">
				<h2 class="mdl-card__title-text">{itemSrc[0]}</h2>
			</div>
		
			<div class="mdl-card__supporting-text">
				<span style="vertical-align: top">Рейтинг:</span>
				{processRating(itemSrc[1])}
				<br>
				<span style="vertical-align: top">Сложность:</span>
				{processHardeness(itemSrc[2])}
			</div>
		
			<div class="mdl-card__actions">
				{processCategories(itemSrc[3])}
			</div>
		
			<div class="mdl-card__actions mdl-card--border">
				<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
					href="{itemSrc[4]}">Скачать</a>
			</div>
		</div>
	</div>
	"""

def makeItems(src):
	result = ""
	for i in src:
		result += makeItem(i)
	return result

def buildPage(itemsString):
	return f"""
		<!doctype html>
		<html lang="ru">
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta name="description" content="Статьи по защите растений">
			<title>Библиотека</title>

			<link rel="stylesheet" href="../stylesheets/material.min.css">
			<script src="../scripts/material.min.js"></script>
		</head>
		<body>
			<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
				<header class="mdl-layout__header">
					<div class="mdl-layout__header-row">
						<span class="mdl-layout-title">PLANT PROTECTION</span>
						<!-- Add spacer, to align navigation to the right -->
						<div class="mdl-layout-spacer"></div>
						<!-- Navigation. We hide it in small screens. -->
						<nav class="mdl-navigation mdl-layout--large-screen-only">
							<div class="mdl-navigation__link mdl-textfield mdl-js-textfield mdl-textfield--expandable"
								style="float: right;">
								<label class="mdl-button mdl-js-button mdl-button--icon" for="text-to-find">
									<svg style="width:24px;height:24px" viewbox="0 0 24 24">
										<path fill="#ffffff"
											d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
									</svg>
								</label>
								<div class="mdl-textfield__expandable-holder">
									<input class="mdl-textfield__input" type="text" id="text-to-find">
									<label class="mdl-textfield__label" for="sample-expandable">Expandable Input</label>
								</div>
							</div>
							<a class="mdl-navigation__link" href="../about.html">О сайте</a>
						</nav>
					</div>
				</header>

				<div class="mdl-layout__drawer">
					<span class="mdl-layout-title">Разделы</span>
					<nav class="mdl-navigation">
						<a class="mdl-navigation__link" href="../index.html">
							<svg style="width:24px;height:24px" viewbox="0 0 24 24">
								<path fill="#757575" d="M4,5H20V7H4V5M4,9H20V11H4V9M4,13H20V15H4V13M4,17H14V19H4V17Z" />
							</svg>
							Статьи</a>
						<a class="mdl-navigation__link" href="../library/index.html">
							<svg style="width:24px;height:24px" viewbox="0 0 24 24">
								<path fill="#757575"
									d="M18,22A2,2 0 0,0 20,20V4C20,2.89 19.1,2 18,2H12V9L9.5,7.5L7,9V2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18Z" />
							</svg>
							Библиотека</a>
						<a class="mdl-navigation__link" href="../applications/index.html">
							<svg style="width:24px;height:24px" viewbox="0 0 24 24">
								<path fill="#757575"
									d="M3,3H11V7.34L16.66,1.69L22.31,7.34L16.66,13H21V21H13V13H16.66L11,7.34V11H3V3M3,13H11V21H3V13Z" />
							</svg>
							Приложения</a>
						<a class="mdl-navigation__link" href="../dictionary/index.html">
							<svg style="width:24px;height:24px" viewbox="0 0 24 24">
								<path fill="#757575"
									d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07M18.5,10H16.5L12,22H14L15.12,19H19.87L21,22H23L18.5,10M15.88,17L17.5,12.67L19.12,17H15.88Z" />
							</svg>
							Словарь</a>
						<a class="mdl-navigation__link" href="../genetic-tasks/index.html">
							<svg style="width:24px;height:24px" viewbox="0 0 24 24">
								<path fill="#757575"
									d="M3,4H7V8H3V4M9,5V7H21V5H9M3,10H7V14H3V10M9,11V13H21V11H9M3,16H7V20H3V16M9,17V19H21V17H9" />
							</svg>
							Сборник задач по генетике</a>
					</nav>
				</div>

				<main class="mdl-layout__content">
					<div class="page-content">
						<div class="mdl-grid" id="search-container">
							{itemsString}
						</div>
					</div>
				</main>
			</div>
		</body>
		<script src="../scripts/lib/main_search.min.js"></script>
		</html>
		"""

output_file = sys.argv[1]

itemsString = makeItems(LIBRARY_SRC)

with open(output_file, "w+", encoding="utf-8") as file:
	file.write(buildPage(itemsString))