"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// Generated by CoffeeScript 2.5.1
(function () {
  var autorOnClick,
      availableFileTypes,
      checkRecordForFilters,
      createRegExpFromSearchText,
      isSatisfiedToAllFilters,
      isSatisfiedToAutorFilter,
      isSatisfiedToFileTypeFilter,
      isSatisfiedToLanguageFilter,
      isSatisfiedToSearch,
      makeFilterPanel,
      makeFilterPanelWithColor,
      parseFileType,
      predicates,
      searchInputClear,
      showRecordIfSatisfiedToAllFilters,
      stateChanged,
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
      case "pdf":
        return availableFileTypes.PDF;

      case "djvu":
        return availableFileTypes.DJVU;

      case "online":
        return availableFileTypes.ONLINE;

      default:
        return availableFileTypes.UNKNOWN;
    }
  };

  predicates = {
    requiredLanguages: [],
    requiredFileTypes: [],
    requiredAutors: [],
    searchText: "",
    cachedRegex: null
  };

  isSatisfiedToLanguageFilter = function isSatisfiedToLanguageFilter(record) {
    if (predicates.requiredLanguages.length === 0) {
      return true;
    }

    return predicates.requiredLanguages.some(function (requiredLanguage) {
      return record.dataset.language === requiredLanguage;
    });
  };

  isSatisfiedToFileTypeFilter = function isSatisfiedToFileTypeFilter(record) {
    if (predicates.requiredFileTypes.length === 0) {
      return true;
    }

    return predicates.requiredFileTypes.some(function (requiredFileType) {
      var fileTypeTag;
      fileTypeTag = parseFileType(record.getElementsByClassName("filetype-tag")[0].innerText);
      return fileTypeTag.name === requiredFileType.name;
    });
  };

  isSatisfiedToAutorFilter = function isSatisfiedToAutorFilter(record) {
    var autorsNames, j, len, ref, requiredAutorName;

    if (predicates.requiredAutors.length === 0) {
      return true;
    }

    autorsNames = _toConsumableArray(record.getElementsByClassName("record-autor")).map(function (autor) {
      return autor.innerText;
    });
    ref = predicates.requiredAutors;

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

    if (predicates.cachedRegex === null) {
      return true;
    }

    recordTitle = record.querySelector(".record-title:first-child>a");
    return predicates.cachedRegex.test(recordTitle.innerText);
  };

  isSatisfiedToAllFilters = function isSatisfiedToAllFilters(record) {
    return isSatisfiedToLanguageFilter(record) && isSatisfiedToFileTypeFilter(record) && isSatisfiedToAutorFilter(record) && isSatisfiedToSearch(record);
  };

  makeFilterPanel = function makeFilterPanel(text, deleteAction) {
    return makeFilterPanelWithColor(text, "inherit", deleteAction);
  };

  makeFilterPanelWithColor = function makeFilterPanelWithColor(text, color, deleteAction) {
    return "<div class='panel filter-panel' style='background-color: ".concat(color, ";'> <span>").concat(text, "</span> <button type='button' class='close-panel-btn' onclick='").concat(deleteAction, "'> <svg viewBox='0 0 24 24'> <path d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' /> </svg> </button> </div>");
  };

  stateChanged = function stateChanged(event) {
    predicates.articleFilterIsEnabled = event.target.checked;
    return updateResults();
  };

  showRecordIfSatisfiedToAllFilters = function showRecordIfSatisfiedToAllFilters(record) {
    if (isSatisfiedToAllFilters(record)) {
      record.style.display = "block";
      return $(record).animate({
        opacity: 1
      }, 300);
    }
  };

  checkRecordForFilters = function checkRecordForFilters(record) {
    return $(record).animate({
      opacity: 0
    }, 300, function () {
      record.style.display = "none";
      return showRecordIfSatisfiedToAllFilters(record);
    });
  };

  updateResults = function updateResults() {
    var i, j, len, ref, searchBox;
    searchBox = document.getElementById("search-box");
    ref = searchBox.children;

    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];

      if (i.className === "record") {
        (function (i) {
          return checkRecordForFilters(i);
        })(i);
      }
    }

    return null;
  };

  autorOnClick = function autorOnClick(event) {
    var autorName, filterDiv;

    if (!event.target.classList.contains("record-autor")) {
      return false;
    }

    autorName = event.target.innerText;
    predicates.requiredAutors.push(autorName);
    filterDiv = document.getElementById("filter");
    filterDiv.innerHTML += " " + makeFilterPanel("\u0410\u0432\u0442\u043E\u0440: ".concat(autorName), "document.deleteAutorFilter(this, \"".concat(autorName, "\")"));
    return updateResults();
  };

  document.deleteAutorFilter = function (self, autorName) {
    $(self.parentNode).animate({
      opacity: 0
    }, 300, function () {
      return self.parentNode.remove();
    });
    predicates.requiredAutors.splice(predicates.requiredAutors.indexOf(autorName), 1);
    return updateResults();
  };

  document.deleteFileTypeFilter = function (self, fileTypeName) {
    var index;
    $(self.parentNode).animate({
      opacity: 0
    }, 300, function () {
      return self.parentNode.remove();
    });
    index = predicates.requiredFileTypes.findIndex(function (i) {
      return i.name === fileTypeName;
    });
    predicates.requiredFileTypes.splice(index, 1);
    return updateResults();
  };

  document.filterByType = function (self) {
    var filterDiv, requiredFileType;
    requiredFileType = parseFileType(self.innerText);
    predicates.requiredFileTypes.push(requiredFileType);
    filterDiv = document.getElementById("filter");
    filterDiv.innerHTML += " " + makeFilterPanelWithColor("\u0422\u0438\u043F: ".concat(requiredFileType.name), requiredFileType.color, "document.deleteFileTypeFilter(this, \"".concat(requiredFileType.name, "\")"));
    return updateResults();
  };

  document.filterByTypeName = function (self) {
    var filterDiv, requiredFileType;
    requiredFileType = parseFileType(self);
    predicates.requiredFileTypes.push(requiredFileType);
    filterDiv = document.getElementById("filter");
    filterDiv.innerHTML += " " + makeFilterPanelWithColor("\u0422\u0438\u043F: ".concat(requiredFileType.name), requiredFileType.color, "document.deleteFileTypeFilter(this, \"".concat(requiredFileType.name, "\")"));
    return updateResults();
  };

  document.filterByLanguage = function (language) {
    var filterDiv;
    predicates.requiredLanguages.push(language);
    filterDiv = document.getElementById("filter");
    filterDiv.innerHTML += " " + makeFilterPanel("\u042F\u0437\u044B\u043A: ".concat(language), "document.deleteLanguageFilter(this, \"".concat(language, "\")"));
    return updateResults();
  };

  document.deleteLanguageFilter = function (self, language) {
    var index;
    $(self.parentNode).animate({
      opacity: 0
    }, 300, function () {
      return self.parentNode.remove();
    });
    index = predicates.requiredLanguages.indexOf(language);
    predicates.requiredLanguages.splice(index, 1);
    return updateResults();
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

    if (predicates.searchText === searchInput.value) {
      return;
    }

    predicates.searchText = searchInput.value;
    predicates.cachedRegex = createRegExpFromSearchText(predicates.searchText);
    return updateResults();
  };

  searchInputClear = function searchInputClear(event) {
    var searchInput;
    searchInput = document.getElementById("search-input");
    searchInput.value = "";
    return updateSearchText();
  };

  document.getElementById("search-box").addEventListener("click", autorOnClick);
  document.getElementById("search-input").addEventListener("change", updateSearchText);
  document.getElementById("search-button").addEventListener("click", updateSearchText);
  document.getElementById("search-clear").addEventListener("click", searchInputClear);
}).call(void 0);