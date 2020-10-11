function hideContentList() {
    $("#content-list").hide();
}

function hideSourceList() {
    $(".source-mark").hide();
    $("#source-list").hide();
}

function showOrHideSourceList() {
    $("#source-list").fadeToggle()
    $(".source-mark").fadeToggle()

    hideContentList()
}

function showOrHideContentList() {
    $("#content-list").fadeToggle();

    hideSourceList();
}

hideContentList();
hideSourceList();

$("#show-hide-source-list")
    .click(showOrHideSourceList);

$("#show-hide-content-list")
    .click(showOrHideContentList);

// Creates a content list item
function item(name, href) {
    return { name, href };
}

CONTENT_LIST = [{
    name: "I. Физика почв",
    items: [
        item("Плотность и порозность почвы", "soil-science/density.html")
    ]
}, {
    name: "II. Фитопатология",
    items: [
        item("Неинфекционные болезни растений", "phytopathology/non-infectious-plant-diseases.html"),
        item("Гаустории паразитических растений", "phytopathology/parasitic-plants-haustorium.html")
    ]
}, {
    name: "III. Растениеводство",
    items: [
        item("Хлеба I и II групп", "plant-growning/breads.html")
    ]
}, {
    name: "IV. Статистика",
    items: [
        item("Введение в статистику", "statistics/introduction-to-statistics.html"),
        item("Введение в визуализацию данных", "statistics/introduction-to-data-visualization.html")
    ]
}]

function appendDivisionHeader(name) {
    $("#content-list").append($("<p class='px-3 pb-4 mb-0 mt-4'>#{name}</p>"));
}

function createContentItem([index, { href, name }]) {
    let a = $("<a href='../#{href}'>#{index+1}. #{name}</a>");

    if (document.location.href.endsWith(href)) {
        a.addClass("active");
    }

    return a;
}

function appendDivision({ name: divisionName, items }) {
    appendDivisionHeader(divisionName);

    let div = $("<div class='nav nav-pills nav-stacked'></div>");
    for (let entry of [...items.entries()]) {
        div.append(createContentItem(entry));
    }

    $("#content-list").append(div);
}

function buildContentList() {
    let closeBtn = $("<div id='hide-content-list-btn'><img src='../../resources/images/right.svg'/></div>")
    closeBtn.click(showOrHideContentList);
    $("#content-list").append(closeBtn);

    for (let division of CONTENT_LIST) {
        appendDivision(division);
    }
}

buildContentList();

function hsvToRgb(h, s, v) {
    let i = Math.floor(h * 6)
    let f = h * 6 - i
    let p = v * (1 - s)
    let q = v * (1 - f * s)
    let t = v * (1 - (1 - f) * s)
    switch (i % 6) {
        case 0:
            var r = v
            var g = t
            var b = p
            break;
        case 1:
            var r = q
            var g = v
            var b = p
            break;
        case 2:
            var r = p
            var g = v
            var b = t
            break;
        case 3:
            var r = p
            var g = q
            var b = v
            break;
        case 4:
            var r = t
            var g = p
            var b = v
            break;
        case 5:
            var r = v
            var g = p
            var b = q
            break;
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

const GOLDEN_RATIO = 0.618033988749895;

function getColor () {
    h = Math.random() + GOLDEN_RATIO;
    h = h % 1;
    col = hsvToRgb(h, 0.9, 1);
    return "rgb(#{col.r}, #{col.g}, #{col.b})";
}

const cahce = new Map();
function colorize() {
	for i in $(".source-mark")
		if cahce.has(i.innerText)
			i.style.backgroundColor = cahce.get(i.innerText)
    else
        cahce.set(i.innerText, getColor())
i.style.backgroundColor = cahce.get(i.innerText)

colorize()