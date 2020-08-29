hideContentList = () ->
	$("#content-list").hide()

hideSourceList = () ->
	$(".source-mark").hide()
	$("#source-list").hide()

showOrHideSourceList = () ->
	$("#source-list").fadeToggle()
	$(".source-mark").fadeToggle()

	hideContentList()

showOrHideContentList = () ->
	$("#content-list").fadeToggle()
	
	hideSourceList()

hideContentList()
hideSourceList()

$ "#show-hide-source-list"
.click showOrHideSourceList

$ "#show-hide-content-list"
.click showOrHideContentList

# Creates a content list item
item = (name, href) -> { name, href }

CONTENT_LIST = [{
	name: "I. Физика почв",
	items: [
		item "Плотность почвы", "soil-science/density.html"
	]
}, {
	name: "II. Фитопатология",
	items: [
		item "Неинфекционные болезни растений", "phytopathology/non-infectious-plant-diseases.html"
		item "Гаустории паразитических растений", "phytopathology/parasitic-plants-haustorium.html"
	]
}, {
	name: "III. Растениеводство",
	items: [
		item "Хлеба I и II групп", "plant-growning/breads.html"
	]
}, {
	name: "IV. Статистика",
	items: [
		item "Введение в статистику", "statistics/introduction-to-statistics.html"
		item "Введение в визуализацию данных", "statistics/introduction-to-data-visualization.html"
	]
}]

appendDivisionHeader = (name) ->
	$ "#content-list"
	.append($ "<p class='px-3 pb-4 mb-0 mt-4'>#{name}</p>")

createContentItem = ([index, { href, name }]) ->
	a = $ "<a href='../#{href}'>#{index+1}. #{name}</a>"
	a.addClass "active" if document.location.href.endsWith(href)
	return a

appendDivision = ({ divisionName, items }) ->
	appendDivisionHeader divisionName

	div = $ "<div class='nav nav-pills nav-stacked'></div>"
	div.append(createContentItem entry) for entry in [items.entries()...]
	
	$ "#content-list"
	.append div

buildContentList = () ->
	appendDivision division for division in CONTENT_LIST

buildContentList()