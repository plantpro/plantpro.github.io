import csv
from pathlib import Path

CATALOG_NAME = "library\\generator\\catalog.csv"
OUTPUT_PATH = "library\\index.html"

STYLES = """
	#record-count {
		color: #999999;
    font-size: smaller;
	}

	.plpro-lib-record-name {
		margin-bottom: 0px;
	}

	.plpro-lib-record-year, .plpro-lib-record-autor {
		color: #999999;
    font-size: smaller;
	}

	.plpro-lib-record-autor {
		text-decoration: underline;
    cursor: pointer;
	}

	.mdl-chip {
		color: #fff;
		background-color: rgb(0, 129, 32);
	}

	.mdl-chip__text {
		font-size: small;
    vertical-align: middle;
    display: inline-block;
	}

	.mdl-chip__action {
		opacity: 1;
	}
"""

CLOSE_BUTTON = """<svg style='width:18px;height:18px' viewBox='0 0 24 24'><path fill='#ffffff' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' /></svg>"""

def getRecords():
	with open(CATALOG_NAME, encoding="utf-8") as file:
		reader = csv.DictReader(file, delimiter=',')
		records = [record for record in reader]
	return records

def getFileTypeColor(filetype):
	if filetype == "pdf":
		return "rgb(231, 47, 47)"
	if filetype == "djvu":
		return "rgb(160, 0, 160)"
	if filetype == "online":
		return "rgb(112, 112, 112)"

def htmlize(record):
	fileTypeColor = getFileTypeColor(record["Тип файла"])
	result = f"""
		<div class="plpro-lib-record">
			<h6 class="plpro-lib-record-name">
				<a href="{record["Ссылка"]}">{record["Название на языке оригинала"]}</a>
				<span class="filetype-tag" style="background-color: {fileTypeColor};">{record["Тип файла"]}</span>
			</h6>
			<span class="plpro-lib-record-year">{record["Год издания"]}</span>
	"""

	for autor in record["Авторы"].split(", "):
		result += f"<span class='plpro-lib-record-autor' onclick='onAutorClick(this);'>{autor}</span> "

	return result + "</div>"

def writeToFile(content, recordsCount):
	output_file = Path(OUTPUT_PATH)

	result = f"""
<!doctype html>
<html lang="ru">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<title>Библиотека</title>

	<link rel="stylesheet" href="../stylesheets/material.min.css">
	<script src="../scripts/material.min.js"></script>

	<style>
		{STYLES}
	</style>

	<script>
		function updateFiltre(text) {{
			var filters = document.getElementById("filters");
			filters.innerHTML = "<span class='mdl-chip mdl-chip--deletable'><span class='mdl-chip__text'>" + text + "</span>" +
    	"<button type='button' class='mdl-chip__action' onclick='clearFiltres()'>{CLOSE_BUTTON}</button></span>"
		}}

		function clearFiltres() {{
			var filtres = document.getElementById("filters");
			filtres.innerText = "";

			for(var i of document.getElementById("search-box").children) {{
				if (i.className == "plpro-lib-record") {{
					i.style.display = "block";
				}}
			}}
		}}

		function searchAutor(text) {{
			for(var i of document.getElementById("search-box").children) {{
				if (i.className == "plpro-lib-record") {{
					i.style.display = "none";
					for(var j of i.children) {{
						if (j.className == "plpro-lib-record-autor" && j.innerText == text) {{
							i.style.display = "block";
						}}
					}}
				}}
			}}
		}}

		function onAutorClick(self) {{
			searchAutor(self.innerText);
			updateFiltre("Автор: " + self.innerText);
		}}
	</script>
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
				<div style="text-align: center;">
					<h3 style="margin-bottom: 0px;">Библиотека</h3>
					<span id="record-count">Записей в библиотеке: {recordsCount}</span>
				</div>

				<div id="filters"></div>

				{content}
			</div>
		</main>
	</div>
	</body>

	</html>
	"""
	output_file.write_text(result, encoding="utf-8")

def main():
	records = getRecords()
	content = "".join(htmlize(record) for record in records)
	writeToFile(content, len(records))

main()