const colors = [
	"red",
	"green",
	"blue",
	"yellow"
]

function srcProviderShowSrcs() {
	var provider = document.getElementById("src-provider");
	var sources = provider.childNodes.forEach((i, k) => {
		i.style = "background-color: " + colors[k - 1]
		return [i.innerText, colors[k - 1]]
	});
	var title = document.createElement("h5");
	title.innerText = "Источники";
	provider.prepend(title);
	provider.style.display = "block";

	var providerButton = document.getElementById("src-provider-button");
	providerButton.style.display = "none";

	var kinders = document.getElementsByClassName("src-provider-info");

	for (const element of kinders) {
		var no = Number.parseInt(element.getAttribute("src-no"))
		element.style = "background-color: " + colors[no - 1]
	}
}