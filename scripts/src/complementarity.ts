/*
  Complementarity application
  Autor: Tsvikevich Denis 2019
*/

type DnaChar = "A" | "T" | "G" | "C" | "А" | "Т" | "Г" | "Ц";
type RnaChar = "A" | "U" | "G" | "C" | "А" | "У" | "Г" | "Ц";
type SequenceChar = DnaChar | RnaChar;

type RnaTriplet = string;
type DnaTriplet = string;
type Triplet = RnaTriplet;
type Aminoacid = string;

type Protein = string;
type InformationalRna = string;
type TransferRna = string;
type Dna = string;

type NucleotideSequence = InformationalRna | TransferRna | Dna;

type Result = {
  firstDna: Dna,
  secondDna: Dna,
  informationalRna: InformationalRna,
  transferRna: TransferRna,
  protein: Protein
};

enum InputType {
  DNA1 = "ДНК 1",
  DNA2 = "ДНК 2",
  IRNA = "иРНК",
  TRNA = "тРНК",
  PROTEIN = "белку"
};

const DNA_VALID_CHARS = "ATGCatgcАТГЦатгц ";
const RNA_VALID_CHARS = "AUGCaugcАУГЦаугц ";

const DNA_COMPLIMENTARITY_SCHEME = new Map<SequenceChar, DnaChar>([
   ["А", "Т"],
   ["Т", "А"],
   ["Г", "Ц"],
   ["У", "А"],
   ["Ц", "Г"]
]);

const RNA_COMPLIMENTARITY_SCHEME = new Map<SequenceChar, RnaChar>([
  ["А", "У"],
  ["Т", "А"],
  ["У", "А"],
  ["Г", "Ц"],
  ["Ц", "Г"]
]);

