/*
	Complementarity application
	Autor: Tsvikevich Denis 2019
*/

const DNA_VALID_CHARS = "ATGCatgcАТГЦатгц ";
const RNA_VALID_CHARS = "AUGCaugcАУГЦаугц ";

const DNA_COMPLIMENTARITY_SCHEME = new Map([
  ["А", "Т"],
  ["Т", "А"],
  ["Г", "Ц"],
  ["У", "А"],
  ["Ц", "Г"]
]);

const RNA_COMPLIMENTARITY_SCHEME = new Map([
  ["А", "У"],
  ["Т", "А"],
  ["У", "А"],
  ["Г", "Ц"],
  ["Ц", "Г"]
]);

const GENETIC_CODE = new Map([
  ["УУУ", "ФЕН"],
  ["УУЦ", "ФЕН"],
  ["УУА", "ЛЕЙ"],
  ["УЦУ", "СЕР"],
  ["УЦЦ", "СЕР"],
  ["УЦА", "СЕР"],
  ["УЦГ", "СЕР"],
  ["УАУ", "ТИР"],
  ["УАЦ", "ТИР"],
  ["УАА", "СТОП"],
  ["УАГ", "СТОП"],
  ["УГУ", "ЦИС"],
  ["УГЦ", "ЦИС"],
  ["УГА", "СТОП"],
  ["УГГ", "ТРИ"],
  ["ЦУУ", "ЛЕЙ"],
  ["ЦУЦ", "ЛЕЙ"],
  ["ЦУА", "ЛЕЙ"],
  ["ЦУГ", "ЛЕЙ"],
  ["ЦЦУ", "ПРО"],
  ["ЦЦЦ", "ПРО"],
  ["ЦЦА", "ПРО"],
  ["ЦЦГ", "ПРО"],
  ["ЦАУ", "ГИС"],
  ["ЦАЦ", "ГИС"],
  ["ЦАА", "ГЛУ"],
  ["ЦАГ", "ГЛУ"],
  ["ЦГУ", "АРГ"],
  ["ЦГЦ", "АРГ"],
  ["ЦГА", "АРГ"],
  ["ЦГГ", "АРГ"],
  ["АУУ", "ИЛЕ"],
  ["АУЦ", "ИЛЕ"],
  ["АУА", "ИЛЕ"],
  ["АУГ", "МЕТ"],
  ["ГУУ", "ВАЛ"],
  ["ГУЦ", "ВАЛ"],
  ["ГУА", "ВАЛ"],
  ["ГУГ", "ВАЛ"],
  ["АЦУ", "ТРЕ"],
  ["АЦЦ", "ТРЕ"],
  ["АЦА", "ТРЕ"],
  ["АЦГ", "ТРЕ"],
  ["ГЦУ", "АЛА"],
  ["ГЦЦ", "АЛА"],
  ["ГЦА", "АЛА"],
  ["ГЦГ", "АЛА"],
  ["ААУ", "АСН"],
  ["ААЦ", "АСН"],
  ["ААА", "ЛИЗ"],
  ["ААГ", "ЛИЗ"],
  ["ГАУ", "АСП"],
  ["ГАЦ", "АСП"],
  ["ГАА", "ГЛУ"],
  ["ГАГ", "ГЛУ"],
  ["АГУ", "СЕР"],
  ["АГЦ", "СЕР"],
  ["АГА", "АРГ"],
  ["АГГ", "АРГ"],
  ["ГГУ", "ГЛИ"],
  ["ГГЦ", "ГЛИ"],
  ["ГГА", "ГЛИ"],
  ["ГГГ", "ГЛИ"],
]);

enum INPUT_TYPE {
  DNA1 = "ДНК 1",
  DNA2 = "ДНК 2",
  IRNA = "иРНК",
  TRNA = "тРНК",
  PROTEIN = "белку"
};

let runButton = document.getElementById("runButton");

let lastInputType = { inputType: INPUT_TYPE.DNA1 };

function setLastInputType(inputType) {
  lastInputType.inputType = inputType;
  runButton.innerText = "Построить по " + inputType;
}

function updateFields(result) {
  $("#dnaInput").val(formatOutput(result.firstDna));
  $( "#dna2Input").val( formatOutput (result.secondDna));
  $( "#irnaInput").val( formatOutput (result.informationalRna));
  $( "#trnaInput").val( formatOutput (result.transferRna));
  $( "#proteinInput").val( result.protein);
}

