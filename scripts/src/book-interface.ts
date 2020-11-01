// Run: tsc scripts\src\book-interface.ts --outdir scripts\lib\

// In this namespace we store functions to display or hide panels
namespace Visibility {
  let contentPanelIsVisible = false;
  let settingsPanelIsVisible = false;

  export function hideContentPanel() {
    $("#content-panel").hide();
    $("#show-hide-content-panel").removeClass("darker");

    contentPanelIsVisible = false;
  }

  export function hideSettingsPanel() {
    $("#settings-panel").hide();
    $("#show-hide-settings-panel").removeClass("darker");

    settingsPanelIsVisible = false;
  }

  export function settingsPanelVisibilityToggle() {
    $("#settings-panel").toggle();
    if (!contentPanelIsVisible) {
      $("main").toggleClass("hide-sm");
    }
    $("#show-hide-settings-panel").toggleClass("darker");
    settingsPanelIsVisible = !settingsPanelIsVisible;
    hideContentPanel();
  }

  export function contentPanelVisibilityToggle() {
    $("#content-panel").toggle();
    if (!settingsPanelIsVisible) {
      $("main").toggleClass("hide-sm");
    }
    $("#show-hide-content-panel").toggleClass("darker");
    contentPanelIsVisible = !contentPanelIsVisible;
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
    name: "I. Общая химия",
    items: [
      new Item("Что такое pH и как его считать", "physical-chemistry/ph-basics.html")
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
  function saveTheme(themeName: string) {
    try {
      localStorage.setItem("theme", themeName);
    } catch (QuotaExceededError) {
      console.log("Can not save theme name")
    }
  }

  export function themeChanged(event) {
    let themeName = event.target.value as string;

    let oldThemeName = localStorage.getItem("theme");
    
    if (themeName !== undefined) {
      document.documentElement.classList.remove(oldThemeName)
    }
    document.documentElement.classList.add(themeName)

    saveTheme(themeName);
  }

  export function loadTheme() {
    let themeName = localStorage.getItem("theme");

    if (themeName !== undefined) {
      if (themeName === "theme-dark") {
        (document.querySelector("#settings-theme-dark") as HTMLInputElement).checked = true;
      } else {
        (document.querySelector("#settings-theme-light") as HTMLInputElement).checked = true;
      }

      document.documentElement.classList.add(themeName)
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