###
	Source provider
	Autor: Tsvikevich Denis 2020
###

#: import flexibel.coffee

button = neue "div"

provider = element "src-provider"
provider.after button

showSources = () ->
	k = 0
	for i in provider.children
		i.innerText = "[" + (k + 1) + "] " + i.innerText
		k += 1
	title = neue "h5", "Источники"
	provider.prepend title
	provider.style.display = "block"

	button.style.display = "none"

	kinders = document.getElementsByClassName "src-provider-info"

	for element in kinders
		num = Number.parseInt (element.getAttribute "src-no")
		element.innerHTML = element.innerHTML + " [" + num + "]"

button.id = "src-provider-button"
button.onclick = showSources
button.innerText = "Показать источники"