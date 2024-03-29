// Run: tsc scripts\src\book-interface.ts --outdir scripts\lib\
// In this namespace we store functions to display or hide panels
var Visibility;
(function (Visibility) {
    var contentPanelIsVisible = false;
    var settingsPanelIsVisible = false;
    function hideContentPanel() {
        $("#content-panel").hide();
        $("#show-hide-content-panel").removeClass("darker");
        contentPanelIsVisible = false;
    }
    Visibility.hideContentPanel = hideContentPanel;
    function hideSettingsPanel() {
        $("#settings-panel").hide();
        $("#show-hide-settings-panel").removeClass("darker");
        settingsPanelIsVisible = false;
    }
    Visibility.hideSettingsPanel = hideSettingsPanel;
    function settingsPanelVisibilityToggle() {
        $("#settings-panel").toggle();
        if (!contentPanelIsVisible) {
            $("main").toggleClass("hide-sm");
        }
        $("#show-hide-settings-panel").toggleClass("darker");
        settingsPanelIsVisible = !settingsPanelIsVisible;
        hideContentPanel();
    }
    Visibility.settingsPanelVisibilityToggle = settingsPanelVisibilityToggle;
    function contentPanelVisibilityToggle() {
        $("#content-panel").toggle();
        if (!settingsPanelIsVisible) {
            $("main").toggleClass("hide-sm");
        }
        $("#show-hide-content-panel").toggleClass("darker");
        contentPanelIsVisible = !contentPanelIsVisible;
        hideSettingsPanel();
    }
    Visibility.contentPanelVisibilityToggle = contentPanelVisibilityToggle;
    function sourcesToggle() {
        if (document.querySelector("#show-sources").checked) {
            $(".source-mark").show();
            $("#source-list").show();
        }
        else {
            $(".source-mark").hide();
            $("#source-list").hide();
        }
    }
    Visibility.sourcesToggle = sourcesToggle;
})(Visibility || (Visibility = {}));
// This namespace respond for content list building
var Content;
(function (Content) {
    var Item = /** @class */ (function () {
        function Item(name, href) {
            this.name = name;
            this.href = href;
        }
        return Item;
    }());
    var CONTENT_LIST = [{
            name: "I. Общая химия",
            items: [
                new Item("Что такое pH и как его считать", "physical-chemistry/ph-basics.html"),
                new Item("Введение в химическую термодинамику. Понятие системы. Парциальное давление и объём", "physical-chemistry/chem-termodynamics.html"),
                new Item("Первый закон термодинамики", "physical-chemistry/term-first-law.html")
            ]
        }, {
            name: "II. Физика почв",
            items: [
                new Item("Плотность и порозность почвы", "soil-science/density.html")
            ]
        }, {
            name: "III. Фитопатология",
            items: [
                new Item("Неинфекционные болезни растений", "phytopathology/non-infectious-plant-diseases.html"),
                new Item("Гаустории паразитических растений", "phytopathology/parasitic-plants-haustorium.html")
            ]
        }, {
            name: "IV. Растениеводство",
            items: [
                new Item("Хлеба I и II групп", "plant-growning/breads.html")
            ]
        }, {
            name: "V. Статистика",
            items: [
                new Item("Введение в статистику", "statistics/introduction-to-statistics.html"),
                new Item("Введение в визуализацию данных", "statistics/introduction-to-data-visualization.html")
            ]
        }];
    function appendDivisionHeader(name) {
        $("#content-panel")
            .append($("<span class=\"section-title\">" + name + "</span>"));
    }
    function createContentItem(_a) {
        var index = _a[0], _b = _a[1], href = _b.href, name = _b.name;
        var contentItem = $("<a href=\"../" + href + "\">" + (index + 1) + ". " + name + "</a>");
        if (document.location.href.endsWith(href)) {
            contentItem.addClass("active");
        }
        return contentItem;
    }
    function appendDivision(_a) {
        var divisionName = _a.name, items = _a.items;
        appendDivisionHeader(divisionName);
        var sectionList = $("<div class='section-list'></div>");
        var index = 0;
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var entry = items_1[_i];
            sectionList.append(createContentItem([index, entry]));
            index++;
        }
        $("#content-panel").append(sectionList);
    }
    function buildContentList() {
        $("#content-panel")
            .append($("<div class='nav-panel-title'>Содержание</div>"));
        for (var _i = 0, CONTENT_LIST_1 = CONTENT_LIST; _i < CONTENT_LIST_1.length; _i++) {
            var section = CONTENT_LIST_1[_i];
            appendDivision(section);
        }
    }
    Content.buildContentList = buildContentList;
})(Content || (Content = {}));
// In this namespace we work with source displaying
var Sources;
(function (Sources) {
    var COLORS = [
        "blue",
        "red",
        "green"
    ];
    function colorize() {
        for (var _i = 0, _a = $(".source-mark"); _i < _a.length; _i++) {
            var i = _a[_i];
            i.style.backgroundColor = COLORS[parseInt(i.innerText)];
        }
    }
    Sources.colorize = colorize;
})(Sources || (Sources = {}));
// In this namespace we customize interface
var Theming;
(function (Theming) {
    function saveTheme(themeName) {
        try {
            localStorage.setItem("theme", themeName);
        }
        catch (QuotaExceededError) {
            console.log("Can not save theme name");
        }
    }
    function themeChanged(event) {
        var themeName = event.target.value;
        var oldThemeName = localStorage.getItem("theme");
        if (themeName !== undefined) {
            document.documentElement.classList.remove(oldThemeName);
        }
        document.documentElement.classList.add(themeName);
        saveTheme(themeName);
    }
    Theming.themeChanged = themeChanged;
    function loadTheme() {
        var themeName = localStorage.getItem("theme");
        if (themeName !== undefined) {
            if (themeName === "theme-dark") {
                document.querySelector("#settings-theme-dark").checked = true;
            }
            else {
                document.querySelector("#settings-theme-light").checked = true;
            }
            document.documentElement.classList.add(themeName);
        }
    }
    Theming.loadTheme = loadTheme;
})(Theming || (Theming = {}));
function main() {
    Visibility.hideContentPanel();
    Visibility.hideSettingsPanel();
    $("#show-hide-settings-panel").on("click", Visibility.settingsPanelVisibilityToggle);
    $("#show-hide-content-panel").on("click", Visibility.contentPanelVisibilityToggle);
    Content.buildContentList();
    Sources.colorize();
    $("#settings-theme-light")
        .on("change", Theming.themeChanged);
    $("#settings-theme-dark")
        .on("change", Theming.themeChanged);
    Theming.loadTheme();
    $("#show-sources").on("change", Visibility.sourcesToggle);
    Visibility.sourcesToggle();
}
main();
