import csv
from pathlib import Path

CATALOG_NAME = "library\\generator\\catalog.csv"
OUTPUT_PATH = Path("library\\index.html")

FILE_TYPE_COLORS = {
	"pdf": "rgb(231, 47, 47)",
	"djvu": "rgb(160, 0, 160)",
	"online": "rgb(112, 112, 112)"
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
			<span class="filetype-tag" style="background-color: {FILE_TYPE_COLORS[record["Тип файла"]]};" onclick="document.filterByType(this);">
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

	<title>Статьи на тему защита растений</title>

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

 <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
	<link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css">
	<script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
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

	<div class="container-fluid">
		<div class="row">
			<div class="col-md-4">
				<div class="title">
					<h1>библиотека</h1>
				</div>
				<div class="panel">
					<div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
						<label class="mdl-button mdl-js-button mdl-button--icon" for="sample6">
							<i class="material-icons">search</i>
						</label>
						<div class="mdl-textfield__expandable-holder">
							<input class="mdl-textfield__input" type="text" id="sample6">
							<label class="mdl-textfield__label" for="sample-expandable">Expandable Input</label>
						</div>
					</div>

					<div class="filtration-block">

						<span class="filetype-tag" style="background-color: {FILE_TYPE_COLORS["pdf"]};" onclick="document.filterByTypeName('pdf');">.pdf</span>
						<span class="filetype-tag" style="background-color: {FILE_TYPE_COLORS["djvu"]};" onclick="document.filterByTypeName('djvu');">.djvu</span>
						<span class="filetype-tag" style="background-color: {FILE_TYPE_COLORS["online"]};" onclick="document.filterByTypeName('online');">online</span>

						<div class="custom-control custom-switch">
							<input type="checkbox" class="custom-control-input" id="switch-1"  style="margin-bottom: 15px;">
							<label class="custom-control-label" for="switch-1">Только статьи</label>
						</div>
					</div>
					</div>

					<div id="filter"></div>
			</div>
			<div class="col-md-8" id="search-box">
				{content}
			</div>
		</div>
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
		<script src="../scripts/lib/lib-index.min.js"></script>
				</body>
			</html>
	"""
	OUTPUT_PATH.write_text(result, encoding="utf-8")

def main():
	records = get_records()
	content = "".join(map(record_to_html, records))
	write_to_file(content, len(records))

main()