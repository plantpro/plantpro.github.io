filters = {
	requiredLanguages: [],
	requiredFileTypes: [],
	requiredAutors: [],
	searchText: "",
	cachedRegex: null,

	atLeastOneIsFound: true,
	disableUpdate: false
}

isSatisfiedToLanguageFilter = (record) ->
	return yes if filters.requiredLanguages.length is 0

	language = record.dataset.language
	filters.requiredLanguages.some((requiredLanguage) -> language is requiredLanguage)

isSatisfiedToFileTypeFilter = (record) ->
	return yes if filters.requiredFileTypes.length is 0

	fileType = record.querySelector(".file-type-tag").innerText.trim()
	filters.requiredFileTypes.some((requiredFileType) -> fileType is requiredFileType)

isSatisfiedToAutorFilter = (record) ->
	return yes if filters.requiredAutors.length is 0

	autorsNames =
		[record.getElementsByClassName("record-autor")...]
		.map (autor) -> autor.innerText

	for requiredAutorName in filters.requiredAutors
		return no if requiredAutorName not in autorsNames
	return yes

isSatisfiedToSearch = (record) ->
	return yes if filters.cachedRegex is null

	recordTitle = record.querySelector ".record-title:first-child>a"
	return filters.cachedRegex.test(recordTitle.innerText)

isSatisfiedToAllFilters = (record) ->
	isSatisfiedToLanguageFilter(record) and
	isSatisfiedToFileTypeFilter(record) and
	isSatisfiedToAutorFilter(record) and
	isSatisfiedToSearch(record)

makeFilterPanelWithClass = (text, deleteAction, className) ->
	panel = document.createElement("div")
	panel.className = "panel filter-panel " + className
	panel.style.display = "none"
	panel.innerHTML = "
		<span>#{text}</span>

		<button type='button' class='close-panel-btn' onclick='#{deleteAction}'>
			<svg viewBox='0 0 24 24'>
				<path d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' />
			</svg>
		</button>
	"
	return panel

makeFilterPanel = (text, deleteAction) ->
	makeFilterPanelWithClass(text, deleteAction, "")

addFilterPanel = (panel) ->
	document.getElementById("filter-area").appendChild(panel)
	$(panel).fadeIn()

applyFilters = () ->
	records = document
		.getElementById "search-box"
		.getElementsByClassName "record"
	for record in records
		if isSatisfiedToAllFilters(record)
			record.style.display = "block"
			filters.atLeastOneIsFound = yes
		else
			record.style.display = "none"
	if not filters.atLeastOneIsFound
		document.getElementById("nothing-is-found").style.display = "flex"
	else
		document.getElementById("nothing-is-found").style.display = "none"

updateResults = () ->
	return if filters.disableUpdate
	filters.atLeastOneIsFound = no
	$("#search-box").fadeOut()
	setTimeout(applyFilters, 300)
	$("#search-box").fadeIn()
	return null

autorOnClick = (event) ->
	return if not event.target.classList.contains "record-autor"

	autorName = event.target.innerText
	return if autorName in filters.requiredAutors

	filters.requiredAutors.push(autorName)

	filterPanel = makeFilterPanel(
		"Автор: #{autorName}",
		"document.deleteAutorFilter(this, \"#{autorName}\")")
	addFilterPanel filterPanel
	
	updateResults()

completeFilterDeletion = (self) ->
	$(self.parentNode).fadeOut -> self.parentNode.remove()
	updateResults()

document.deleteAutorFilter = (self, autorName) ->
	index = filters.requiredAutors.indexOf autorName
	filters.requiredAutors.splice index, 1
	completeFilterDeletion self

document.deleteFileTypeFilter = (self, fileTypeName) ->
	index = filters.requiredFileTypes.indexOf fileTypeName
	filters.requiredFileTypes.splice index, 1
	completeFilterDeletion self

filetypeOnClick = (event) ->
	return if not event.target.classList.contains("file-type-tag")

	requiredFileType = event.target.innerText
	filters.requiredFileTypes.push requiredFileType

	filterPanel = makeFilterPanelWithClass(
		"Тип: #{requiredFileType}",
		"document.deleteFileTypeFilter(this, \"#{requiredFileType}\")",
		"file-type-tag-" + requiredFileType.replace(".", ""))
	addFilterPanel filterPanel

	updateResults()

document.filterByLanguage = (language) ->
	filters.requiredLanguages.push language
	
	filterPanel = makeFilterPanel(
		"Язык: #{language}",
		"document.deleteLanguageFilter(this, \"#{language}\")")
	addFilterPanel(filterPanel)

	updateResults()

document.deleteLanguageFilter = (self, language) ->
	index = filters.requiredLanguages.indexOf language
	filters.requiredLanguages.splice index, 1

	completeFilterDeletion self

createRegExpFromSearchText = (string) ->
	return new RegExp(string, 'i') if string isnt ""
	return null

updateSearchText = (event) ->
	searchInput = document.getElementById("search-input")
	# If clicked a search button several times, but input stay the same
	return if filters.searchText == searchInput.value
	filters.searchText = searchInput.value
	filters.cachedRegex = createRegExpFromSearchText(filters.searchText)
	
	updateResults()

searchInputClear = (event) ->
	searchInput = document.getElementById("search-input")
	searchInput.value = ""

	updateSearchText()

clearAllFilters = () ->
	filters.disableUpdate = yes
	searchInput = document.getElementById("search-input")
	searchInput.value = ""
	filters.searchText = searchInput.value
	filters.cachedRegex = createRegExpFromSearchText(filters.searchText)
	for i in document.getElementById("filter-area").children
		i.querySelector(".close-panel-btn").click()

	filters.disableUpdate = no
	updateResults()

document.getElementById "search-box"
.addEventListener "click", autorOnClick

document.getElementById "search-box"
.addEventListener "click", filetypeOnClick

document.getElementById "main-panel"
.addEventListener "click", filetypeOnClick

document.getElementById "search-input"
.addEventListener "change", updateSearchText

document.getElementById "search-button"
.addEventListener "click", updateSearchText

document.getElementById "search-clear"
.addEventListener "click", searchInputClear

document.getElementById "nothing-is-found-clear"
.addEventListener "click", clearAllFilters

document.getElementById "toggle-search"
.addEventListener "click", () ->
	$ "#toggle-search"
	.toggleClass "darker"
	$ "#main-panel"
	.toggle()