function runApplication() {
  switch (lastInputType.inputType) {
    case INPUT_TYPE.DNA1:
      updateFields(buildByDnaOne());
      return;
    case INPUT_TYPE.DNA2:
      updateFields(buildByDnaTwo());
      return;
    case INPUT_TYPE.IRNA:
      updateFields(buildByInformationalRna());
      return;
    case INPUT_TYPE.TRNA:
      updateFields(buildByTransferRna());
      return;
    case INPUT_TYPE.PROTEIN:
      updateFields(buildByProtein());
      return;
  }
}

function buildByDnaOne() {
  let firstDna = uniformSequence($("#dnaInput").val());
  let secondDna = makeComplimentaryDna(firstDna);
  let informationalRna = makeInformationalRna(firstDna);
  let transferRna = makeTransferRna(informationalRna);
  let protein = makeProteinFromInformationalRna(informationalRna);

  return { firstDna, secondDna, informationalRna, transferRna, protein };
}

function buildByDnaTwo() {
  let secondDna = uniformSequence($("#dna2Input").val());
  let firstDna = makeComplimentaryDna(secondDna);
  let informationalRna = makeInformationalRna(firstDna);
  let transferRna = makeTransferRna(informationalRna);
  let protein = makeProteinFromInformationalRna(informationalRna);

  return { firstDna, secondDna, informationalRna, transferRna, protein };
}

function buildByInformationalRna() {
  let informationalRna = uniformSequence ($( "irnaInput").val());
  let firstDna = makeDnaFromiRna(informationalRna);
  let secondDna = makeComplimentaryDna(firstDna);
  let transferRna = makeTransferRna(informationalRna);
  let protein = makeProteinFromInformationalRna(informationalRna);

  return { firstDna, secondDna, informationalRna, transferRna, protein };
}

function buildByTransferRna() {
  let transferRna = uniformSequence ($( "trnaInput").val());
  let secondDna = makeDnaFromiRna(transferRna);
  let firstDna = makeComplimentaryDna(secondDna);
  let informationalRna = makeInformationalRna(firstDna);
  let protein = makeProteinFromInformationalRna(informationalRna);

  return { firstDna, secondDna, informationalRna, transferRna, protein };
}

function buildByProtein () {
  let protein = $("proteinInput").val();
  let informationalRna = makeInformationalRnaFromProtein(protein);
  let firstDna = makeDnaFromiRna(informationalRna);
  let secondDna = makeComplimentaryDna(firstDna);
  let transferRna = makeTransferRna(informationalRna);

  return { firstDna, secondDna, informationalRna, transferRna, protein };
}

function makeProteinFromInformationalRna(irna: string): string {
  function divideIntoTriplets(irna: string): string[] {
    let triplets: string[] = [];

    let currentTriplet = "";
    let index = 0;
    for (let i of irna) {
      currentTriplet += i;
      index++

      if (index === 3) {
        triplets.push(currentTriplet);

        currentTriplet = "";
        index = 0;
      }
    }

    return triplets;
}
  return divideIntoTriplets(irna)
    .map((x) => GENETIC_CODE.get(x))
    .join("-")
}

function makeInformationalRnaFromProtein(protein: string): string {
  let result = ""

	for (let aminoacid in protein.split("-")) {
    for (let i of GENETIC_CODE) {
      if (i[1] === aminoacid) {
        result += i[0]
        break
      }
    }
  }

  return result;
}

function mapString(string: string, mapper: (char: string) => string) {
  let chars = [];
  for (let char of string) {
    chars.push(mapper(char));
  }
  return chars.join("");
}

function makeComplimentaryDna(dna: string): string {
  return mapString(dna, (x) => DNA_COMPLIMENTARITY_SCHEME.get(x))
}

function makeInformationalRna(dna1: string): string {
  return mapString(dna1, (x) => RNA_COMPLIMENTARITY_SCHEME.get(x))
}

function makeDnaFromiRna(irna: string): string {
  return mapString(irna, (x) => DNA_COMPLIMENTARITY_SCHEME.get(x))
}

function makeTransferRna(irna: string): string {
  return mapString(irna, (x) => RNA_COMPLIMENTARITY_SCHEME.get(x))
}

function uniformSequence(dna: string): string {
  return mapString(delws(dna), uniformNucleotide)
}

function uniformNucleotide(nucleotide) {
  switch (nucleotide.toUpperCase()) {
    case "A": return "А";
    case "T": return "Т";
    case "G": return "Г";
    case "C": return "Ц";
    case "U": return "У";
    default:
  return nucleotide.toUpperCase();
}
}

