// Generated by CoffeeScript 2.5.1
(function() {
  var CONTENT_LIST, GOLDEN_RATIO, appendDivision, appendDivisionHeader, buildContentList, cahce, colorize, createContentItem, getColor, hideContentList, hideSourceList, hsvToRgb, item, showOrHideContentList, showOrHideSourceList, themeChanged;

  hideContentList = function(event) {
    $("#content-list").hide();
    return $("#show-hide-content-list").removeClass("darker");
  };

  hideSourceList = function() {
    $("#settings-panel").hide();
    return $("#show-hide-settings-panel").removeClass("darker");
  };

  showOrHideSourceList = function(event) {
    $("#settings-panel").toggle();
    $("#show-hide-settings-panel").toggleClass("darker");
    return hideContentList();
  };

  showOrHideContentList = function(event) {
    $("#content-list").toggle();
    $("#show-hide-content-list").toggleClass("darker");
    return hideSourceList();
  };

  hideContentList();

  hideSourceList();

  $("#show-hide-settings-panel").click(showOrHideSourceList);

  $("#show-hide-content-list").click(showOrHideContentList);

  // Creates a content list item
  item = function(name, href) {
    return {name, href};
  };

  CONTENT_LIST = [
    {
      name: "I. Физика почв",
      items: [item("Плотность и порозность почвы",
    "soil-science/density.html")]
    },
    {
      name: "II. Фитопатология",
      items: [item("Неинфекционные болезни растений",
    "phytopathology/non-infectious-plant-diseases.html"),
    item("Гаустории паразитических растений",
    "phytopathology/parasitic-plants-haustorium.html")]
    },
    {
      name: "III. Растениеводство",
      items: [item("Хлеба I и II групп",
    "plant-growning/breads.html")]
    },
    {
      name: "IV. Статистика",
      items: [item("Введение в статистику",
    "statistics/introduction-to-statistics.html"),
    item("Введение в визуализацию данных",
    "statistics/introduction-to-data-visualization.html")]
    }
  ];

  appendDivisionHeader = function(name) {
    return $("#content-list").append($(`<p class='px-3 pb-4 mb-0 mt-4'>${name}</p>`));
  };

  createContentItem = function([index, {href, name}]) {
    var a;
    a = $(`<a href='../${href}'>${index + 1}. ${name}</a>`);
    if (document.location.href.endsWith(href)) {
      a.addClass("active");
    }
    return a;
  };

  appendDivision = function({
      name: divisionName,
      items
    }) {
    var div, entry, j, len, ref;
    appendDivisionHeader(divisionName);
    div = $("<div class='division-list'></div>");
    ref = [...items.entries()];
    for (j = 0, len = ref.length; j < len; j++) {
      entry = ref[j];
      div.append(createContentItem(entry));
    }
    return $("#content-list").append(div);
  };

  buildContentList = function() {
    var division, j, len, results;
    $("#content-list").append($("<div id='content-list-title'>Содержание</div>"));
    results = [];
    for (j = 0, len = CONTENT_LIST.length; j < len; j++) {
      division = CONTENT_LIST[j];
      results.push(appendDivision(division));
    }
    return results;
  };

  buildContentList();

  hsvToRgb = function(h, s, v) {
    var b, f, g, i, p, q, r, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  GOLDEN_RATIO = 0.618033988749895;

  getColor = function() {
    var col, h;
    h = Math.random() + GOLDEN_RATIO;
    h = h % 1;
    col = hsvToRgb(h, 0.9, 1);
    return `rgb(${col.r}, ${col.g}, ${col.b})`;
  };

  cahce = new Map();

  colorize = function() {
    var i, j, len, ref, results;
    ref = $(".source-mark");
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      if (cahce.has(i.innerText)) {
        results.push(i.style.backgroundColor = cahce.get(i.innerText));
      } else {
        cahce.set(i.innerText, getColor());
        results.push(i.style.backgroundColor = cahce.get(i.innerText));
      }
    }
    return results;
  };

  colorize();

  themeChanged = function(event) {
    var theme;
    theme = event.target.value;
    return console.log(theme);
  };

  $("settings-theme-light").addEventListener("change", themeChanged);

  $("settings-theme-dark").addEventListener("change", themeChanged);

}).call(this);
