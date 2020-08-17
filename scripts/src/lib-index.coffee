availableFileTypes = {
	PDF: {
		name: ".pdf",
		color: "rgba(231, 47, 47, .2)"
	},

	DJVU: {
		name: ".djvu",
		color: "rgba(160, 0, 160, .2)"
	},

	ONLINE: {
		name: "online",
		color: "rgba(112, 112, 112, .2)"
	},

	UNKNOWN: null
}

parseFileType = (string) ->
	switch string.trim()
		when "pdf" then availableFileTypes.PDF
		when "djvu" then availableFileTypes.DJVU
		when "online" then availableFileTypes.ONLINE
		else availableFileTypes.UNKNOWN

predicates = {
	requiredLanguages: [],
	requiredFileTypes: [],
	requiredAutors: [],
	searchText: "",
	cachedRegex: null
}

isSatisfiedToLanguageFilter = (record) ->
	return true if predicates.requiredLanguages.length == 0
	predicates.requiredLanguages.some((requiredLanguage) ->
		record.dataset.language == requiredLanguage
	)

isSatisfiedToFileTypeFilter = (record) ->
	return true if predicates.requiredFileTypes.length == 0
	predicates.requiredFileTypes.some((requiredFileType) ->
		fileTypeTag = parseFileType (record.getElementsByClassName "filetype-tag")[0].innerText
		return fileTypeTag.name == requiredFileType.name
	)

isSatisfiedToAutorFilter = (record) ->
	return true if predicates.requiredAutors.length is 0

	autorsNames =
		[record.getElementsByClassName("record-autor")...]
		.map (autor) -> autor.innerText

	for requiredAutorName in predicates.requiredAutors
		return false if requiredAutorName not in autorsNames
	return true

isSatisfiedToSearch = (record) ->
	return true if predicates.cachedRegex == null
	title = record.querySelector ".record-title:first-child>a"
	predicates.cachedRegex.test(title.innerText)

isSatisfiedToAllFilters = (record) ->
	isSatisfiedToLanguageFilter(record) and
	isSatisfiedToFileTypeFilter(record) and
	isSatisfiedToAutorFilter(record) and
	isSatisfiedToSearch(record)

makeFilterPanel = (text, deleteAction) -> "
		<div class='panel'>
			<span class='mdl-chip__text'>#{text}</span>
			<button type='button' class='close-panel-btn' onclick='#{deleteAction}'>
				<svg style='width:18px;height:18px' viewBox='0 0 24 24'>
					<path fill='#ffffff' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' />
				</svg>
			</button>
		</div>
	"

makeFilterPanelWithColor = (text, color, deleteAction) -> "
		<div class='panel' style='background-color: #{color};'>
			<span class='mdl-chip__text'>#{text}</span>
			<button type='button' class='close-panel-btn' onclick='#{deleteAction}'>
				<svg style='width:18px;height:18px' viewBox='0 0 24 24'>
					<path fill='#ffffff' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' />
				</svg>
			</button>
		</div>
	"

stateChanged = (event) ->
	predicates.articleFilterIsEnabled = event.target.checked
	updateResults()

showRecordIfSatisfiedToAllFilters = (record) ->
	if isSatisfiedToAllFilters record
		record.style.display = "block"
		$(record).animate({ opacity: 1 }, 300)

checkRecordForFilters = (record) ->
	$(record).animate({ opacity: 0 }, 300, () ->
		record.style.display = "none"
		showRecordIfSatisfiedToAllFilters record
	)

updateResults = () ->
	searchBox = document.getElementById "search-box"
	for i in searchBox.children when i.className == "record"
		do (i) -> checkRecordForFilters i
	return null

autorOnClick = (event) ->
	return false if not event.target.classList.contains "record-autor"

	autorName = event.target.innerText
	predicates.requiredAutors.push(autorName)

	filterDiv = document.getElementById "filter"
	filterDiv.innerHTML += " " +
		makeFilterPanel "Автор: #{autorName}", "document.deleteAutorFilter(this, \"#{autorName}\")"
	
	updateResults()

document.deleteAutorFilter = (self, autorName) ->
	$(self.parentNode).animate({ opacity: 0 }, 300, () ->  self.parentNode.remove())
	predicates.requiredAutors.splice (predicates.requiredAutors.indexOf autorName), 1
	updateResults()

document.deleteFileTypeFilter = (self, fileTypeName) ->
	$(self.parentNode).animate({ opacity: 0 }, 300, () ->  self.parentNode.remove())
	index = predicates.requiredFileTypes.findIndex (i) -> i.name == fileTypeName
	predicates.requiredFileTypes.splice index, 1
	updateResults()

document.filterByType = (self) ->
	requiredFileType = parseFileType self.innerText
	predicates.requiredFileTypes.push(requiredFileType)

	filterDiv = document.getElementById "filter"
	filterDiv.innerHTML += " " +
		makeFilterPanelWithColor("Тип: #{requiredFileType.name}",
			requiredFileType.color,
			"document.deleteFileTypeFilter(this, \"#{requiredFileType.name}\")")

	updateResults()

document.filterByTypeName = (self) ->
	requiredFileType = parseFileType self
	predicates.requiredFileTypes.push requiredFileType
	
	filterDiv = document.getElementById "filter"
	filterDiv.innerHTML += " " +
		makeFilterPanelWithColor("Тип: #{requiredFileType.name}",
			requiredFileType.color,
			"document.deleteFileTypeFilter(this, \"#{requiredFileType.name}\")")

	updateResults()

document.filterByLanguage = (language) ->
	predicates.requiredLanguages.push language
	
	filterDiv = document.getElementById "filter"
	filterDiv.innerHTML += " " +
		makeFilterPanel("Язык: #{language}", "document.deleteLanguageFilter(this, \"#{language}\")")

	updateResults()

document.deleteLanguageFilter = (self, language) ->
	$(self.parentNode).animate({ opacity: 0 }, 300, () ->  self.parentNode.remove())
	index = predicates.requiredLanguages.indexOf language
	predicates.requiredLanguages.splice index, 1
	updateResults()

createRegExpFromSearchText = (string) ->
	return new RegExp(string, 'i') if string != ""
	return null

updateSearchText = (event) ->
	searchInput = document.getElementById "search-input"
	# If clicked a search button several times, but input stay the same
	return if predicates.searchText == searchInput.value
	predicates.searchText = searchInput.value
	predicates.cachedRegex = createRegExpFromSearchText predicates.searchText
	
	updateResults()

searchInputClear = (event) ->
	searchInput = document.getElementById "search-input"
	searchInput.value = ""

	updateSearchText()

document.getElementById "search-box"
.addEventListener "click", autorOnClick

document.getElementById "search-input"
.addEventListener "change", updateSearchText

document.getElementById "search-button"
.addEventListener "click", updateSearchText

document.getElementById "search-clear"
.addEventListener "click", searchInputClear