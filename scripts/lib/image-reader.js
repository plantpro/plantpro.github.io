"use strict";

// Generated by CoffeeScript 2.4.1
(function () {
  var initializeReader;

  initializeReader = function initializeReader(pageCount, getPage) {
    var CURRENT_PAGE_TB, READER_WINDOW, checkforenter, currentPageNumber, isValidPage, next, prev, showPage;
    READER_WINDOW = document.getElementById("plpro-reader-window");
    CURRENT_PAGE_TB = document.getElementById("plpro-reader-page-tb");
    currentPageNumber = 1;

    isValidPage = function isValidPage(pageNumber) {
      return pageNumber >= 1 && pageNumber <= PAGE_COUNT;
    };

    showPage = function showPage(pageNumber) {
      if (isValidPage(pageNumber)) {
        if (pageNumber === 1) {
          document.getElementById("plpro-reader-prev-btn").classList.add("mdl-button--disabled");
        } else {
          document.getElementById("plpro-reader-prev-btn").classList.remove("mdl-button--disabled");
        }

        if (pageNumber === PAGE_COUNT) {
          document.getElementById("plpro-reader-next-btn").classList.add("mdl-button--disabled");
        } else {
          document.getElementById("plpro-reader-next-btn").classList.remove("mdl-button--disabled");
        }

        READER_WINDOW.innerHTML = "<img src=\"".concat(getPage(pageNumber), "\"/>");
        return CURRENT_PAGE_TB.value = pageNumber;
      }
    };

    next = function next() {
      if (isValidPage(currentPageNumber + 1)) {
        currentPageNumber = currentPageNumber + 1;
        return showPage(currentPageNumber);
      }
    };

    prev = function prev() {
      if (isValidPage(currentPageNumber - 1)) {
        currentPageNumber = currentPageNumber - 1;
        return showPage(currentPageNumber);
      }
    };

    checkforenter = function checkforenter(e) {
      var requiredPageNumber;

      if (e.keyCode === 13) {
        requiredPageNumber = Number.parseInt(CURRENT_PAGE_TB.value);

        if (isValidPage(requiredPageNumber)) {
          currentPageNumber = requiredPageNumber;
          return showPage(currentPageNumber);
        }
      }
    };

    document.getElementById("plpro-reader-pages-count").innerText = pageCount;
    document.getElementById("plpro-reader-prev-btn").addEventListener("click", prev);
    document.getElementById("plpro-reader-next-btn").addEventListener("click", next);
    CURRENT_PAGE_TB.addEventListener("keydown", checkforenter);
    return {
      READER_WINDOW: READER_WINDOW,
      CURRENT_PAGE_TB: CURRENT_PAGE_TB,
      isValidPage: isValidPage,
      showPage: showPage,
      next: next,
      prev: prev
    };
  };
}).call(void 0);