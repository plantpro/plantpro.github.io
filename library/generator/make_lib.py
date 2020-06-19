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
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Защита растений</title>

    <link rel="stylesheet" href="../stylesheets/light.min.css" />
		 <link rel="stylesheet" href="../stylesheets/library.css" />
		<script src="../scripts/lib/lib-index.min.js"></script>
  </head>

  <body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <svg
        style="width: 24px; height: 24px; margin-right: 5px;"
        viewbox="0 0 24 24"
      >
        <path
          class="svg-primary"
          d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"
        />
      </svg>
      <a class="navbar-brand">
        PLANT PROTECTION
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link" href="../index.html"
              >Домашняя</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Статьи</a>
          </li>
          <li class="nav-item active">
            <a class="nav-link" href="#">Библиотека</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="../dictionary/index.html">Словарь</a>
          </li>
        </ul>

        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="#">О сайте</a>
          </li>

          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span class="flag-icon flag-icon-ru"></span>
            </a>
            <div
              class="dropdown-menu dropdown-menu-right"
              aria-labelledby="navbarDropdown"
            >
              <a class="dropdown-item" href="en/index.html"
                ><span class="flag-icon flag-icon-gb"></span> English</a
              >
              <a class="dropdown-item" href="de/index.htm"
                ><span class="flag-icon flag-icon-de"></span> Deutsch</a
              >
            </div>
          </li>
        </ul>
      </div>
    </nav>

    <div class="container-fluid" id="search-box">
							<div style="text-align: center; margin: 15px 0px;">
								<h3 style="margin-bottom: 0px;">Библиотека</h3>
								<span id="record-count">Записей в библиотеке: {recordsCount}</span>
							</div>

							<div class="custom-control custom-switch">
								<input type="checkbox" class="custom-control-input" id="switch-1"  style="margin-bottom: 15px;" onclick="document.stateChanged(this);">
								<label class="custom-control-label" for="switch-1">Только статьи</label>
							</div>
							
							<div id="filter"></div>

							{content}
				</div>
				</body>
			</html>
	"""
	OUTPUT_PATH.write_text(result, encoding="utf-8")

def main():
	records = get_records()
	content = "".join(map(record_to_html, records))
	write_to_file(content, len(records))

main()