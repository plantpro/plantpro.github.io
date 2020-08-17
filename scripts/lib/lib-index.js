"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// Generated by CoffeeScript 2.5.1
(function () {
  var addFilterPanel,
      applyFilters,
      autorOnClick,
      availableFileTypes,
      clearAllFilters,
      completeFilterDeletion,
      createRegExpFromSearchText,
      filetypeOnClick,
      filters,
      isSatisfiedToAllFilters,
      isSatisfiedToAutorFilter,
      isSatisfiedToFileTypeFilter,
      isSatisfiedToLanguageFilter,
      isSatisfiedToSearch,
      makeFilterPanel,
      makeFilterPanelWithColor,
      parseFileType,
      searchInputClear,
      updateResults,
      updateSearchText,
      indexOf = [].indexOf;
  availableFileTypes = {
    PDF: {
      name: ".pdf",
      color: "rgba(231, 47, 47, .2)"
    },
    DJVU: {
      name: ".djvu",
      color: "rgba(160, 0, 160, .2)"
    },
    ONLINE: {
      name: "online",
      color: "rgba(112, 112, 112, .2)"
    },
    UNKNOWN: null
  };

  parseFileType = function parseFileType(string) {
    switch (string.trim()) {
      case ".pdf":
        return availableFileTypes.PDF;

      case ".djvu":
        return availableFileTypes.DJVU;

      case "online":
        return availableFileTypes.ONLINE;

      default:
        return availableFileTypes.UNKNOWN;
    }
  };

  filters = {
    requiredLanguages: [],
    requiredFileTypes: [],
    requiredAutors: [],
    searchText: "",
    cachedRegex: null,
    atLeastOneIsFound: true
  };

  isSatisfiedToLanguageFilter = function isSatisfiedToLanguageFilter(record) {
    if (filters.requiredLanguages.length === 0) {
      return true;
    }

    return filters.requiredLanguages.some(function (requiredLanguage) {
      return record.dataset.language === requiredLanguage;
    });
  };

  isSatisfiedToFileTypeFilter = function isSatisfiedToFileTypeFilter(record) {
    if (filters.requiredFileTypes.length === 0) {
      return true;
    }

    return filters.requiredFileTypes.some(function (requiredFileType) {
      var fileTypeTag;
      fileTypeTag = parseFileType(record.getElementsByClassName("filetype-tag")[0].innerText);
      return fileTypeTag.name === requiredFileType.name;
    });
  };

  isSatisfiedToAutorFilter = function isSatisfiedToAutorFilter(record) {
    var autorsNames, j, len, ref, requiredAutorName;

    if (filters.requiredAutors.length === 0) {
      return true;
    }

    autorsNames = _toConsumableArray(record.getElementsByClassName("record-autor")).map(function (autor) {
      return autor.innerText;
    });
    ref = filters.requiredAutors;

    for (j = 0, len = ref.length; j < len; j++) {
      requiredAutorName = ref[j];

      if (indexOf.call(autorsNames, requiredAutorName) < 0) {
        return false;
      }
    }

    return true;
  };

  isSatisfiedToSearch = function isSatisfiedToSearch(record) {
    var recordTitle;

    if (filters.cachedRegex === null) {
      return true;
    }

    recordTitle = record.querySelector(".record-title:first-child>a");
    return filters.cachedRegex.test(recordTitle.innerText);
  };

  isSatisfiedToAllFilters = function isSatisfiedToAllFilters(record) {
    return isSatisfiedToLanguageFilter(record) && isSatisfiedToFileTypeFilter(record) && isSatisfiedToAutorFilter(record) && isSatisfiedToSearch(record);
  };

  makeFilterPanelWithColor = function makeFilterPanelWithColor(text, color, deleteAction) {
    var panel;
    panel = document.createElement("div");
    panel.className = 'panel filter-panel';
    panel.style.backgroundColor = color;
    panel.style.display = "none";
    panel.innerHTML = "<span>".concat(text, "</span> <button type='button' class='close-panel-btn' onclick='").concat(deleteAction, "'> <svg viewBox='0 0 24 24'> <path d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' /> </svg> </button>");
    return panel;
  };

  makeFilterPanel = function makeFilterPanel(text, deleteAction) {
    return makeFilterPanelWithColor(text, "rgba(255, 255, 255, 0.2)", deleteAction);
  };

  addFilterPanel = function addFilterPanel(panel) {
    document.getElementById("filter-area").appendChild(panel);
    return $(panel).fadeIn();
  };

  applyFilters = function applyFilters() {
    var j, len, record, records;
    records = document.getElementById("search-box").getElementsByClassName("record");

    for (j = 0, len = records.length; j < len; j++) {
      record = records[j];

      if (isSatisfiedToAllFilters(record)) {
        record.style.display = "block";
        filters.atLeastOneIsFound = true;
      } else {
        record.style.display = "none";
      }
    }

    if (!filters.atLeastOneIsFound) {
      return document.getElementById("nothing-is-found").style.display = "flex";
    } else {
      return document.getElementById("nothing-is-found").style.display = "none";
    }
  };

  updateResults = function updateResults() {
    filters.atLeastOneIsFound = false;
    $("#search-box").fadeOut();
    setTimeout(applyFilters, 300);
    $("#search-box").fadeIn();
    return null;
  };

  autorOnClick = function autorOnClick(event) {
    var autorName, filterPanel;

    if (!event.target.classList.contains("record-autor")) {
      return;
    }

    autorName = event.target.innerText;

    if (indexOf.call(filters.requiredAutors, autorName) >= 0) {
      return;
    }

    filters.requiredAutors.push(autorName);
    filterPanel = makeFilterPanel("\u0410\u0432\u0442\u043E\u0440: ".concat(autorName), "document.deleteAutorFilter(this, \"".concat(autorName, "\")"));
    addFilterPanel(filterPanel);
    return updateResults();
  };

  completeFilterDeletion = function completeFilterDeletion(self) {
    $(self.parentNode).fadeOut(function () {
      return self.parentNode.remove();
    });
    return updateResults();
  };

  document.deleteAutorFilter = function (self, autorName) {
    var index;
    index = filters.requiredAutors.indexOf(autorName);
    filters.requiredAutors.splice(index, 1);
    return completeFilterDeletion(self);
  };

  document.deleteFileTypeFilter = function (self, fileTypeName) {
    var index;
    index = filters.requiredFileTypes.findIndex(function (i) {
      return i.name === fileTypeName;
    });
    filters.requiredFileTypes.splice(index, 1);
    return completeFilterDeletion(self);
  };

  filetypeOnClick = function filetypeOnClick(event) {
    var filterPanel, requiredFileType;

    if (!event.target.classList.contains("filetype-tag")) {
      return;
    }

    requiredFileType = parseFileType(event.target.innerText);
    filters.requiredFileTypes.push(requiredFileType);
    filterPanel = makeFilterPanelWithColor("\u0422\u0438\u043F: ".concat(requiredFileType.name), requiredFileType.color, "document.deleteFileTypeFilter(this, \"".concat(requiredFileType.name, "\")"));
    addFilterPanel(filterPanel);
    return updateResults();
  };

  document.filterByLanguage = function (language) {
    var filterPanel;
    filters.requiredLanguages.push(language);
    filterPanel = makeFilterPanel("\u042F\u0437\u044B\u043A: ".concat(language), "document.deleteLanguageFilter(this, \"".concat(language, "\")"));
    addFilterPanel(filterPanel);
    return updateResults();
  };

  document.deleteLanguageFilter = function (self, language) {
    var index;
    index = filters.requiredLanguages.indexOf(language);
    filters.requiredLanguages.splice(index, 1);
    return completeFilterDeletion(self);
  };

  createRegExpFromSearchText = function createRegExpFromSearchText(string) {
    if (string !== "") {
      return new RegExp(string, 'i');
    }

    return null;
  };

  updateSearchText = function updateSearchText(event) {
    var searchInput;
    searchInput = document.getElementById("search-input"); // If clicked a search button several times, but input stay the same

    if (filters.searchText === searchInput.value) {
      return;
    }

    filters.searchText = searchInput.value;
    filters.cachedRegex = createRegExpFromSearchText(filters.searchText);
    return updateResults();
  };

  searchInputClear = function searchInputClear(event) {
    var searchInput;
    searchInput = document.getElementById("search-input");
    searchInput.value = "";
    return updateSearchText();
  };

  clearAllFilters = function clearAllFilters() {
    var i, j, len, ref, searchInput;
    searchInput = document.getElementById("search-input");
    searchInput.value = "";
    filters.searchText = searchInput.value;
    filters.cachedRegex = createRegExpFromSearchText(filters.searchText);
    ref = document.getElementById("filter-area").children;

    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      i.querySelector(".close-panel-btn:first-child").click();
    }

    return updateResults();
  };

  document.getElementById("search-box").addEventListener("click", autorOnClick);
  document.getElementById("search-box").addEventListener("click", filetypeOnClick);
  document.getElementById("main-panel").addEventListener("click", filetypeOnClick);
  document.getElementById("search-input").addEventListener("change", updateSearchText);
  document.getElementById("search-button").addEventListener("click", updateSearchText);
  document.getElementById("search-clear").addEventListener("click", searchInputClear);
  document.getElementById("nothing-is-found-clear").addEventListener("click", clearAllFilters);
}).call(void 0);