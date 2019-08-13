(function() {
  /*
  	Complementarity application
  	Autor: Tsvikevich Denis
  */
  var DNA_COMPLIMENTARY, DNA_VALID_CHARS, GENETIC_CODE, INPUT_TYPE, RNA_COMPLIMENTARY, RNA_VALID_CHARS, buildByDnaOne, buildByDnaTwo, buildByInformationalRna, buildByProtein, buildByTransferRna, clearError, del, element, formatOutput, formatProteinSequence, getCheckerAndInputElement, isValidAminoacid, isValidDnaChar, isValidRnaChar, lastInputType, logError, makeComplimentaryDna, makeDnaFromiRna, makeInformationalRna, makeInformationalRnaFromProtein, makeProteinFromInformationalRna, makeTransferRna, mapString, runApplication, uniformNucleotide, uniformSequence, validateInput, valueof, valueset,
    indexOf = [].indexOf;

  DNA_VALID_CHARS = "ATGCatgcАТГЦатгц ";

  RNA_VALID_CHARS = "AUGCaugcАУГЦаугц ";

  DNA_COMPLIMENTARY = new Map([["А", "Т"], ["Т", "А"], ["Г", "Ц"], ["У", "А"], ["Ц", "Г"]]);

  RNA_COMPLIMENTARY = new Map([["А", "У"], ["Т", "А"], ["У", "А"], ["Г", "Ц"], ["Ц", "Г"]]);

  GENETIC_CODE = new Map([["УУУ", "ФЕН"], ["УУЦ", "ФЕН"], ["УУА", "ЛЕЙ"], ["УЦУ", "СЕР"], ["УЦЦ", "СЕР"], ["УЦА", "СЕР"], ["УЦГ", "СЕР"], ["УАУ", "ТИР"], ["УАЦ", "ТИР"], ["УАА", "СТОП"], ["УАГ", "СТОП"], ["УГУ", "ЦИС"], ["УГЦ", "ЦИС"], ["УГА", "СТОП"], ["УГГ", "ТРИ"], ["ЦУУ", "ЛЕЙ"], ["ЦУЦ", "ЛЕЙ"], ["ЦУА", "ЛЕЙ"], ["ЦУГ", "ЛЕЙ"], ["ЦЦУ", "ПРО"], ["ЦЦЦ", "ПРО"], ["ЦЦА", "ПРО"], ["ЦЦГ", "ПРО"], ["ЦАУ", "ГИС"], ["ЦАЦ", "ГИС"], ["ЦАА", "ГЛУ"], ["ЦАГ", "ГЛУ"], ["ЦГУ", "АРГ"], ["ЦГЦ", "АРГ"], ["ЦГА", "АРГ"], ["ЦГГ", "АРГ"], ["АУУ", "ИЛЕ"], ["АУЦ", "ИЛЕ"], ["АУА", "ИЛЕ"], ["АУГ", "МЕТ"], ["ГУУ", "ВАЛ"], ["ГУЦ", "ВАЛ"], ["ГУА", "ВАЛ"], ["ГУГ", "ВАЛ"], ["АЦУ", "ТРЕ"], ["АЦЦ", "ТРЕ"], ["АЦА", "ТРЕ"], ["АЦГ", "ТРЕ"], ["ГЦУ", "АЛА"], ["ГЦЦ", "АЛА"], ["ГЦА", "АЛА"], ["ГЦГ", "АЛА"], ["ААУ", "АСН"], ["ААЦ", "АСН"], ["ААА", "ЛИЗ"], ["ААГ", "ЛИЗ"], ["ГАУ", "АСП"], ["ГАЦ", "АСП"], ["ГАА", "ГЛУ"], ["ГАГ", "ГЛУ"], ["АГУ", "СЕР"], ["АГЦ", "СЕР"], ["АГА", "АРГ"], ["АГГ", "АРГ"], ["ГГУ", "ГЛИ"], ["ГГЦ", "ГЛИ"], ["ГГА", "ГЛИ"], ["ГГГ", "ГЛИ"]]);

  INPUT_TYPE = {
    DNA1: 1,
    DNA2: 2,
    IRNA: 3,
    TRNA: 4,
    PROTEIN: 5
  };

  lastInputType = 1;

  runApplication = function() {
    var result;
    result = (function() {
      switch (lastInputType) {
        case 1:
          return buildByDnaOne();
        case 2:
          return buildByDnaTwo();
        case 3:
          return buildByInformationalRna();
        case 4:
          return buildByTransferRna();
        case 5:
          return buildByProtein();
      }
    })();
    valueset("dnaInput", formatOutput(result.firstDna));
    valueset("dna2Input", formatOutput(result.secondDna));
    valueset("irnaInput", formatOutput(result.informationalRna));
    valueset("trnaInput", formatOutput(result.transferRna));
    return valueset("proteinInput", result.protein);
  };

  buildByDnaOne = function() {
    var firstDna, informationalRna, protein, secondDna, transferRna;
    firstDna = uniformSequence(valueof("dnaInput"));
    secondDna = makeComplimentaryDna(firstDna);
    informationalRna = makeInformationalRna(firstDna);
    transferRna = makeTransferRna(informationalRna);
    protein = makeProteinFromInformationalRna(informationalRna);
    return {firstDna, secondDna, informationalRna, transferRna, protein};
  };

  buildByDnaTwo = function() {
    var firstDna, informationalRna, protein, secondDna, transferRna;
    secondDna = uniformSequence(valueof("dna2Input"));
    firstDna = makeComplimentaryDna(secondDna);
    informationalRna = makeInformationalRna(firstDna);
    transferRna = makeTransferRna(informationalRna);
    protein = makeProteinFromInformationalRna(informationalRna);
    return {firstDna, secondDna, informationalRna, transferRna, protein};
  };

  buildByInformationalRna = function() {
    var firstDna, informationalRna, protein, secondDna, transferRna;
    informationalRna = uniformSequence(valueof("irnaInput"));
    firstDna = makeDnaFromiRna(informationalRna);
    secondDna = makeComplimentaryDna(firstDna);
    transferRna = makeTransferRna(informationalRna);
    protein = makeProteinFromInformationalRna(informationalRna);
    return {firstDna, secondDna, informationalRna, transferRna, protein};
  };

  buildByTransferRna = function() {
    var firstDna, informationalRna, protein, secondDna, transferRna;
    transferRna = uniformSequence(valueof("trnaInput"));
    secondDna = makeDnaFromiRna(transferRna);
    firstDna = makeComplimentaryDna(secondDna);
    informationalRna = makeInformationalRna(firstDna);
    protein = makeProteinFromInformationalRna(informationalRna);
    return {firstDna, secondDna, informationalRna, transferRna, protein};
  };

  buildByProtein = function() {
    var firstDna, informationalRna, protein, secondDna, transferRna;
    protein = valueof("proteinInput");
    informationalRna = makeInformationalRnaFromProtein(protein);
    firstDna = makeDnaFromiRna(informationalRna);
    secondDna = makeComplimentaryDna(firstDna);
    transferRna = makeTransferRna(informationalRna);
    return {firstDna, secondDna, informationalRna, transferRna, protein};
  };

  makeProteinFromInformationalRna = function(irna) {
    var divideIntoTriplets;
    divideIntoTriplets = function(irna) {
      var currentTriplet, i, index, j, len, triplets;
      triplets = [];
      currentTriplet = "";
      index = 0;
      for (j = 0, len = irna.length; j < len; j++) {
        i = irna[j];
        currentTriplet += i;
        index++;
        if (index === 3) {
          triplets.push(currentTriplet);
          currentTriplet = "";
          index = 0;
        }
      }
      return triplets;
    };
    return divideIntoTriplets(irna).map(function(x) {
      return GENETIC_CODE.get(x);
    }).join("-");
  };

  makeInformationalRnaFromProtein = function(protein) {
    var aminoacid, i, j, len, ref, result;
    result = "";
    ref = protein.split("-");
    for (j = 0, len = ref.length; j < len; j++) {
      aminoacid = ref[j];
      for (i of GENETIC_CODE) {
        if (i[1] === aminoacid) {
          result += i[0];
          break;
        }
      }
    }
    return result;
  };

  mapString = function(string, mapper) {
    var char;
    return ((function() {
      var j, len, results;
      results = [];
      for (j = 0, len = string.length; j < len; j++) {
        char = string[j];
        results.push(mapper(char));
      }
      return results;
    })()).join("");
  };

  makeComplimentaryDna = function(dna) {
    return mapString(dna, function(x) {
      return DNA_COMPLIMENTARY.get(x);
    });
  };

  makeInformationalRna = function(dna1) {
    return mapString(dna1, function(x) {
      return RNA_COMPLIMENTARY.get(x);
    });
  };

  makeDnaFromiRna = function(irna) {
    return mapString(irna, function(x) {
      return DNA_COMPLIMENTARY.get(x);
    });
  };

  makeTransferRna = function(irna) {
    return mapString(irna, function(x) {
      return RNA_COMPLIMENTARY.get(x);
    });
  };

  uniformSequence = function(dna) {
    return mapString(del(dna, " ", uniformNucleotide));
  };

  uniformNucleotide = function(nucleotide) {
    switch (nucleotide.toUpperCase()) {
      case "A":
        return "А";
      case "T":
        return "Т";
      case "G":
        return "Г";
      case "C":
        return "Ц";
      case "U":
        return "У";
      default:
        return nucleotide.toUpperCase();
    }
  };

  validateInput = function(type) {
    var aminoacid, aminoacids, checker, i, inputElement, j, k, len, len1, ref;
    lastInputType = type;
    clearError();
    if (type === INPUT_TYPE.PROTEIN) {
      aminoacids = formatProteinSequence(valueof("proteinInput").replace(/\-/g, '')).split("-");
      for (j = 0, len = aminoacids.length; j < len; j++) {
        aminoacid = aminoacids[j];
        if (!isValidAminoacid(aminoacid)) {
          logError(`Ошибка: неизвестная аминокислота '${aminoacid}'`, type);
          return;
        }
      }
      return document.mainForm.proteinInput.value = formatProteinSequence(valueof("proteinInput").replace(/\-/g, ''));
    } else {
      ({checker, inputElement} = getCheckerAndInputElement(type));
      ref = inputElement.value;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        i = ref[k];
        if (!checker(i)) {
          logError(`Ошибка: неожиданный символ '${i}'`, type);
          return;
        }
      }
      inputElement.value = formatOutput(inputElement.value);
      if (uniformSequence(inputElement.value).length % 3 !== 0) {
        return logError("Ошибка: неполный триплет", type);
      }
    }
  };

  getCheckerAndInputElement = function(inputType) {
    switch (inputType) {
      case 1:
        return {
          checker: isValidDnaChar,
          inputElement: element("dnaInput")
        };
      case 2:
        return {
          checker: isValidDnaChar,
          inputElement: element("dna2Input")
        };
      case 3:
        return {
          checker: isValidRnaChar,
          inputElement: element("irnaInput")
        };
      case 4:
        return {
          checker: isValidRnaChar,
          inputElement: element("trnaInput")
        };
      default:
        return {
          checker: isValidDnaChar,
          inputElement: element("dnaInput")
        };
    }
  };

  isValidAminoacid = function(aminoacid) {
    var isPart, normalizedAminoacid, ref, v;
    if (aminoacid.length === 0) {
      return true;
    }
    normalizedAminoacid = aminoacid.toUpperCase();
    ref = GENETIC_CODE.values();
    for (v of ref) {
      isPart = v.startsWith(normalizedAminoacid);
      if (isPart) {
        break;
      }
    }
    return isPart;
  };

  isValidDnaChar = function(char) {
    return indexOf.call(DNA_VALID_CHARS, char) >= 0;
  };

  isValidRnaChar = function(char) {
    return indexOf.call(RNA_VALID_CHARS, char) >= 0;
  };

  logError = function(message, inputType) {
    var logger;
    logger = (function() {
      switch (inputType) {
        case INPUT_TYPE.DNA1:
          return element("dna1err");
        case INPUT_TYPE.DNA2:
          return element("dna2err");
        case INPUT_TYPE.IRNA:
          return element("irnaerr");
        case INPUT_TYPE.TRNA:
          return element("trnaerr");
        case INPUT_TYPE.PROTEIN:
          return element("proteinerr");
      }
    })();
    return logger.innerHTML = message;
  };

  clearError = function() {
    var i, j, results;
    results = [];
    for (i = j = 1; j <= 5; i = ++j) {
      results.push(logError("", i));
    }
    return results;
  };

  formatOutput = function(sequence) {
    var currentTriplet, i, index, j, len, ref, triplets;
    triplets = [];
    currentTriplet = "";
    index = 0;
    ref = uniformSequence(sequence);
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      currentTriplet += i;
      index++;
      if (index === 3) {
        triplets.push(currentTriplet);
        currentTriplet = "";
        index = 0;
      }
    }
    if (currentTriplet.length > 0) {
      triplets.push(currentTriplet);
    }
    return triplets.join(" ");
  };

  formatProteinSequence = function(sequence) {
    var currentTriplet, i, index, j, len, ref, triplets;
    triplets = [];
    currentTriplet = "";
    index = 0;
    ref = sequence.toUpperCase();
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      currentTriplet += i;
      index++;
      if ((index === 3 && currentTriplet !== "СТО") || (index === 4)) {
        triplets.push(currentTriplet);
        currentTriplet = "";
        index = 0;
      }
    }
    if (currentTriplet.length > 0) {
      triplets.push(currentTriplet);
    }
    return triplets.join("-");
  };

  ({valueset, valueof, element, del} = document.flexibel);

  element("dnaInput").addEventListener("input", function() {
    return validateInput(INPUT_TYPE.DNA1);
  });

  element("dna2Input").addEventListener("input", function() {
    return validateInput(INPUT_TYPE.DNA2);
  });

  element("irnaInput").addEventListener("input", function() {
    return validateInput(INPUT_TYPE.IRNA);
  });

  element("trnaInput").addEventListener("input", function() {
    return validateInput(INPUT_TYPE.TRNA);
  });

  element("proteinInput").addEventListener("input", function() {
    return validateInput(INPUT_TYPE.PROTEIN);
  });

  element("runButton").addEventListener("click", runApplication);

}).call(this);


//# sourceMappingURL=complementarity.js.map
//# sourceURL=coffeescript