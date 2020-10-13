# py library/generator/make_lib.py  

import csv
import pathlib

CATALOG_PATH = r"library\generator\catalog.csv"
OUTPUT_PATH = pathlib.Path(r"library\index.html")

def get_records():
	"""
		Return list of CSV records from file 'catalog.csv'
	"""
	with open(CATALOG_PATH, encoding="utf-8") as file:
		reader = csv.DictReader(file, delimiter=',')
		records = [record for record in reader]
	return records

def normalize_file_type_name(fileTypeName):
	"""
		Add a dot char before file type name if type is not online
	"""
	if fileTypeName != "online":
		return "." + fileTypeName
	return fileTypeName

def autor_format(autor):
	"""
		Return string represent HTML code of autor
	"""
	return f"""<span class="record-autor">{autor}</span>"""

def language_code_to_string(languageCode):
	return 'Русский' if languageCode == 'ru' else 'Английский'

def record_to_html(record):
	"""
		Return string that represent a HTML code of record
	"""
	return f"""
	<div class="record" data-language="{language_code_to_string(record["Язык оригинала"])}">
		<div class="record-title">
			<a href="{record["Ссылка"]}">{record["Название на языке оригинала"]}</a>
			<span class="file-type-tag file-type-tag-{record["Тип файла"]} float-right">
				{normalize_file_type_name(record["Тип файла"])}
			</span>
		</div>

		<span class="record-year">{record["Год издания"]}</span>
		{" ".join(map(autor_format, record["Авторы"].split(", ")))}
		<span class="record-size">{record["Размер"]}</span>
		{"<span class='record-article-mark'>статья</span>" if record["Тип"] == "article" else ""}
	</div>
	"""

def write_to_file(content, recordsCount):
	result = f"""
<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<title>Библиотека \ Книги по агрономии и защите растений</title>

	<link rel="apple-touch-icon" sizes="57x57" href="../resources/images/icons/apple-icon-57x57.png">
	<link rel="apple-touch-icon" sizes="60x60" href="../resources/images/icons/apple-icon-60x60.png">
	<link rel="apple-touch-icon" sizes="72x72" href="../resources/images/icons/apple-icon-72x72.png">
	<link rel="apple-touch-icon" sizes="76x76" href="../resources/images/icons/apple-icon-76x76.png">
	<link rel="apple-touch-icon" sizes="114x114" href="../resources/images/icons/apple-icon-114x114.png">
	<link rel="apple-touch-icon" sizes="120x120" href="../resources/images/icons/apple-icon-120x120.png">
	<link rel="apple-touch-icon" sizes="144x144" href="../resources/images/icons/apple-icon-144x144.png">
	<link rel="apple-touch-icon" sizes="152x152" href="../resources/images/icons/apple-icon-152x152.png">
	<link rel="apple-touch-icon" sizes="180x180" href="../resources/images/icons/apple-icon-180x180.png">
	<link rel="icon" type="image/png" sizes="192x192"  href="../resources/images/icons/android-icon-192x192.png">
	<link rel="icon" type="image/png" sizes="32x32" href="../resources/images/icons/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="96x96" href="../resources/images/icons/favicon-96x96.png">
	<link rel="icon" type="image/png" sizes="16x16" href="../resources/images/icons/favicon-16x16.png">
	<link rel="icon" type="image/ico" href="./favicon.ico" />
	<meta name="msapplication-TileColor" content="#ffffff">
	<meta name="msapplication-TileImage" content="../resources/images/icons/ms-icon-144x144.png">
	<meta name="theme-color" content="#ffffff">

	<link
		href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap"
		rel="stylesheet">
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
		integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
	<link rel="stylesheet" href="../stylesheets/common.css">
	<link rel="stylesheet" href="../stylesheets/library.css">
</head>

<body>
	<nav>
		<button class="darker" id="toggle-search">
			<img src="../resources/images/search.svg">
		</button>

		<div class="nav-group">
			<a href="../index.html">
				<img src="../resources/images/home.svg">
			</a>
		</div>
	</nav>

	<main>
		<div class="row">
			<div class="col-md-4" id="main-panel">
				<span class="nav-panel-title">Поиск</span>

				<div id="search-area">
					<div>
						<input type="text" placeholder="Что ищем?" id="search-input">

						<button type="button" id="search-clear">
							<svg style="width:18px;height:18px;fill:rgba(255, 255, 255, .3);" viewBox="0 0 24 24">
								<path d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' />
							</svg>
						</button>
					</div>
					<button id="search-button">Поиск</button>
				</div>

				<div class="main-panel-group">
					Тип файла:
					<span class="file-type-tag file-type-tag-pdf">.pdf</span>
					<span class="file-type-tag file-type-tag-djvu">.djvu</span>
					<span class="file-type-tag file-type-tag-online">online</span>
				</div>

				<div class="main-panel-group">
					Язык:
					<span class="language-tag" onclick="document.filterByLanguage('Русский');">Русский</span>
					<span class="language-tag" onclick="document.filterByLanguage('Английский');">Английский</span>
				</div>

				<div id="filter-area"></div>
			</div>

			<div class="col-md-8" id="search-box">
				<h1>Библиотека</h1>

				<div id="nothing-is-found">
					Ничего не найдено.
					<button type="button" id="nothing-is-found-clear">Сбросить фильтры</button>
				</div>

				{content}
			</div>
		</div>
	</main>
				
	<script src="https://code.jquery.com/jquery-3.5.1.min.js"
		integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
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
	<script src="../scripts/lib/lib-index.js"></script>
</body>
</html>
	"""
	OUTPUT_PATH.write_text(result, encoding="utf-8")

def main():
	records = get_records()
	content = "".join(map(record_to_html, records))
	write_to_file(content, len(records))

if __name__ == '__main__':
	main()