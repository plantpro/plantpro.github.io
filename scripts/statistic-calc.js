(function() {
  // 86 80 25 77 73 76 100 90 69 93 90 83 70 73 73 70 90 83 71 95 40 58 68 69 100 78 87 97 92 74
  var counter, f, findMedian, findMode, getFerqsTable, getStatisticParameters, makeReport, reportElement, runApplication, runParser,
    indexOf = [].indexOf;

  runApplication = function() {
    var input, isPopulation;
    input = runParser(f.valueof("seqInput"));
    isPopulation = f.checkedof("checkbox1");
    return f.htmlset("reportPlace", makeReport(input, isPopulation));
  };

  makeReport = function(data, isPopulation) {
    var parameters, target;
    parameters = getStatisticParameters(data, isPopulation);
    target = isPopulation ? "генеральной совокупности" : "выборки";
    return ["<ul class='mdc-list mdc-list--two-line'>", reportElement(`Размер ${target}:`, parameters.size), reportElement(`Сумма ${target}:`, parameters.sum), reportElement(`Максимум ${target}:`, parameters.max), reportElement(`Минимум ${target}:`, parameters.min), reportElement(`Среднее ${target}:`, parameters.mean), reportElement(`Медиана ${target}:`, parameters.median), reportElement(`Моды ${target}:`, parameters.modes.join(", ")), reportElement(`Размах ${target}:`, parameters.range), reportElement(`Дисперсия ${target}:`, parameters.variance), reportElement(`Стандартное отклонение ${target}:`, parameters.sd), "</ul>", getFerqsTable(parameters.freqs, parameters.size)].join("");
  };

  reportElement = function(title, value) {
    return `<li class="mdc-list-item">\n	<span class="mdc-list-item__text">\n		<span class="mdc-list-item__primary-text" style="color: #3f51b5; font-size: 12px;">\n			${title}\n		</span>\n		<span class="mdc-list-item__secondary-text" style="padding-left: 10px;">\n			${value}\n		</span>\n	</span>\n</li>`;
  };

  getStatisticParameters = function(data, isPopulation) {
    var freqs, max, mean, median, min, modes, orderedData, range, sd, size, sum, variance;
    size = data.length;
    sum = data.reduce(f.sum);
    mean = sum / size;
    orderedData = data.sort(f.sub);
    max = f.last(orderedData);
    min = f.first(orderedData);
    median = findMedian(orderedData);
    range = max - min;
    variance = orderedData.map(function(x) {
      return (x - mean) ** 2;
    }).reduce(f.sum) / (isPopulation ? size : size - 1);
    sd = Math.sqrt(variance);
    freqs = counter(orderedData);
    modes = findMode(freqs);
    return {size, sum, mean, median, max, min, range, variance, sd, freqs, modes};
  };

  getFerqsTable = function(freqs, size) {
    var i, result;
    result = "<div><table class=\"mdl-data-table mdl-js-data-table\"><tr><td><mi>x</mi></td>";
    for (i of freqs) {
      result += `<td>${i[0]}</td>`;
    }
    result += "</tr><tr><td>f</td>";
    for (i of freqs) {
      result += `<td>${i[1]}</td>`;
    }
    result += "</tr><tr><td>ω</td>";
    for (i of freqs) {
      result += `<td>${new String(i[1] / size).substr(0, 5)}</td>`;
    }
    return result + "</tr></table></div>";
  };

  findMode = function(freqs) {
    var i, maxValue, results;
    maxValue = f.map.maxValue(freqs);
    results = [];
    for (i of freqs) {
      if (i[1] === maxValue) {
        results.push(i[0]);
      }
    }
    return results;
  };

  findMedian = function(data) {
    if (data.length % 2 === 0) {
      return (data[data.length / 2] + data[data.length / 2 + 1]) / 2;
    }
    return data[Math.floor(data.length / 2)];
  };

  counter = function(values) {
    var i, j, len, map;
    map = new Map;
    for (j = 0, len = values.length; j < len; j++) {
      i = values[j];
      f.map.countIt(map, i);
    }
    return map;
  };

  runParser = function(input) {
    var getCurrent, next, parseNumber, parserState, ref;
    parserState = {
      result: [],
      currentPosition: 0,
      input: input
    };
    getCurrent = function(state) {
      return state.input[state.currentPosition];
    };
    next = function(state) {
      var current;
      current = getCurrent(state);
      state.currentPosition++;
      return current;
    };
    parseNumber = function(state) {
      var buffer, current, ref;
      buffer = next(state);
      while (ref = (current = next(state)), indexOf.call("0123456789.", ref) >= 0) {
        buffer += current;
      }
      return state.result.push(parseFloat(buffer));
    };
    while (parserState.currentPosition < input.length) {
      if (ref = getCurrent(parserState), indexOf.call("0123456789", ref) >= 0) {
        parseNumber(parserState);
      } else {
        next(parserState);
      }
    }
    return parserState.result;
  };

  document.getElementById("runButton").addEventListener("click", runApplication);

  f = document.flexibel;

}).call(this);


//# sourceMappingURL=statistic-calc.js.map
//# sourceURL=coffeescript