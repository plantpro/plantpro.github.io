#: import flexibel.coffee

predicates = []

isAll = (record) ->
	for predicate in predicates
		if not predicate record
			return false
	return true

filterDiv = element "filter"

makeChip = (text, num) -> "
		<span class='mdl-chip mdl-chip--deletable'>
			<span class='mdl-chip__text'>#{text}</span>
			<button type='button' class='mdl-chip__action' onclick='document.clearFilter(this, #{num})'>
				<svg style='width:18px;height:18px' viewBox='0 0 24 24'>
					<path fill='#ffffff' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' />
				</svg>
			</button>
		</span>
	"

makeChipWithColor = (text, color) -> "
		<span class='mdl-chip mdl-chip--deletable' style='background-color: #{color}'>
			<span class='mdl-chip__text'>#{text}</span>
			<button type='button' class='mdl-chip__action' onclick='document.clearFilter()'>
				<svg style='width:18px;height:18px' viewBox='0 0 24 24'>
					<path fill='#ffffff' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' />
				</svg>
			</button>
		</span>
	"

updateFilter = (text) ->
	htmlset "filter", makeChip text

clearFilter = (self, num) ->
	htmlset "filter", filterDiv.replace(self.innerHTML)

	predicates.splice(num, 1)
	doit()

	#searchBox = element "search-box"

	#	for i in searchBox.children
	#	i.style.display = "block" if i.className == "plpro-lib-record"

searchAutor = (text) ->
	searchBox = element "search-box"
	for i in searchBox.children
		if i.className == "plpro-lib-record"
			i.style.display = "none"
			for j in i.children
				if j.className == "plpro-lib-record-autor" and j.innerText == text
					i.style.display = "block"

document.stateChanged = (self) ->
	searchBox = element "search-box"
	if self.control.checked
		for i in searchBox.children
			if i.className == "plpro-lib-record"
				span = i.getElementsByClassName "plpro-lib-record-article"
				if span.length == 0
					i.style.display = "none"
	else
		for i in searchBox.children
			if i.className == "plpro-lib-record"
				i.style.display = "block"

doit = () ->
	searchBox = element "search-box"
	for i in searchBox.children
		if i.className == "plpro-lib-record"
			i.style.display = "none"
			if isAll i
				i.style.display = "block"

document.autorOnClick = (self) ->
	text = self.innerText
	predicates.push(
		(record) ->
			for j in record.children
				return true if j.className == "plpro-lib-record-autor" and j.innerText == text
			return false
	)

	doit()
	#searchAutor self.innerText

	filterDiv.innerText = filterDiv.innerHTML +
		makeChip("Автор: #{self.innerText}", predicates.length - 1)

document.filterByType = (self) ->
	searchBox = element "search-box"
	for i in searchBox.children
		if i.className == "plpro-lib-record"
			i.style.display = "none"
			k = (i.getElementsByClassName "filetype-tag")[0]
			if k.innerText.trim() == self.innerText.trim()
				i.style.display = "block"

	if self.innerText == "pdf"
		htmlset "filter", (makeChipWithColor "Тип: .pdf", "rgb(231, 47, 47)")
	if self.innerText == "djvu"
		htmlset "filter", (makeChipWithColor "Тип: .djvu", "rgb(160, 0, 160)")
	if self.innerText == "online"
		htmlset "filter", (makeChipWithColor "Тип: online", "rgb(112, 112, 112)")

document.clearFilter = clearFilter
