"use strict";

// Generated by CoffeeScript 2.5.1
(function () {
  var HINTS;
  HINTS = [["Как помочь науке?", "\u041F\u043E\u043C\u043E\u0447\u044C \u043D\u0430\u0443\u0447\u043D\u044B\u043C \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F\u043C \u0434\u043E\u0432\u043E\u043B\u044C\u043D\u043E \u043F\u0440\u043E\u0441\u0442\u043E! \u0421\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442 \u043F\u0440\u043E\u0435\u043A\u0442, \u043D\u0430\u0437\u044B\u0432\u0430\u0435\u043C\u044B\u0439\n     <a href=\"https://boinc.bakerlab.org/\">Rosetta@Home</a>, \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u044E\u0449\u0438\u0439\n\u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0432\u0430\u0441 \u043A \u0432\u044B\u0447\u0438\u0441\u043B\u0435\u043D\u0438\u044F\u043C \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u044B \u0431\u0435\u043B\u043A\u043E\u0432. \u0414\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0438 \u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C\n\u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0443, \u043A\u043E\u0442\u043E\u0440\u0430\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0431\u0443\u0434\u0435\u0442 \u043F\u0440\u043E\u0432\u043E\u0434\u0438\u0442\u044C \u0440\u0430\u0441\u0447\u0451\u0442\u044B \u0432 \u0444\u043E\u043D\u043E\u0432\u043E\u043C \u0440\u0435\u0436\u0438\u043C\u0435."]];

  document.getHint = function () {
    var hint, hintNo;
    hintNo = Math.floor(Math.random() * HINTS.length);
    hint = HINTS[hintNo];
    return "<h6>" + hint[0] + "</h6>" + hint[1];
  };
}).call(void 0);