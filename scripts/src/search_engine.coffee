#: import flexibel.coffee

startSearch = () ->
	input = new RegExp((valueof "text-to-find"), "i")
	entries = element "dict-entries"
	for entry in entries.children
		firstTest = input.test entry.children[0].innerText
		secondTest = input.test entry.children[1].innerText
		entry.hidden = no
		entry.hidden = yes unless firstTest or secondTest


element "text-to-find"
	.addEventListener("input", startSearch)