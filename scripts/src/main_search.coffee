#: import flexibel.coffee

startSearch = (name) ->
	input = new RegExp(name, "i")
	for entry in element("search-container").children
		entry.hidden = no
		entry.hidden = yes unless matchContent entry, input

matchContent = (element, input) ->
	firstTest = input.test element.getElementsByClassName("mdl-card__title-text")[0].innerText
	secondTest = input.test element.getElementsByClassName("mdl-card__supporting-text")[0].innerText
	thridTest = any(element.getElementsByClassName("post-category"), (i) -> input.test  i.innerText)
	return firstTest or secondTest or thridTest

searchTag = (name) ->
	input = new RegExp(name.srcElement.innerText, "i")
	for entry in element("search-container").children
		entry.hidden = no
		entry.hidden = yes unless any(entry.getElementsByClassName("post-category"), (i) -> input.test  i.innerText)
	history.pushState({ foo: "bar" }, "page 2", "index.html")

element "text-to-find"
	.addEventListener("input", () -> startSearch(valueof "text-to-find"))

element "text-to-find2"
	.addEventListener("change", () -> startSearch(valueof "text-to-find2"))

for child in element("search-container").children
	for elem in child.getElementsByClassName("post-category")
		elem.addEventListener("click", searchTag)

window.onpopstate = (event) ->
	searchTag({ srcElement: { innerText: "" } })
	history.replaceState null, "title 2"