const GENETIC_CODE = new Map<Triplet, Aminoacid>([
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

let runButton = document.getElementById("runButton");

var lastInputType = InputType.DNA1;

function setLastInputType(inputType: InputType): void {
  lastInputType = inputType;
  runButton.innerText = "Построить по " + inputType;
}

function updateFields(result: Result): void {
  $("#dnaInput").val(formatOutput(result.firstDna));
  $("#dna2Input").val(formatOutput(result.secondDna));
  $("#irnaInput").val(formatOutput(result.informationalRna));
  $("#trnaInput").val(formatOutput(result.transferRna));
  $("#proteinInput").val(result.protein);
}

function runApplication() {
  switch (lastInputType) {
    case InputType.DNA1:
      updateFields(buildByDnaOne());
      return;
    case InputType.DNA2:
      updateFields(buildByDnaTwo());
      return;
    case InputType.IRNA:
      updateFields(buildByInformationalRna());
      return;
    case InputType.TRNA:
      updateFields(buildByTransferRna());
      return;
    case InputType.PROTEIN:
      updateFields(buildByProtein());
      return;
  }
}

function buildByDnaOne(): Result {
  let firstDna: Dna =
    uniformSequence<Dna>((document.getElementById("dnaInput") as HTMLInputElement).value);
  let secondDna = makeComplimentaryDna(firstDna);
  let informationalRna = makeInformationalRna(firstDna);
  let transferRna = makeTransferRna(informationalRna);
  let protein = makeProteinFromInformationalRna(informationalRna);

  return { firstDna, secondDna, informationalRna, transferRna, protein };
}

function buildByDnaTwo(): Result {
  let secondDna = uniformSequence($("#dna2Input").val() as string);
  let firstDna = makeComplimentaryDna(secondDna);
  let informationalRna = makeInformationalRna(firstDna);
  let transferRna = makeTransferRna(informationalRna);
  let protein = makeProteinFromInformationalRna(informationalRna);

  return { firstDna, secondDna, informationalRna, transferRna, protein };
}

function buildByInformationalRna(): Result {
  let informationalRna = uniformSequence($("#irnaInput").val() as string);
  let firstDna = makeDnaFromiRna(informationalRna);
  let secondDna = makeComplimentaryDna(firstDna);
  let transferRna = makeTransferRna(informationalRna);
  let protein = makeProteinFromInformationalRna(informationalRna);

  return { firstDna, secondDna, informationalRna, transferRna, protein };
}

function buildByTransferRna(): Result {
  let transferRna = uniformSequence($("#trnaInput").val() as string);
  let secondDna = makeDnaFromiRna(transferRna);
  let firstDna = makeComplimentaryDna(secondDna);
  let informationalRna = makeInformationalRna(firstDna);
  let protein = makeProteinFromInformationalRna(informationalRna);

  return { firstDna, secondDna, informationalRna, transferRna, protein };
}

function buildByProtein(): Result {
  let protein = <Protein>(document.getElementById("proteinInput") as HTMLInputElement).value;
  let informationalRna = makeInformationalRnaFromProtein(protein);
  let firstDna = makeDnaFromiRna(informationalRna);
  let secondDna = makeComplimentaryDna(firstDna);
  let transferRna = makeTransferRna(informationalRna);

  return { firstDna, secondDna, informationalRna, transferRna, protein };
}

function makeProteinFromInformationalRna(irna: InformationalRna): Protein {
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
  let result = "";

  for (let aminoacid in protein.split("-")) {
    for (let i of GENETIC_CODE) {
      if (i[1] === aminoacid) {
        result += i[0];
        break;
      }
    }
  }

  return result;
}

function mapString<T extends string>(string: T, mapper: (char: string) => T): T {
  let chars: T[] = [];
  for (let char of string) {
    chars.push(mapper(char));
  }
  return chars.join("") as T;
}

function makeComplimentaryDna(dna: Dna): Dna {
  return mapString(dna, (x: DnaChar) => DNA_COMPLIMENTARITY_SCHEME.get(x))
}

function makeInformationalRna(dna1: Dna): InformationalRna {
  return mapString(dna1, (x: DnaChar) => RNA_COMPLIMENTARITY_SCHEME.get(x))
}

function makeDnaFromiRna(irna: InformationalRna): Dna {
  return mapString(irna, (x: RnaChar) => DNA_COMPLIMENTARITY_SCHEME.get(x))
}

function makeTransferRna(irna: InformationalRna): TransferRna {
  return mapString(irna, (x: RnaChar) => RNA_COMPLIMENTARITY_SCHEME.get(x))
}

function delws<T extends string>(str: T): T {
  return str.replace(/\s+/g, "") as T;
}

function uniformSequence<T extends NucleotideSequence>(seq: T): T {
  return mapString<T>(delws(seq), uniformNucleotide)
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

function validateInput(type) {
  setLastInputType(type);
  clearError();

  if (type === InputType.PROTEIN) {
    let formatedInput = formatProteinSequence(($("#proteinInput").val() as string).replace(/\-/g, ''))

    for (let aminoacid of formatedInput.split("-")) {
      if (!isValidAminoacid(aminoacid)) {
        return logError(`Ошибка: неизвестная аминокислота '${aminoacid}'`, type);
      }
    }

    (document.getElementById("proteinInput") as HTMLInputElement).value = formatedInput
  } else {
    let { checker, inputElement } = getCheckerAndInputElement(type);

    for (let i of inputElement.value) {
      if (!checker(i)) {
        return logError(`Ошибка: неожиданный символ '${i}'`, type);
      }
    }

    inputElement.value = formatOutput(delws(inputElement.value));


    if (uniformSequence(inputElement.value).length % 3 !== 0) {
      logError("Ошибка: неполный триплет", type)
    }
  }
}

function getCheckerAndInputElement(inputType) {
  switch (inputType) {
    case InputType.DNA1:
      return { checker: isValidDnaChar, inputElement: <HTMLInputElement>document.querySelector("#dnaInput") };
    case InputType.DNA2:
      return { checker: isValidDnaChar, inputElement: <HTMLInputElement>document.querySelector("#dna2Input") };
    case InputType.IRNA:
      return { checker: isValidRnaChar, inputElement: <HTMLInputElement>document.querySelector("#irnaInput") };
    case InputType.TRNA:
      return { checker: isValidRnaChar, inputElement: <HTMLInputElement>document.querySelector("#trnaInput") };
    default:
      return { checker: isValidDnaChar, inputElement: <HTMLInputElement>document.querySelector("#dnaInput") };
  }
}

function isValidAminoacid(aminoacid) {
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

function logError(message, inputType) {
  let logger;

  switch (inputType) {
    case InputType.DNA1:
      logger = document.querySelector("#dna1err");
    case InputType.DNA2:
      logger = document.querySelector("#dna2err");
    case InputType.IRNA:
      logger = document.querySelector("#irnaerr");
    case InputType.TRNA:
      logger = document.querySelector("#trnaerr");
    case InputType.PROTEIN:
      logger = document.querySelector("#proteinerr");
  }

  logger.innerHTML = message
}

function clearError() {
  for (let x of [InputType.DNA1, InputType.DNA2, InputType.IRNA, InputType.PROTEIN, InputType.TRNA]) {
    logError("", x);
  }
}

function formatOutput(sequence) {
  let triplets = [];

  let currentTriplet = ""
  let index = 0;
  for (let i of uniformSequence(sequence)) {
    currentTriplet += i;
    index++;

    if (index == 3) {
      triplets.push(currentTriplet);
      currentTriplet = "";
      index = 0;
    }
  }

  if (currentTriplet.length > 0) {
    triplets.push(currentTriplet);
  }

  return triplets.join(" ");
}

function formatProteinSequence(sequence) {
  let triplets = [];

  let currentTriplet = ""
  let index = 0;
  for (let i of sequence.toUpperCase()) {
    currentTriplet += i;
    index++;

    if ((index == 3 && currentTriplet != "СТО") || (index == 4)) {
      triplets.push(currentTriplet);
      currentTriplet = "";
      index = 0;
    }
  }

  if (currentTriplet.length > 0) {
    triplets.push(currentTriplet);
  }

  return triplets.join(" ");
}

document.getElementById("dnaInput")
  .addEventListener("input", () => validateInput(InputType.DNA1))
document.getElementById("dna2Input")
  .addEventListener("input", () => validateInput(InputType.DNA2))
document.getElementById("irnaInput")
  .addEventListener("input", () => validateInput(InputType.IRNA))
document.getElementById("trnaInput")
  .addEventListener("input", () => validateInput(InputType.TRNA))
document.getElementById("proteinInput")
  .addEventListener("input", () => validateInput(InputType.PROTEIN))
document.getElementById("runButton")
  .addEventListener("click", runApplication)
document.getElementById("buildByDna1Button")
  .addEventListener("click", () => updateFields(buildByDnaOne()))
document.getElementById("buildByDna2Button")
  .addEventListener("click", () => updateFields(buildByDnaTwo()))
document.getElementById("buildByiRnaButton")
  .addEventListener("click", () => updateFields(buildByInformationalRna()))
document.getElementById("buildBytRnaButton")
  .addEventListener("click", () => updateFields(buildByTransferRna()))
document.getElementById("buildByProteinButton")
  .addEventListener("click", () => updateFields(buildByProtein()))