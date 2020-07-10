#: import flexibel.coffee

predicates = []

isAll = (record) ->
	nullCount = 0

	for predicate in predicates
		if predicate != null
			return false if not predicate record
		else
			nullCount += 1

	if nullCount == predicates.length
		predicates.pop() while predicates.length > 0
	
	return true

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

makeChipWithColor = (text, color, num) -> "
		<span class='mdl-chip mdl-chip--deletable' style='background-color: #{color}'>
			<span class='mdl-chip__text'>#{text}</span>
			<button type='button' class='mdl-chip__action' onclick='document.clearFilter(this, #{num})'>
				<svg style='width:18px;height:18px' viewBox='0 0 24 24'>
					<path fill='#ffffff' d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' />
				</svg>
			</button>
		</span>
	"

clearFilter = (self, num) ->
	self.parentNode.remove()
	predicates[num] = null
	applyPredicates()

articlePredicate = (record) ->
	span = record.getElementsByClassName "plpro-lib-record-article"
	return span.length > 0

indexOfArticlePredicate = { index: -1, processIt: false }

stateChanged = (event) ->
	if not indexOfArticlePredicate.processIt
		indexOfArticlePredicate.processIt = true
		return
	indexOfArticlePredicate.processIt = false
	console.log event
	if event.target.control.checked
		predicates.push(articlePredicate)
		indexOfArticlePredicate.index = predicates.length - 1
	else
		predicates[indexOfArticlePredicate.index] = null
	applyPredicates()

applyPredicates = () ->
	searchBox = element "search-box"
	for i in searchBox.children
		if i.className == "plpro-lib-record"
			i.style.display = "none"
			i.style.display = "block" if isAll i

document.autorOnClick = (self) ->
	text = self.innerText
	predicates.push(
		(record) ->
			for j in record.children
				return true if j.className == "plpro-lib-record-autor" and j.innerText == text
			return false
	)

	applyPredicates()
	filterDiv = element "filter"
	filterDiv.innerHTML += " " +
		makeChip("Автор: #{self.innerText}", predicates.length - 1)

document.filterByType = (self) ->
	predicates.push(
		(record) ->
			k = (record.getElementsByClassName "filetype-tag")[0]
			return true if k.innerText.trim() == self.innerText.trim()
			return false
	)

	applyPredicates()

	filterDiv = element "filter"

	if self.innerText == "pdf"
			filterDiv.innerHTML += " " +
				makeChipWithColor "Тип: .pdf", "rgb(231, 47, 47)", (predicates.length - 1)
	if self.innerText == "djvu"
		filterDiv.innerHTML += " " +
			makeChipWithColor "Тип: .djvu", "rgb(160, 0, 160)", (predicates.length - 1)
	if self.innerText == "online"
		filterDiv.innerHTML += " " +
			makeChipWithColor "Тип: online", "rgb(112, 112, 112)", (predicates.length - 1)

document.clearFilter = clearFilter

document.getElementById "switch-1"
.addEventListener "click", stateChanged