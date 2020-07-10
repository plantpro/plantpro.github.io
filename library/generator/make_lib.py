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

	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
		integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
	<link rel="stylesheet" href="../stylesheets/style.css">
	<link rel="stylesheet" href="../stylesheets/library.css">
</head>

<body>
	<nav class="navbar navbar-expand-lg navbar-grey d-flex d-md-none">
		<a class="navbar-brand">
			<img src="../resources/images/logo-black.svg" />
		</a>

		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#inline-navbar"
			aria-controls="inline-navbar" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon navbar-toggler-dark-icon"></span>
		</button>

		<div class="collapse navbar-collapse" id="inline-navbar">
			<ul class="navbar-nav ml-auto">
				<li class="nav-item mr-lg-5">
					<a class="nav-link nav-link-grey" href="../index.html">Главная</a>
				</li>
				<li class="nav-item mr-lg-5">
					<a class="nav-link nav-link-grey" href="../articles/index.html">Статьи</a>
				</li>
				<li class="nav-item mr-lg-5">
					<a class="nav-link nav-link-grey" href="../applets/index.html">Апплеты</a>
				</li>
				<li class="nav-item mr-lg-5">
					<a class="nav-link nav-link-grey" href="../media/index.html">Медиа</a>
				</li>
				<li class="nav-item mr-lg-5">
					<a class="nav-link nav-link-grey" href="../dictionary/index.html">Словарь</a>
				</li>
			</ul>
		</div>
	</nav>

	<div class="division-header">
		<div class="row">
			<div class="col-md-4 col-lg-2 text-center">
				<img class="division-header-img" src="../resources/images/library-cover.jpg" />
			</div>

			<div class="col-md-8 col-lg-10 text-center text-sm-left">
				<nav class="navbar navbar-expand-lg navbar-grey d-none d-md-flex">
					<a class="navbar-brand">
					</a>

					<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"
						aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon navbar-toggler-dark-icon"></span>
					</button>

					<div class="collapse navbar-collapse" id="navbarText">
						<ul class="navbar-nav ml-auto">
							<li class="nav-item mr-lg-5">
								<a class="nav-link nav-link-grey" href="../index.html">Главная</a>
							</li>
							<li class="nav-item mr-lg-5">
								<a class="nav-link nav-link-grey" href="../articles/index.html">Статьи</a>
							</li>
							<li class="nav-item mr-lg-5">
								<a class="nav-link nav-link-grey" href="../applets/index.html">Апплеты</a>
							</li>
							<li class="nav-item mr-lg-5">
								<a class="nav-link nav-link-grey" href="../media/index.html">Медиа</a>
							</li>
							<li class="nav-item mr-lg-5">
								<a class="nav-link nav-link-grey" href="../dictionary/index.html">Словарь</a>
							</li>
						</ul>
					</div>
				</nav>
				
				<h1 class="division-header-title">Книги</h1>
				<span class="division-header-description" id="record-count">Записей в библиотеке: {recordsCount}</span>
			</div>
		</div>
	</div>

	<div class="filtration-block">
		<span class="filetype-tag" style="background-color: {FILE_TYPE_COLORS["pdf"]};" onclick="document.filterByType(this);">.pdf</span>
		<span class="filetype-tag" style="background-color: {FILE_TYPE_COLORS["djvu"]};" onclick="document.filterByType(this);">.djvu</span>
		<span class="filetype-tag" style="background-color: {FILE_TYPE_COLORS["online"]};" onclick="document.filterByType(this);">online</span>

		<div class="custom-control custom-switch">
			<input type="checkbox" class="custom-control-input" id="switch-1"  style="margin-bottom: 15px;">
			<label class="custom-control-label" for="switch-1">Только статьи</label>
		</div>

		<div id="filter"></div>
	</div>

	<div class="container-fluid mt-3" id="search-box">
		{content}
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