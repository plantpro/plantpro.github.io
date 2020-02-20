###
	Source provider
	Autor: Tsvikevich Denis 2020
###

#: import flexibel.coffee

button = document.createElement "div"
button.id = "src-provider-button"
button.onclick = showSources
button.innerText = "Показать источники"

element "src-provider"
	.after button

showSources = () ->
	provider = element "src-provider"
	k = 0
	for i in provider.children
		i.innerText = "[" + (k + 1) + "] " + i.innerText
		k += 1
	title = document.createElement "h5"
	title.innerText = "Источники"
	provider.prepend title
	provider.style.display = "block"

	button.style.display = "none"

	kinders = document.getElementsByClassName "src-provider-info"

	for element in kinders
		num = Number.parseInt (element.getAttribute "src-no")
		element.innerHTML = element.innerHTML + " [" + num + "]"