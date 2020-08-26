#: import flexibel.coffee

startSearch = () ->
	input = new RegExp((valueof "search-input"), "i")
	entries = element "dict-entries"
	for entry in entries.children
		firstTest = input.test entry.children[0].innerText
		secondTest = input.test entry.children[1].innerText
		entry.hidden = no
		entry.hidden = yes unless firstTest or secondTest

searchInputClear = (event) ->
	searchInput = document.getElementById "search-input"
	searchInput.value = ""

	startSearch()

document.getElementById "search-input"
	.addEventListener "input", startSearch

document.getElementById "search-button"
.addEventListener "click", startSearch

document.getElementById "search-clear"
.addEventListener "click", searchInputClear