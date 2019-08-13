(function() {
  document.flexibel = (function() {
    var checkedof, del, delws, div, element, first, htmlset, last, map, max, min, mul, sub, sum, valueof, valueset;
    // Operator function for '-'
    sub = function(x, y) {
      return x - y;
    };
    // Operator function for '+', also allow to sum of array
    sum = function(x, y) {
      if (y == null) {
        return x.reduce(sum);
      }
      return x + y;
    };
    // Operator function for '*', also allow to mul of array
    mul = function(x, y) {
      if (y == null) {
        return x.reduce(mul);
      }
      return x * y;
    };
    // Operator function for '/'
    div = function(x, y) {
      return x / y;
    };
    // Returns the min of two elements, or min of array
    min = function(x, y) {
      if (y == null) {
        return x.reduce(min);
      }
      if (x < y) {
        return x;
      } else {
        return y;
      }
    };
    // Returns the max of two elements, or max of array
    max = function(x, y) {
      if (y == null) {
        return x.reduce(max);
      }
      if (x > y) {
        return x;
      } else {
        return y;
      }
    };
    last = function(container) {
      return container[container.length - 1];
    };
    first = function(container) {
      return container[0];
    };
    element = function(id) {
      return document.getElementById(id);
    };
    valueset = function(id, value) {
      return element(id).value = value;
    };
    valueof = function(id) {
      return element(id).value;
    };
    checkedof = function(id) {
      return element(id).checked;
    };
    htmlset = function(id, html) {
      return element(id).innerHTML = html;
    };
    del = function(str, sym) {
      return str.replace(new Regex(sym, "g"), "");
    };
    delws = function(str, sym) {
      return str.replace(/\w+/, "");
    };
    map = (function() {
      var countIt, keys, maxKey, maxValue, values;
      values = function(map) {
        return [...map.values()];
      };
      keys = function(map) {
        return [...map.values()];
      };
      maxKey = function(map) {
        return keys(map).reduce(max);
      };
      maxValue = function(map) {
        return values(map).reduce(max);
      };
      countIt = function(map, it) {
        if (map.has(it)) {
          return map.set(it, map.get(it) + 1);
        } else {
          return map.set(it, 1);
        }
      };
      return {values, keys, maxKey, maxValue, countIt};
    })();
    return {min, max, sub, sum, mul, div, htmlset, map, element, valueset, valueof, checkedof, first, last};
  })();

}).call(this);


//# sourceMappingURL=flexibel.js.map
//# sourceURL=coffeescript