/*
  Complementarity application
  Autor: Tsvikevich Denis 2019
*/

type DnaChar = "A" | "T" | "G" | "C" | "А" | "Т" | "Г" | "Ц";
type RnaChar = "A" | "U" | "G" | "C" | "А" | "У" | "Г" | "Ц";
type SequenceChar = DnaChar | RnaChar;

type RnaTriplet = string;
type DnaTriplet = string;
type Triplet = RnaTriplet | DnaTriplet;
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
  DNA1 = "firstDna",
  DNA2 = "secondDna",
  IRNA = "informationalRna",
  TRNA = "transferRna",
  PROTEIN = "protein"
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

const GENETIC_CODE = new Map<RnaTriplet, Aminoacid>([
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
runButton.innerText = getTextForButton(InputType.DNA1);

let lastInputType = InputType.DNA1;

function setLastInputType(inputType: InputType): void {
  lastInputType = inputType;
  runButton.innerText = getTextForButton(inputType);
}

function getTextForButton(inputType: InputType): string {
  switch (inputType) {
    case InputType.DNA1:
      return "Построить по ДНК 1";
    case InputType.DNA2:
      return "Построить по ДНК 2";
    case InputType.IRNA:
      return "Построить по иРНК";
    case InputType.TRNA:
      return "Построить по тРНК";
    case InputType.PROTEIN:
      return "Построить по белку";
  }
}

function updateFields(result: Result): void {
  document.querySelector<HTMLInputElement>("#firstDnaInput").value =
    formatOutput(result.firstDna);
  document.querySelector<HTMLInputElement>("#secondDnaInput").value =
    formatOutput(result.secondDna);
  document.querySelector<HTMLInputElement>("#informationalRnaInput").value =
    formatOutput(result.informationalRna);
  document.querySelector<HTMLInputElement>("#transferRnaInput").value =
    formatOutput(result.transferRna);
  document.querySelector<HTMLInputElement>("#proteinInput").value =
    result.protein;
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
  let firstDna = uniformSequence(document.querySelector<HTMLInputElement>("#firstDnaInput").value);
  let secondDna = makeComplimentaryDna(firstDna);
  let informationalRna = makeInformationalRna(firstDna);
  let transferRna = makeTransferRna(informationalRna);
  let protein = makeProteinFromInformationalRna(informationalRna);

  return { firstDna, secondDna, informationalRna, transferRna, protein };
}

function buildByDnaTwo(): Result {
  let secondDna = uniformSequence(document.querySelector<HTMLInputElement>("#secondDnaInput").value);
  let firstDna = makeComplimentaryDna(secondDna);
  let informationalRna = makeInformationalRna(firstDna);
  let transferRna = makeTransferRna(informationalRna);
  let protein = makeProteinFromInformationalRna(informationalRna);

  return { firstDna, secondDna, informationalRna, transferRna, protein };
}

function buildByInformationalRna(): Result {
  let informationalRna = uniformSequence(document.querySelector<HTMLInputElement>("#informationalRnaInput").value);
  let firstDna = makeDnaFromiRna(informationalRna);
  let secondDna = makeComplimentaryDna(firstDna);
  let transferRna = makeTransferRna(informationalRna);
  let protein = makeProteinFromInformationalRna(informationalRna);

  return { firstDna, secondDna, informationalRna, transferRna, protein };
}

function buildByTransferRna(): Result {
  let transferRna = uniformSequence(document.querySelector<HTMLInputElement>("#transferRnaInput").value);
  let secondDna = makeDnaFromiRna(transferRna);
  let firstDna = makeComplimentaryDna(secondDna);
  let informationalRna = makeInformationalRna(firstDna);
  let protein = makeProteinFromInformationalRna(informationalRna);

  return { firstDna, secondDna, informationalRna, transferRna, protein };
}

function buildByProtein(): Result {
  let protein = formatProteinSequence(document.querySelector<HTMLInputElement>("#proteinInput").value);
  let informationalRna = makeInformationalRnaFromProtein(protein);
  let firstDna = makeDnaFromiRna(informationalRna);
  let secondDna = makeComplimentaryDna(firstDna);
  let transferRna = makeTransferRna(informationalRna);

  return { firstDna, secondDna, informationalRna, transferRna, protein };
}

function makeProteinFromInformationalRna(irna: InformationalRna): Protein {
  function divideIntoTriplets(irna: InformationalRna): RnaTriplet[] {
    let triplets: RnaTriplet[] = [];

    let currentTriplet: RnaTriplet = "";
    for (let nucleotide of irna) {
      currentTriplet += nucleotide;

      if (currentTriplet.length === 3) {
        triplets.push(currentTriplet);
        currentTriplet = "";
      }
    }

    return triplets;
  }

  return divideIntoTriplets(irna)
    .map((x) => GENETIC_CODE.get(x))
    .join("-")
}

function makeInformationalRnaFromProtein(protein: Protein): InformationalRna {
  let result: InformationalRna = "";

  for (const requiredAminoacid of protein.split(" ")) {
    for (const [triplet, aminoacid] of GENETIC_CODE) {
      if (aminoacid === requiredAminoacid) {
        result += triplet;
        break;
      }
    }
  }

  return result;
}

function mapString(string: string, mapper: (char: string) => string): string {
  let chars: string[] = [];

  for (let char of string) {
    chars.push(mapper(char));
  }

  return chars.join("");
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

function delws(str: string): string {
  return str.replace(/\s+/g, "");
}

function uniformSequence(seq: string): string {
  return mapString(delws(seq), uniformNucleotide)
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

function validateInput(inputType: InputType): boolean {
  setLastInputType(inputType);
  clearError();

  if (inputType === InputType.PROTEIN) {
    const formatedInput = formatProteinSequence(
      document.querySelector<HTMLInputElement>("#proteinInput").value.replace("-", ""));

    for (const aminoacid of formatedInput.split(" ")) {
      if (!isValidAminoacid(aminoacid)) {
        logError(`Ошибка: неизвестная аминокислота '${aminoacid}'`, inputType);
        return false;
      }
    }

    (document.getElementById("proteinInput") as HTMLInputElement).value = formatedInput
    return true;
  }

  let { checker, inputElement } = getCheckerAndInputElement(inputType);

  for (let i of inputElement.value) {
    if (!checker(i)) {
      logError(`Ошибка: неожиданный символ '${i}'`, inputType);
      return false;
    }
  }

  inputElement.value = formatOutput(delws(inputElement.value));


  if (uniformSequence(inputElement.value).length % 3 !== 0) {
    logError("Ошибка: неполный триплет", inputType)
    return false;
  }

  return true;
}

function getCheckerAndInputElement(inputType) {
  switch (inputType) {
    case InputType.DNA1:
      return { checker: isValidDnaChar, inputElement: <HTMLInputElement>document.querySelector("#firstDnaInput") };
    case InputType.DNA2:
      return { checker: isValidDnaChar, inputElement: <HTMLInputElement>document.querySelector("#secondDnaInput") };
    case InputType.IRNA:
      return { checker: isValidRnaChar, inputElement: <HTMLInputElement>document.querySelector("#informationalRnaInput") };
    case InputType.TRNA:
      return { checker: isValidRnaChar, inputElement: <HTMLInputElement>document.querySelector("#transferRnaInput") };
    default:
      throw new Error("impossible value");
  }
}

function isValidAminoacid(aminoacid: Aminoacid): boolean {
  if (aminoacid.length === 0) {
    return true;
  }

  let normalizedAminoacid = aminoacid.toUpperCase();
  for (const currentAminoacid of GENETIC_CODE.values()) {
    if (currentAminoacid.startsWith(normalizedAminoacid)) {
      return true;
    }
  }

  return false;
}

function isValidDnaChar(char: string) {
  return DNA_VALID_CHARS.includes(char);
}
function isValidRnaChar(char: string) {
  return RNA_VALID_CHARS.includes(char);
}

function getErrorLogByInputType(inputType: InputType): HTMLSpanElement {
  return document.getElementById(inputType + "ErrorLog");
}

function logError(message: string, inputType: InputType) {
  let logger = getErrorLogByInputType(inputType);
  logger.innerText = message
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

function formatProteinSequence(sequence: Protein): Protein {
  let triplets = [];

  let currentTriplet = ""
  for (let i of delws(sequence).toUpperCase()) {
    currentTriplet += i;

    if ((currentTriplet.length == 3 && currentTriplet != "СТО") || (currentTriplet.length == 4)) {
      triplets.push(currentTriplet);
      currentTriplet = "";
    }
  }

  if (currentTriplet.length > 0) {
    triplets.push(currentTriplet);
  }

  return triplets.join(" ");
}

document.getElementById("firstDnaInput")
  .addEventListener("input", () => validateInput(InputType.DNA1))
document.getElementById("secondDnaInput")
  .addEventListener("input", () => validateInput(InputType.DNA2))
document.getElementById("informationalRnaInput")
  .addEventListener("input", () => validateInput(InputType.IRNA))
document.getElementById("transferRnaInput")
  .addEventListener("input", () => validateInput(InputType.TRNA))
document.getElementById("proteinInput")
  .addEventListener("input", () => validateInput(InputType.PROTEIN))
document.getElementById("runButton")
  .addEventListener("click", runApplication)