const colors = [
	"red",
	"green",
	"blue",
	"yellow"
]

function srcProviderShowSrcs() {
	var provider = document.getElementById("src-provider");
	var sources = [];
	var k = 0;
	for (const i of provider.children) {
		i.style = "background-color: " + colors[k]
		console.log(i)
		sources.push([i.innerText, colors[k]])
		k++;
	}
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