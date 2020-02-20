"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// Generated by CoffeeScript 2.4.1
(function () {
  // Operator function for '-'
  var all, any, checkedof, countIt, delws, div, ejoin, element, first, htmlget, htmlset, keys, last, makeKeyCells, makeMapCells, makeValueCells, max, maxKey, maxValue, min, mul, neue, startSearch, sub, sum, valueof, values, valueset;

  sub = function sub(x, y) {
    return x - y;
  }; // Operator function for '+', also allow to sum of array


  sum = function sum(x, y) {
    if (y == null) {
      return x.reduce(document.flexibel.sum);
    }

    return x + y;
  }; // Operator function for '*', also allow to mul of array


  mul = function mul(x, y) {
    if (y == null) {
      return x.reduce(document.flexibel.mul);
    }

    return x * y;
  }; // Operator function for '/'


  div = function div(x, y) {
    return x / y;
  }; // Returns the min of two elements, or min of array


  min = function min(x, y) {
    if (y == null) {
      return x.reduce(document.flexibel.min);
    }

    if (x < y) {
      return x;
    } else {
      return y;
    }
  }; // Returns the max of two elements, or max of array


  max = function max(x, y) {
    if (y == null) {
      return x.reduce(document.flexibel.max);
    }

    if (x > y) {
      return x;
    } else {
      return y;
    }
  };

  last = function last(container) {
    return container[container.length - 1];
  };

  first = function first(container) {
    return container[0];
  };

  neue = function neue(name, inner) {
    var elem;
    elem = document.createElement(name);

    if (inner == null) {
      elem.innerHTML = inner;
    }

    return elem;
  };

  element = function element(id) {
    return document.getElementById(id);
  };

  valueset = function valueset(id, value) {
    return document.flexibel.element(id).value = value;
  };

  valueof = function valueof(id) {
    return document.flexibel.element(id).value;
  };

  checkedof = function checkedof(id) {
    return document.flexibel.element(id).checked;
  };

  htmlset = function htmlset(id, html) {
    return document.flexibel.element(id).innerHTML = html;
  };

  htmlget = function htmlget(id) {
    return document.flexibel.element(id).innerHTML;
  };

  any = function any(values, f) {
    var i, j, len;

    for (j = 0, len = values.length; j < len; j++) {
      i = values[j];

      if (f(i)) {
        return true;
      }
    }

    return false;
  };

  all = function all(values, f) {
    var i, j, len;

    for (j = 0, len = values.length; j < len; j++) {
      i = values[j];

      if (!f(i)) {
        return false;
      }
    }

    return true;
  };

  ejoin = function ejoin(values) {
    return values.join("");
  };

  delws = function delws(str, sym) {
    return str.replace(/\s+/g, "");
  };

  values = function values(map) {
    return _toConsumableArray(map.values());
  };

  keys = function keys(map) {
    return _toConsumableArray(map.keys());
  };

  maxKey = function maxKey(map) {
    return document.flexibel.keys(map).reduce(document.flexibel.max);
  };

  maxValue = function maxValue(map) {
    return document.flexibel.values(map).reduce(document.flexibel.max);
  };

  countIt = function countIt(map, it) {
    if (map.has(it)) {
      return map.set(it, map.get(it) + 1);
    } else {
      return map.set(it, 1);
    }
  };

  makeValueCells = function makeValueCells(map) {
    var ref, results, v;
    ref = map.values();
    results = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = ref[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        v = _step.value;
        results.push("<td>".concat(v, "</td>"));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return results;
  };

  makeKeyCells = function makeKeyCells(map) {
    var k, ref, results;
    ref = map.keys();
    results = [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = ref[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        k = _step2.value;
        results.push("<td>".concat(k, "</td>"));
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return results;
  };

  makeMapCells = function makeMapCells(values, mapper) {
    var k, results;
    results = [];
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = values[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        k = _step3.value;
        results.push("<td>".concat(mapper(k), "</td>"));
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
          _iterator3["return"]();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    return results;
  };

  document.flexibel = {
    makeKeyCells: makeKeyCells,
    makeValueCells: makeValueCells,
    countIt: countIt,
    maxValue: maxValue,
    maxKey: maxKey,
    keys: keys,
    values: values,
    delws: delws,
    ejoin: ejoin,
    htmlset: htmlset,
    checkedof: checkedof,
    valueof: valueof,
    valueset: valueset,
    element: element,
    first: first,
    last: last,
    max: max,
    min: min,
    sum: sum,
    sub: sub,
    mul: mul,
    div: div,
    all: all,
    any: any
  };

  startSearch = function startSearch() {
    var entries, entry, firstTest, input, j, len, ref, results, secondTest;
    input = new RegExp(valueof("text-to-find"), "i");
    entries = element("dict-entries");
    ref = entries.children;
    results = [];

    for (j = 0, len = ref.length; j < len; j++) {
      entry = ref[j];
      firstTest = input.test(entry.children[0].innerText);
      secondTest = input.test(entry.children[1].innerText);
      entry.hidden = false;

      if (!(firstTest || secondTest)) {
        results.push(entry.hidden = true);
      } else {
        results.push(void 0);
      }
    }

    return results;
  };

  element("text-to-find").addEventListener("input", startSearch);
}).call(void 0);