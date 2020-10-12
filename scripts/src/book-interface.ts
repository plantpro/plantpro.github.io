// Run: tsc scripts\src\book-interface.ts --outdir scripts\lib\book-interface.js

// In this namespace we store functions to display or hide panels
namespace Visibility {
  export function hideContentPanel() {
    $("#content-panel").hide();
    $("#show-hide-content-panel").removeClass("darker");
  }

  export function hideSettingsPanel() {
    $("#settings-panel").hide();
    $("#show-hide-settings-panel").removeClass("darker");
  }

  export function settingsPanelVisibilityToggle() {
    $("#settings-panel").toggle();
    $("main").toggleClass("trim");
    $("#show-hide-settings-panel").toggleClass("darker");

    hideContentPanel();
  }

  export function contentPanelVisibilityToggle() {
    $("#content-panel").toggle();
    $("main").toggleClass("trim");
    $("#show-hide-content-panel").toggleClass("darker");
	
    hideSettingsPanel();
  }

  export function sourcesToggle() {
    if ((document.querySelector("#show-sources") as HTMLInputElement).checked) {
      $(".source-mark").show();
      $("#source-list").show();
    } else {
      $(".source-mark").hide();
      $("#source-list").hide();
    }
  }
}

// This namespace respond for content list building
namespace Content {
  class Item {
    readonly name: string;
    readonly href: string;

    constructor(name: string, href: string) {
      this.name = name;
      this.href = href;
    }
  }

  const CONTENT_LIST = [{
    name: "I. Физика почв",
    items: [
      new Item("Плотность и порозность почвы", "soil-science/density.html")
    ]
  }, {
    name: "II. Фитопатология",
    items: [
      new Item("Неинфекционные болезни растений", "phytopathology/non-infectious-plant-diseases.html"),
      new Item("Гаустории паразитических растений", "phytopathology/parasitic-plants-haustorium.html")
    ]
  }, {
    name: "III. Растениеводство",
    items: [
      new Item("Хлеба I и II групп", "plant-growning/breads.html")
    ]
  }, {
    name: "IV. Статистика",
    items: [
      new Item("Введение в статистику", "statistics/introduction-to-statistics.html"),
      new Item("Введение в визуализацию данных", "statistics/introduction-to-data-visualization.html")
    ]
  }]

  function appendDivisionHeader(name: string) {
    $("#content-panel")
      .append($(`<span class="section-title">${name}</span>`));
  }

  function createContentItem([index, { href, name }]: [number, Item]) {
    let contentItem = $(`<a href="../${href}">${index + 1}. ${name}</a>`);

    if (document.location.href.endsWith(href)) {
      contentItem.addClass("active");
    }

    return contentItem;
  }

  function appendDivision({ name: divisionName, items }: { name: string, items: Item[] }) {
    appendDivisionHeader(divisionName);

    let sectionList = $("<div class='section-list'></div>");
    let index = 0;
    for (const entry of items) {
      sectionList.append(createContentItem([index, entry]));
      index++;
    }

    $("#content-panel").append(sectionList);
  }

  export function buildContentList() {
    $("#content-panel")
      .append($("<div class='nav-panel-title'>Содержание</div>"));

    for (const section of CONTENT_LIST) {
      appendDivision(section);
    }
  }
}

// In this namespace we work with source displaying
namespace Sources {
  const COLORS = [
    "blue",
    "red",
    "green"
  ]

  export function colorize() {
    for (const i of $(".source-mark")) {
      i.style.backgroundColor = COLORS[parseInt(i.innerText)]
    }
  }

}

// In this namespace we customize interface
namespace Theming {
  function enableDarkTheme() {
    document.documentElement.style.setProperty("--text-color", "rgb(242, 242, 242)");
    document.documentElement.style.setProperty("--secondary-background-color", "rgb(45, 45, 45)");
    document.documentElement.style.setProperty("--background-color", " rgb(30, 30, 30)");
  }

  function enableLightTheme() {
    document.documentElement.style.setProperty("--text-color", "rgb(33, 37, 41)");
    document.documentElement.style.setProperty("--secondary-background-color", "rgb(242, 242, 242)");
    document.documentElement.style.setProperty("--background-color", " rgb(255, 255, 255)");
  }

  function saveTheme(themeName: string) {
    try {
      localStorage.setItem("theme", themeName);
    } catch (QuotaExceededError) {
      console.log("Can not save theme name")
    }
  }

  export function themeChanged(event) {
    let themeName = event.target.value as string;
	
    if (themeName === "theme-dark") {
      enableDarkTheme();
    } else {
      enableLightTheme();
    }

    saveTheme(themeName);
  }

  export function loadTheme() {
    let themeName = localStorage.getItem("theme");

    if (themeName === "theme-dark") {
      (document.querySelector("#settings-theme-dark") as HTMLInputElement).checked = true;
      enableDarkTheme();
    } else {
      (document.querySelector("#settings-theme-light") as HTMLInputElement).checked = true;
      enableLightTheme();
    }
  }
}

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