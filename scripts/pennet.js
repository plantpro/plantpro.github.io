(function() {
  var Counter, browseError, checkGenotype, checkGenotypes, clearError, combineGametes, createOutput, createPhenotypeInput, element, evalPhenotype, htmlset, makeGametes, map, mergeStrings, onChangeText, runApplication, valueof, valueset,
    indexOf = [].indexOf;

  Counter = class Counter {
    constructor() {
      this.counter = new Map();
    }

    count(element) {
      return map.countIt(this.counter, element);
    }

    getSize() {
      return this.counter.size;
    }

    getTable(tableName) {
      var builder, k, ref, ref1, v;
      builder = `<label class="tblbl">${tableName}: </label>\n<br><table class="mdl-data-table mdl-js-data-table"><tr>`;
      ref = this.counter.keys();
      for (k of ref) {
        builder += `<td>${k}</td>`;
      }
      builder += "</tr><tr>";
      ref1 = this.counter.values();
      for (v of ref1) {
        builder += `<td>${v}</td>`;
      }
      return builder + "</tr></table>";
    }

  };

  runApplication = function() {
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

  browseError = function(error) {
    htmlset("errorlogs", `<p style="color: red;">${error}</p>`);
    return false;
  };

  clearError = function() {
    return browseError("");
  };

  createOutput = function(g1, g2) {
    var builder, genotype, genotypeCounter, i, j, l, len, len1, len2, m, n, phenotype, phenotypeCounter, subbuilder;
    genotypeCounter = new Counter;
    phenotypeCounter = new Counter;
    builder = "<br><label class=\"tblbl\">Решётка Пеннета: </label><br>\n<table class='mdl-data-table mdl-js-data-table'><tr><td></td>";
    for (l = 0, len = g2.length; l < len; l++) {
      i = g2[l];
      builder += `<td>${i}</td>`;
    }
    builder += "</tr>";
    for (m = 0, len1 = g1.length; m < len1; m++) {
      i = g1[m];
      builder += `<tr><td>${i}</td>`;
      for (n = 0, len2 = g2.length; n < len2; n++) {
        j = g2[n];
        genotype = combineGametes(i, j);
        if (genotype === null) {
          return "";
        }
        phenotype = evalPhenotype(genotype);
        genotypeCounter.count(genotype);
        phenotypeCounter.count(phenotype);
        builder += phenotype !== null ? `<td>${genotype}<br>(${phenotype})</td>` : `<td>${genotype}</td>`;
      }
      builder += "</tr>";
    }
    subbuilder = genotypeCounter.getTable("Расщепление по генотипу");
    if (phenotypeCounter.getSize() > 1) {
      subbuilder += "<br>" + phenotypeCounter.getTable("Расщепление по фенотипу");
    }
    return builder + `</table><br><div>${subbuilder}</div>`;
  };

  evalPhenotype = function(genotype) {
    var allel, l, len, phenotypeParts, val;
    phenotypeParts = new Map;
    for (l = 0, len = genotype.length; l < len; l++) {
      allel = genotype[l];
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

  combineGametes = function(gamet1, gamet2) {
    var genotype, i, l, ref;
    if (gamet1.length !== gamet2.length) {
      return browseError("wrong gamet length");
    }
    genotype = "";
    for (i = l = 0, ref = gamet1.length; (0 <= ref ? l < ref : l > ref); i = 0 <= ref ? ++l : --l) {
      genotype += gamet1[i] < gamet2[i] ? gamet1[i] + gamet2[i] : gamet2[i] + gamet1[i];
    }
    return genotype;
  };

  // Создаёт набор гамет для заданного генотипа
  makeGametes = function(genotype) {
    var helper;
    helper = function(genotype, position) {
      var gams;
      if (position >= genotype.length) {
        return;
      }
      gams = helper(genotype, position + 2);
      if (gams === void 0) {
        return [...new Set([genotype[position], genotype[position + 1]])];
      }
      if (genotype[position] === genotype[position + 1]) {
        return gams.map(function(i) {
          return genotype[position] + i;
        });
      } else {
        return [
          ...gams.map(function(i) {
            return genotype[position] + i;
          }),
          ...gams.map(function(i) {
            return genotype[position + 1] + i;
          })
        ];
      }
    };
    return helper(genotype, 0);
  };

  onChangeText = function() {
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
    return htmlset("gametparams", ((function() {
      var l, len, results;
      results = [];
      for (l = 0, len = alleles.length; l < len; l++) {
        allel = alleles[l];
        results.push(createPhenotypeInput(allel));
      }
      return results;
    })()).join(""));
  };

  createPhenotypeInput = function(allel) {
    return `<div class="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">\n	<div class="mdl-textfield mdl-js-textfield">\n		<label class="tblbl">Фенотип ${allel}</label>\n		<input type="text" class="mdl-textfield__input" id="inputFor${allel}">\n	</div>\n</div>`;
  };

  checkGenotype = function(genotype) {
    var i, l, member, msg, ref, ref1;
    msg = `Введён некорректный генотип ${genotype}`;
    if (genotype.length % 2 !== 0) {
      return browseError(msg);
    }
    member = [];
    for (i = l = 0, ref = i < genotype.length; (0 <= ref ? l < ref : l > ref); i = 0 <= ref ? ++l : --l) {
      if (ref1 = genotype[i].toLowerCase(), indexOf.call(member, ref1) >= 0) {
        return browseError(msg);
      }
      member.push(genotype[i].toLowerCase());
    }
    return true;
  };

  checkGenotypes = function(genotype1, genotype2) {
    var i, l, msg, ref;
    if (!checkGenotype(genotype1)) {
      return false;
    }
    if (!checkGenotype(genotype2)) {
      return false;
    }
    msg = `Генотипы ${genotype1} и ${genotype2} некорректны`;
    if (genotype1.length !== genotype2.length) {
      return browseError(msg);
    }
    for (i = l = 0, ref = genotype1.length; (0 <= ref ? l < ref : l > ref); i = 0 <= ref ? ++l : --l) {
      if (genotype1[i].toLowerCase() !== genotype2[i].toLowerCase()) {
        return browseError(msg);
      }
    }
    return true;
  };

  mergeStrings = function(string1, string2) {
    var i;
    return ((function() {
      var l, ref, results;
      results = [];
      for (i = l = 0, ref = string1.length; (0 <= ref ? l < ref : l > ref); i = 0 <= ref ? ++l : --l) {
        results.push(string1[i] + string2[i]);
      }
      return results;
    })()).join("");
  };

  ({valueset, valueof, element, map, htmlset} = document.flexibel);

  element("genotype1").addEventListener("input", onChangeText);

  element("genotype2").addEventListener("input", onChangeText);

  element("runButton").addEventListener("click", runApplication);

}).call(this);


//# sourceMappingURL=pennet.js.map
//# sourceURL=coffeescript