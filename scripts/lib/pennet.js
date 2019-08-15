"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Generated by CoffeeScript 2.4.1
(function () {
  var Counter, checkGenotype, checkGenotypes, clearError, combineGametes, createOutput, createPhenotypeInput, ejoin, element, evalPhenotype, fail, htmlset, makeGametes, map, mergeStrings, onChangeText, runApplication, valueof, valueset;

  Counter =
  /*#__PURE__*/
  function () {
    function Counter() {
      _classCallCheck(this, Counter);

      this.counter = new Map();
    }

    _createClass(Counter, [{
      key: "count",
      value: function count(element) {
        return map.countIt(this.counter, element);
      }
    }, {
      key: "getSize",
      value: function getSize() {
        return this.counter.size;
      }
    }, {
      key: "getTable",
      value: function getTable(tableName) {
        var builder;
        return builder = "<label class=\"tblbl\">".concat(tableName, ": </label><br>\n<table class=\"mdl-data-table mdl-js-data-table\">\n\t<tr>").concat(ejoin(map.makeKeyCells(this.counter)), "</tr>\n\t<tr>").concat(ejoin(map.makeValueCells(this.counter)), "</tr>\n</table>");
      }
    }]);

    return Counter;
  }();

  runApplication = function runApplication() {
    var gametesFirst, gametesSecond, genotype1, genotype2;
    clearError();
    genotype1 = valueof("genotype1").trim();
    genotype2 = valueof("genotype2").trim();

    if (!checkGenotypes(genotype1, genotype2)) {
      return;
    }

    gametesFirst = makeGametes(genotype1);
    gametesSecond = genotype1 === genotype2 ? gametesFirst : makeGametes(genotype2);
    return htmlset("tableplace", createOutput(gametesFirst, gametesSecond));
  };

  fail = function fail(error) {
    htmlset("errorlogs", "<p style=\"color: red;\">".concat(error, "</p>"));
    return false;
  };

  clearError = function clearError() {
    return fail("");
  };

  createOutput = function createOutput(g1, g2) {
    var builder, genotype, genotypeCounter, i, j, k, l, len, len1, len2, m, phenotype, phenotypeCounter, subbuilder;
    genotypeCounter = new Counter();
    phenotypeCounter = new Counter();
    builder = "<br><label class=\"tblbl\">Решётка Пеннета: </label><br>\n<table class='mdl-data-table mdl-js-data-table'><tr><td></td>";

    for (k = 0, len = g2.length; k < len; k++) {
      i = g2[k];
      builder += "<td>".concat(i, "</td>");
    }

    builder += "</tr>";

    for (l = 0, len1 = g1.length; l < len1; l++) {
      i = g1[l];
      builder += "<tr><td>".concat(i, "</td>");

      for (m = 0, len2 = g2.length; m < len2; m++) {
        j = g2[m];
        genotype = combineGametes(i, j);

        if (genotype === null) {
          return "";
        }

        phenotype = evalPhenotype(genotype);
        genotypeCounter.count(genotype);
        phenotypeCounter.count(phenotype);
        builder += phenotype !== null ? "<td>".concat(genotype, "<br>(").concat(phenotype, ")</td>") : "<td>".concat(genotype, "</td>");
      }

      builder += "</tr>";
    }

    subbuilder = genotypeCounter.getTable("Расщепление по генотипу");

    if (phenotypeCounter.getSize() > 1) {
      subbuilder += "<br>" + phenotypeCounter.getTable("Расщепление по фенотипу");
    }

    return builder + "</table><br><div>".concat(subbuilder, "</div>");
  };

  evalPhenotype = function evalPhenotype(genotype) {
    var allel, k, len, phenotypeParts, val;
    phenotypeParts = new Map();

    for (k = 0, len = genotype.length; k < len; k++) {
      allel = genotype[k];
      val = valueof("inputFor" + allel);

      if (val === "") {
        continue;
      }

      if (allel.toUpperCase() === allel) {
        phenotypeParts.set(allel, val);
      }

      if (!phenotypeParts.has(allel.toUpperCase())) {
        phenotypeParts.set(allel, val);
      }
    }

    if (!phenotypeParts.size) {
      return null;
    }

    return map.values(phenotypeParts).join(", ");
  };

  combineGametes = function combineGametes(g1, g2) {
    var i;

    if (g1.length !== g2.length) {
      return fail("wrong gamet length");
    }

    return ejoin(function () {
      var k, ref, results;
      results = [];

      for (i = k = 0, ref = g1.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        results.push(g1[i] < g2[i] ? g1[i] + g2[i] : g2[i] + g1[i]);
      }

      return results;
    }());
  }; // Создаёт набор гамет для заданного генотипа


  makeGametes = function makeGametes(genotype) {
    var _helper;

    _helper = function helper(genotype, position) {
      var gams;

      if (position >= genotype.length) {
        return;
      }

      gams = _helper(genotype, position + 2);

      if (gams === void 0) {
        return _toConsumableArray(new Set([genotype[position], genotype[position + 1]]));
      }

      if (genotype[position] === genotype[position + 1]) {
        return gams.map(function (i) {
          return genotype[position] + i;
        });
      } else {
        return [].concat(_toConsumableArray(gams.map(function (i) {
          return genotype[position] + i;
        })), _toConsumableArray(gams.map(function (i) {
          return genotype[position + 1] + i;
        })));
      }
    };

    return _helper(genotype, 0);
  };

  onChangeText = function onChangeText() {
    var allel, alleles, gametes;
    clearError();
    htmlset("gametparams", "");

    if (!checkGenotypes(valueof("genotype1"), valueof("genotype2"))) {
      return;
    }

    gametes = makeGametes(valueof("genotype1"));

    if (gametes === null) {
      return;
    }

    alleles = mergeStrings(gametes[0].toUpperCase(), gametes[0].toLowerCase());
    return htmlset("gametparams", function () {
      var k, len, results;
      results = [];

      for (k = 0, len = alleles.length; k < len; k++) {
        allel = alleles[k];
        results.push(createPhenotypeInput(allel));
      }

      return results;
    }().join(""));
  };

  createPhenotypeInput = function createPhenotypeInput(allel) {
    return "<div class=\"mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone\">\n\t<div class=\"mdl-textfield mdl-js-textfield\">\n\t\t<label class=\"tblbl\">\u0424\u0435\u043D\u043E\u0442\u0438\u043F ".concat(allel, "</label>\n\t\t<input type=\"text\" class=\"mdl-textfield__input\" id=\"inputFor").concat(allel, "\">\n\t</div>\n</div>");
  };

  checkGenotype = function checkGenotype(genotype) {
    var member, msg;
    msg = "\u0412\u0432\u0435\u0434\u0451\u043D \u043D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u0433\u0435\u043D\u043E\u0442\u0438\u043F ".concat(genotype);

    if (genotype.length % 2 !== 0) {
      return fail(msg);
    }

    member = []; //for i in genotype.toLowerCase()
    //	return fail msg if i in member
    //	member.push i

    return true;
  };

  checkGenotypes = function checkGenotypes(genotype1, genotype2) {
    var i, k, msg, ref;

    if (!checkGenotype(genotype1)) {
      return false;
    }

    if (!checkGenotype(genotype2)) {
      return false;
    }

    msg = "\u0413\u0435\u043D\u043E\u0442\u0438\u043F\u044B ".concat(genotype1, " \u0438 ").concat(genotype2, " \u043D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B");

    if (genotype1.length !== genotype2.length) {
      return fail(msg);
    }

    for (i = k = 0, ref = genotype1.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      if (genotype1[i].toLowerCase() !== genotype2[i].toLowerCase()) {
        return fail(msg);
      }
    }

    return true;
  };

  mergeStrings = function mergeStrings(string1, string2) {
    var i;
    return function () {
      var k, ref, results;
      results = [];

      for (i = k = 0, ref = string1.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        results.push(string1[i] + string2[i]);
      }

      return results;
    }().join("");
  };

  var _document$flexibel = document.flexibel;
  valueset = _document$flexibel.valueset;
  valueof = _document$flexibel.valueof;
  element = _document$flexibel.element;
  map = _document$flexibel.map;
  htmlset = _document$flexibel.htmlset;
  ejoin = _document$flexibel.ejoin;
  element("genotype1").addEventListener("input", onChangeText);
  element("genotype2").addEventListener("input", onChangeText);
  element("runButton").addEventListener("click", runApplication);
}).call(void 0);