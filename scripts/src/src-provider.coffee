###
	Source provider
	Autor: Tsvikevich Denis 2020
###

#: import flexibel.coffee

button = div "Показать источники"

provider = element "src-provider"
provider.after button

showSources = () ->
	k = 0
	for i in provider.children
		i.innerText = "[" + (k + 1) + "] " + i.innerText
		k += 1
	
	provider.prepend h5 "Источники"
	provider.style.display = "block"
	button.style.display = "none"

	for element in document.getElementsByClassName "src-provider-info"
		element.innerHTML += " [" + (element.getAttribute "src-no") + "]"

button.id = "src-provider-button"
button.onclick = showSources