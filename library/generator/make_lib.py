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
			<span class="filetype-tag" style="background-color: {FILE_TYPE_COLORS[record["Тип файла"]]};">
				{record["Тип файла"]}
			</span>
		</h6>
		<span class="plpro-lib-record-year">{record["Год издания"]}</span>
		{" ".join(map(autor_format, record["Авторы"].split(", ")))}
		<span class="plpro-lib-record-size">{record["Размер"]}</span>
		{"<span class='plpro-lib-record-article'>статья</span>" if record["Тип"] == "article" else ""}
	</div>
	"""

def writeToFile(content, recordsCount):
	result = f"""
		<!doctype html>
		<html lang="ru">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<title>Библиотека</title>

				<link rel="stylesheet" href="../stylesheets/material.min.css">
				<script src="../scripts/material.min.js"></script>

				<link rel="stylesheet" href="../stylesheets/library.css">
				<script src="../scripts/lib/lib-index.min.js"></script>
			</head>

			<body>
				<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
					<header class="mdl-layout__header">
						<div class="mdl-layout__header-row">
							<div class="mdl-layout__drawer-button">
								<i class="material-icons">
									<svg style="width:24px;height:24px" viewbox="0 0 24 24">
										<path fill="rgb(0, 129, 32)"
											d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
									</svg>
								</i>
							</div>

							<span class="mdl-layout-title">
								<span style="color: rgb(0, 129, 32);">P</span>LANT
								<span style="color: rgb(0, 129, 32);">P</span>ROTECTION
							</span>

							<div class="mdl-layout-spacer"></div>
							<nav class="mdl-navigation mdl-layout--large-screen-only">
							</nav>
						</div>
					</header>

					<main class="mdl-layout__content">
						<div class="page-content paddinget" id="search-box">
							<div style="text-align: center; margin-bottom: 15px;">
								<h3 style="margin-bottom: 0px;">Библиотека</h3>
								<span id="record-count">Записей в библиотеке: {recordsCount}</span>
							</div>

							<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-1" onchange="stateChanged(this);">
								<input type="checkbox" id="switch-1" class="mdl-switch__input">
								<span class="mdl-switch__label">Только статьи</span>
							</label>

							<div id="filter"></div>

							{content}
						</div>
					</main>
				</div>
				</body>
			</html>
	"""
	OUTPUT_PATH.write_text(result, encoding="utf-8")

def main():
	records = get_records()
	content = "".join(map(record_to_html, records))
	writeToFile(content, len(records))

main()