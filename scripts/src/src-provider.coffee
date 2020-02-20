###
	Source provider
	Autor: Tsvikevich Denis 2020
###

#: import flexibel.coffee

srcProviderShowSrcs = () ->
	provider = element "src-provider"
	sources = []
	k = 0
	for i of provider.children
		text = i.innerHTML
		i.innerHTML = "[" + k + "] " + text
		console.log i
		sources.push [i.innerText, k]
		k += 1
	title = document.createElement "h5"
	title.innerText = "Источники"
	provider.prepend title
	provider.style.display = "block"

	providerButton = document.getElementById "src-provider-button"
	providerButton.style.display = "none"

	kinders = document.getElementsByClassName "src-provider-info"

	for element of kinders
		num = Number.parseInt (element.getAttribute "src-no")
		element.innerHTML = element.innerHTML + "[" + num + "]"

document.srcProviderShowSrcs = srcProviderShowSrcs