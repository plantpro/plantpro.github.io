import csv
from pathlib import Path

CATALOG_NAME = "library\\generator\\catalog.csv"
OUTPUT_PATH = Path("library\\index.html")

FILE_TYPE_COLORS = {
	"pdf": "rgba(231, 47, 47,.5)",
	"djvu": "rgba(160, 0, 160,.5)",
	"online": "rgba(112, 112, 112,.5)"
}

def get_records():
	with open(CATALOG_NAME, encoding="utf-8") as file:
		reader = csv.DictReader(file, delimiter=',')
		records = [record for record in reader]
	return records

def autor_format(autor):
	return f"""<span class="plpro-lib-record-autor" onclick="document.autorOnClick(this);">{autor}</span>"""

def record_to_html(record):
	return f"""
	<div class="plpro-lib-record">
		<h6 class="plpro-lib-record-title">
			<a href="{record["Ссылка"]}">{record["Название на языке оригинала"]}</a>
			<span class="filetype-tag float-right" style="background-color: {FILE_TYPE_COLORS[record["Тип файла"]]};" onclick="document.filterByType(this);">
				{record["Тип файла"]}
			</span>
		</h6>
		<span class="plpro-lib-record-year">{record["Год издания"]}</span>
		{" ".join(map(autor_format, record["Авторы"].split(", ")))}
		<span class="plpro-lib-record-size">{record["Размер"]}</span>
		{"<span class='plpro-lib-record-article'>статья</span>" if record["Тип"] == "article" else ""}
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
	<div id="background"></div>

	<a class="home-button" href="../index.html">
		<svg viewBox="0 0 254.182 254.182" style="enable-background:new 0 0 254.182 254.182;">
			<g>
				<path d="M211.655,137.102c-4.143,0-7.5,3.358-7.5,7.5v77.064h-41.373v-77.064c0-4.142-3.357-7.5-7.5-7.5H98.903
					c-4.143,0-7.5,3.358-7.5,7.5v77.064H50.026v-77.064c0-4.142-3.357-7.5-7.5-7.5c-4.143,0-7.5,3.358-7.5,7.5v84.564
					c0,4.142,3.357,7.5,7.5,7.5h56.377h56.379h56.373c4.143,0,7.5-3.358,7.5-7.5v-84.564
					C219.155,140.46,215.797,137.102,211.655,137.102z M106.403,221.666v-69.564h41.379v69.564H106.403z"/>
				<path d="M251.985,139.298L132.389,19.712c-2.928-2.929-7.677-2.928-10.607,0L2.197,139.298c-2.929,2.929-2.929,7.678,0,10.606
					c2.93,2.929,7.678,2.929,10.607,0L127.086,35.622l114.293,114.283c1.464,1.464,3.384,2.196,5.303,2.196
					c1.919,0,3.839-0.732,5.304-2.197C254.914,146.976,254.914,142.227,251.985,139.298z"/>
			</g>
		</svg>
	</a>

	<div class="container-fluid">
		<div class="row">
			<div class="col-md-4">
				<header>
					<h1>Библиотека</h1>
				</header>

				<div class="panel" id="main-panel">
					<div id="search-area">
						<input type="text" placeholder="Что ищем?" id="search-input">

						<button type="button" id="search-clear" onclick="clearInput()">
							<svg style="width:18px;height:18px;fill:rgba(255, 255, 255, .3);" viewBox="0 0 24 24">
								<path d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' />
							</svg>
						</button>

						<button id="search-button">Поиск</button>
					</div>

					<div id="filetype-form">
						Тип файла:
						<span class="filetype-tag" style="background-color: {FILE_TYPE_COLORS["pdf"]};" onclick="document.filterByTypeName('pdf');">.pdf</span>
						<span class="filetype-tag" style="background-color: {FILE_TYPE_COLORS["djvu"]};" onclick="document.filterByTypeName('djvu');">.djvu</span>
						<span class="filetype-tag" style="background-color: {FILE_TYPE_COLORS["online"]};" onclick="document.filterByTypeName('online');">online</span>
					</div>

					<div class="help-icon">
						<img src="../resources/images/about.svg" alt="">
					</div>
				</div>

				<div id="filter"></div>
			</div>

			<div class="col-md-8" id="search-box">
				{content}
			</div>
		</div>
	</div>
				
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

main()