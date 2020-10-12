hideContentList = () ->
	$("#content-list").hide()

hideSourceList = () ->
	$(".source-mark").hide()
	$("#source-list").hide()

showOrHideSourceList = () ->
	$("#source-list").fadeToggle()
	$(".source-mark").fadeToggle()

	hideContentList()

showOrHideContentList = (event) ->
	$("#content-list").fadeToggle()
	$(event.target).toggleClass "darker"
	
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
		item "Плотность и порозность почвы", "soil-science/density.html"
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

appendDivision = ({ name: divisionName, items }) ->
	appendDivisionHeader divisionName

	div = $ "<div class='division-list'></div>"
	div.append(createContentItem entry) for entry in [items.entries()...]
	
	$ "#content-list"
	.append div

buildContentList = () ->
	$ "#content-list"
	.append  $("<div id='content-list-title'>Содержание</div>")

	appendDivision division for division in CONTENT_LIST

buildContentList()

hsvToRgb = (h, s, v) ->
	i = Math.floor(h * 6)
	f = h * 6 - i
	p = v * (1 - s)
	q = v * (1 - f * s)
	t = v * (1 - (1 - f) * s)
	switch i % 6
		when 0
			r = v
			g = t
			b = p
		when 1
			r = q
			g = v
			b = p
		when 2
			r = p
			g = v
			b = t
		when 3
			r = p
			g = q
			b = v
		when 4
			r = t
			g = p
			b = v
		when 5
			r = v
			g = p
			b = q

	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	}

GOLDEN_RATIO = 0.618033988749895

getColor = () ->
	h = Math.random() + GOLDEN_RATIO
	h = h % 1
	col = hsvToRgb h, 0.9, 1
	return "rgb(#{col.r}, #{col.g}, #{col.b})"

cahce = new Map
colorize = () ->
	for i in $(".source-mark")
		if cahce.has(i.innerText)
			i.style.backgroundColor = cahce.get(i.innerText)
		else
			cahce.set(i.innerText, getColor())
			i.style.backgroundColor = cahce.get(i.innerText)

colorize()