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
		when "onine" then availableFileTypes.ONLINE
		else availableFileTypes.UNKNOWN

predicates = {
	articleFilterIsEnabled: false,
	requiredFileTypes: [],
	requiredAutors: [],
}

isArticle = (record) ->
	span = record.getElementsByClassName "plpro-lib-record-article"
	return span.length > 0

isSatisfiedToArticleFilter = (record) ->
	not predicates.articleFilterIsEnabled or isArticle record

isSatisfiedToFileTypeFilter = (record) ->
	return true if predicates.requiredFileTypes.length == 0
	predicates.requiredFileTypes.some((requiredFileType) ->
		fileTypeTag = parseFileType (record.getElementsByClassName "filetype-tag")[0].innerText
		return fileTypeTag.name == requiredFileType.name
	)

isSatisfiedToAutorFilter = (record) ->
	return true if predicates.requiredAutors.length == 0
	for autorName in predicates.requiredAutors
		if not [record.children...].some((elem) ->
			elem.className == "plpro-lib-record-autor" and elem.innerText == autorName)
			return false
	return true

isSatisfiedToAllPredicates = (record) ->
	isSatisfiedToArticleFilter(record) and
	isSatisfiedToFileTypeFilter(record) and
	isSatisfiedToAutorFilter(record)

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

updateResults = () ->
	searchBox = document.getElementById "search-box"
	for i in searchBox.children
		if i.className == "plpro-lib-record"
			$(i).animate({ opacity: 0 }, 300, do (i) -> () ->
				i.style.display = "none"
				if isSatisfiedToAllPredicates i
					i.style.display = "block"
					$(i).animate({ opacity: 1 }, 300)
			)

document.autorOnClick = (self) ->
	autorName = self.innerText
	predicates.requiredAutors.push autorName
	console.log(autorName)
	filterDiv = document.getElementById "filter"
	filterDiv.innerHTML += " " +
		makeFilterPanel "Автор: #{autorName}", "document.deleteAutorFilter(this, #{autorName})"
	
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
	predicates.requiredFileTypes.push requiredFileType

	filterDiv = document.getElementById "filter"
	filterDiv.innerHTML += " " +
		makeFilterPanelWithColor("Тип: .#{requiredFileType.name}",
			requiredFileType.color,
			"document.deleteFileTypeFilter(this, #{requiredFileType.name})")

	updateResults()

document.filterByTypeName = (self) ->
	requiredFileType = parseFileType self
	predicates.requiredFileTypes.push requiredFileType
	
	filterDiv = document.getElementById "filter"
	filterDiv.innerHTML += " " +
		makeFilterPanelWithColor("Тип: .#{requiredFileType.name}",
			requiredFileType.color,
			"document.deleteFileTypeFilter(this, #{requiredFileType.name})")

	updateResults()
	
document.getElementById "switch-1"
.addEventListener "change", stateChanged