function validateInput (type) {
  setLastInputType(type);
  clearError();

  if (type === INPUT_TYPE.PROTEIN) {
    let formatedInput = formatProteinSequence(($("#proteinInput").val() as string).replace(/\-/g, ''))
    
    for (let aminoacid of formatedInput.split("-")) {
      if (!isValidAminoacid(aminoacid)) {
        return logError("Ошибка: неизвестная аминокислота '#{aminoacid}'", type);
      }
    }

    document.mainForm.proteinInput.value = formatedInput
  } else
    let { checker, inputElement } = getCheckerAndInputElement(type);

  for (let i of inputElement.value) {
    if (!checker(i)) {
      return logError("Ошибка: неожиданный символ '#{i}'", type);
    }
  }
  inputElement.value = formatOutput(delws(inputElement.value));

  if (uniformSequence(inputElement.value).length % 3 !== 0) {
    logError("Ошибка: неполный триплет", type)
  }
}

function getCheckerAndInputElement(inputType) {
  switch (inputType) {
    case INPUT_TYPE.DNA1:
      return { checker: isValidDnaChar, inputElement: $("#dnaInput") };
    case INPUT_TYPE.DNA2:
      return { checker: isValidDnaChar, inputElement: $( "#dna2Input") };
    case INPUT_TYPE.IRNA:
      return { checker: isValidRnaChar, inputElement: $( "#irnaInput") };
    case INPUT_TYPE.TRNA:
      return { checker: isValidRnaChar, inputElement: $( "#trnaInput") };
    default:
      return { checker: isValidDnaChar, inputElement: $( "#dnaInput" )};
  }
}

function isValidAminoacid (aminoacid) {
  if (aminoacid.length === 0) {
    return true;
  }

  let normalizedAminoacid = aminoacid.toUpperCase();

  for (let v of GENETIC_CODE.values()) {
    var isPart = v.startsWith(normalizedAminoacid);
    if (isPart) {
      break;
    }
  }

  return isPart;
}

function isValidDnaChar(char) {
  return DNA_VALID_CHARS.includes(char);
}
function isValidRnaChar(char) {
  return RNA_VALID_CHARS.includes(char);
}

logError = (message, inputType) ->
	logger = switch inputType
		when INPUT_TYPE.DNA1 then element "dna1err"
		when INPUT_TYPE.DNA2 then element "dna2err"
		when INPUT_TYPE.IRNA then element "irnaerr"
		when INPUT_TYPE.TRNA then element "trnaerr"
		when INPUT_TYPE.PROTEIN then element "proteinerr"

	logger.innerHTML = message

clearError = () ->
	logError "", i for i in [1..5]

formatOutput = (sequence) ->
	triplets = []

	currentTriplet = ""
	index = 0
	for i in uniformSequence sequence
		currentTriplet += i
		index++

		if index == 3
			triplets.push currentTriplet
			currentTriplet = ""
			index = 0

	triplets.push currentTriplet if currentTriplet.length > 0

	triplets.join " "

formatProteinSequence = (sequence) ->
	triplets = []

	currentTriplet = ""
	index = 0
	for i in sequence.toUpperCase()
		currentTriplet += i
		index++

		if (index == 3 and currentTriplet != "СТО") or (index == 4)
			triplets.push currentTriplet
			currentTriplet = ""
			index = 0

	triplets.push currentTriplet if currentTriplet.length > 0
	
	triplets.join "-"

document.getElementById "dnaInput"
	.addEventListener("input", -> validateInput INPUT_TYPE.DNA1)
document.getElementById "dna2Input"
	.addEventListener("input", -> validateInput INPUT_TYPE.DNA2)
document.getElementById "irnaInput"
	.addEventListener("input", -> validateInput INPUT_TYPE.IRNA)
document.getElementById "trnaInput"
	.addEventListener("input", -> validateInput INPUT_TYPE.TRNA)
document.getElementById "proteinInput"
	.addEventListener("input", -> validateInput INPUT_TYPE.PROTEIN)
document.getElementById "runButton"
	.addEventListener("click", runApplication)
document.getElementById "buildByDna1Button"
	.addEventListener("click", () -> updateFields(buildByDnaOne()))
document.getElementById "buildByDna2Button"
	.addEventListener("click", () -> updateFields(buildByDnaTwo()))
document.getElementById "buildByiRnaButton"
	.addEventListener("click", () -> updateFields(buildByInformationalRna()))
document.getElementById "buildBytRnaButton"
	.addEventListener("click", () -> updateFields(buildByTransferRna()))
document.getElementById "buildByProteinButton"
	.addEventListener("click", () -> updateFields(buildByProtein()))