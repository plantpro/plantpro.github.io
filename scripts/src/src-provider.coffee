###
	Source provider
	Autor: Tsvikevich Denis 2020
###

#: import flexibel.coffee

srcProviderShowSrcs = () ->
	provider = element "src-provider"
	sources = []
	k = 0
	for i in provider.children
		i.innerText = "[" + k + "] " + i.innerText
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

	for element in kinders
		num = Number.parseInt (element.getAttribute "src-no")
		element.innerHTML = element.innerHTML + "[" + num + "]"

document.srcProviderShowSrcs = srcProviderShowSrcs