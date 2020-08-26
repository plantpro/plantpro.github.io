$("#source-list").hide()
$(".source-mark").hide()
$("#content-list").hide()

document.getElementById("show-hide-source-list").addEventListener("click", () ->
	$("#source-list").fadeToggle()
	$(".source-mark").fadeToggle()

	$("#content-list").fadeOut()
	container.classList.remove("crop")
)

contentPanel = document.getElementById("content-list")
container = document.querySelector(".container-fluid")

document.getElementById("show-hide-content-list").addEventListener("click", () ->
	$("#content-list").fadeToggle()

	if container.classList.contains("crop")
		container.classList.remove("crop")
	else
		container.classList.add("crop")
		$("#source-list").fadeOut()
		$(".source-mark").fadeOut()
)

CONTENT = [{
  name: "I. Физика почв",
  items: [{
    name: "Плотность почвы",
    href: "soil-science/density.html"
  }]
}, {
	name: "II. Фитопатология",
	items: [{
		name: "Неинфекционные болезни растений",
		href: "phytopathology/non-infectious-plant-diseases.html"
	}, {
		name: "Гаустории паразитических растений",
		href: "phytopathology/parasitic-plants-haustorium.html"
	}]
}, {
  name: "III. Растениеводство",
  items: [{
    name: "Хлеба I и II групп",
    href: "plant-growning/breads.html"
  }]
}, {
  name: "IV. Статистика",
  items: [{
    name: "Введение в статистику",
    href: "statistics/introduction-to-statistics.html"
  }, {
    name: "Введение в визуализацию данных",
    href: "statistics/introduction-to-data-visualization.html"
  }]
}]

buildDivision = (division) ->
	result = "<p class='div-name px-3 pb-4 mb-0 mt-4'>#{division.name}</p>
	<div class='nav nav-pills nav-stacked'>"
	index = 1

	for i in division.items
		if document.location.href.endsWith(i.href)
			result += "<a class='active' href='../#{i.href}'>#{index}. #{i.name}</a>"
		else
			result += "<a href='../#{i.href}'>#{index}.#{i.name}</a>"
		index += 1
	
	return result + "</div>"

buildContentList = () ->
	builder = ""
	for division in CONTENT
		builder += buildDivision(division)
  
	contentPanel.innerHTML = builder

buildContentList()