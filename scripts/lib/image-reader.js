"use strict";

// Generated by CoffeeScript 2.5.1
(function () {
  var initializeReader;

  initializeReader = function initializeReader(pageCount, getPage) {
    var CURRENT_PAGE_TB, PAGE_CONTENT, READER_WINDOW, checkforenter, currentPageNumber, initialX, initialY, isValidPage, moveTouch, next, prev, showPage, startTouch;
    PAGE_CONTENT = document.getElementById("plpro-reader");
    PAGE_CONTENT.innerHTML = "<button id=\"plpro-reader-prev-btn\" class=\"mdl-button mdl-button--disabled\">&larr;</button>\n<input id=\"plpro-reader-page-tb\" value=\"1\" type=\"text\"> /\n<span id=\"plpro-reader-pages-count\"></span>\n<button id=\"plpro-reader-next-btn\" class=\"mdl-button\">&rarr;</button>\n<div id=\"plpro-reader-window\"></div>";
    READER_WINDOW = document.getElementById("plpro-reader-window");
    CURRENT_PAGE_TB = document.getElementById("plpro-reader-page-tb");
    currentPageNumber = 1;

    isValidPage = function isValidPage(pageNumber) {
      return pageNumber >= 1 && pageNumber <= pageCount;
    };

    showPage = function showPage(pageNumber) {
      if (isValidPage(pageNumber)) {
        if (pageNumber === 1) {
          document.getElementById("plpro-reader-prev-btn").classList.add("mdl-button--disabled");
        } else {
          document.getElementById("plpro-reader-prev-btn").classList.remove("mdl-button--disabled");
        }

        if (pageNumber === pageCount) {
          document.getElementById("plpro-reader-next-btn").classList.add("mdl-button--disabled");
        } else {
          document.getElementById("plpro-reader-next-btn").classList.remove("mdl-button--disabled");
        }

        READER_WINDOW.innerHTML = getPage(pageNumber);
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

    initialX = null;
    initialY = null;

    startTouch = function startTouch(e) {
      initialX = e.touches[0].clientX;
      return initialY = e.touches[0].clientY;
    };

    moveTouch = function moveTouch(e) {
      var currentX, currentY, diffX, diffY;

      if (initialX === null) {
        return;
      }

      if (initialY === null) {
        return;
      }

      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
      diffX = initialX - currentX;
      diffY = initialY - currentY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          prev();
        } else {
          next();
        }

        return e.preventDefault();
      }
    };

    initialX = null;
    initialY = null;
    PAGE_CONTENT.addEventListener("touchstart", startTouch, false);
    PAGE_CONTENT.addEventListener("touchmove", moveTouch, false);
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

  document.plpro = {
    reader: {
      initializeReader: initializeReader,
      tracing: {
        incrementalSvg: function incrementalSvg(dir) {
          return function (pageNumber) {
            return "<img src='".concat(dir, "/").concat(pageNumber, ".svg'/>");
          };
        },
        incrementalSvgPrefix: function incrementalSvgPrefix(dir, prefix) {
          return function (pageNumber) {
            return "<img src='".concat(dir, "/").concat(prefix).concat(pageNumber, ".svg'/>");
          };
        },
        incrementalJpg: function incrementalJpg(dir) {
          return function (pageNumber) {
            return "<img src='".concat(dir, "/").concat(pageNumber, ".jpg'/>");
          };
        },
        incrementalJpgPrefix: function incrementalJpgPrefix(dir, prefix) {
          return function (pageNumber) {
            return "<img src='".concat(dir, "/").concat(prefix).concat(pageNumber, ".jpg'/>");
          };
        }
      }
    }
  };
}).call(void 0);