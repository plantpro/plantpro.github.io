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
		i.innerHTML = "[" + (k + 1) + "] " + i.innerHTML
		k += 1
	
	provider.prepend h5 "Источники"
	provider.style.display = "block"
	button.style.display = "none"

	element.style.display = "initial" for element in element ".src-provider-info"

button.id = "src-provider-button"
button.onclick = showSources