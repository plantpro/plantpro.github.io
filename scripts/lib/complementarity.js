/*
  Complementarity application
  Autor: Tsvikevich Denis 2019
*/
var InputType;
(function (InputType) {
    InputType["DNA1"] = "firstDna";
    InputType["DNA2"] = "secondDna";
    InputType["IRNA"] = "informationalRna";
    InputType["TRNA"] = "transferRna";
    InputType["PROTEIN"] = "protein";
})(InputType || (InputType = {}));
;
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
let runButton = document.getElementById("runButton");
runButton.innerText = getTextForButton(InputType.DNA1);
let lastInputType = InputType.DNA1;
function setLastInputType(inputType) {
    lastInputType = inputType;
    runButton.innerText = getTextForButton(inputType);
}
function getTextForButton(inputType) {
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
function updateFields(result) {
    document.querySelector("#firstDnaInput").value =
        formatOutput(result.firstDna);
    document.querySelector("#secondDnaInput").value =
        formatOutput(result.secondDna);
    document.querySelector("#informationalRnaInput").value =
        formatOutput(result.informationalRna);
    document.querySelector("#transferRnaInput").value =
        formatOutput(result.transferRna);
    document.querySelector("#proteinInput").value =
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
function buildByDnaOne() {
    let firstDna = uniformSequence(document.querySelector("#firstDnaInput").value);
    let secondDna = makeComplimentaryDna(firstDna);
    let informationalRna = makeInformationalRna(firstDna);
    let transferRna = makeTransferRna(informationalRna);
    let protein = makeProteinFromInformationalRna(informationalRna);
    return { firstDna, secondDna, informationalRna, transferRna, protein };
}
function buildByDnaTwo() {
    let secondDna = uniformSequence(document.querySelector("#secondDnaInput").value);
    let firstDna = makeComplimentaryDna(secondDna);
    let informationalRna = makeInformationalRna(firstDna);
    let transferRna = makeTransferRna(informationalRna);
    let protein = makeProteinFromInformationalRna(informationalRna);
    return { firstDna, secondDna, informationalRna, transferRna, protein };
}
function buildByInformationalRna() {
    let informationalRna = uniformSequence(document.querySelector("#informationalRnaInput").value);
    let firstDna = makeDnaFromiRna(informationalRna);
    let secondDna = makeComplimentaryDna(firstDna);
    let transferRna = makeTransferRna(informationalRna);
    let protein = makeProteinFromInformationalRna(informationalRna);
    return { firstDna, secondDna, informationalRna, transferRna, protein };
}
function buildByTransferRna() {
    let transferRna = uniformSequence(document.querySelector("#transferRnaInput").value);
    let secondDna = makeDnaFromiRna(transferRna);
    let firstDna = makeComplimentaryDna(secondDna);
    let informationalRna = makeInformationalRna(firstDna);
    let protein = makeProteinFromInformationalRna(informationalRna);
    return { firstDna, secondDna, informationalRna, transferRna, protein };
}
function buildByProtein() {
    let protein = formatProteinSequence(document.querySelector("#proteinInput").value);
    let informationalRna = makeInformationalRnaFromProtein(protein);
    let firstDna = makeDnaFromiRna(informationalRna);
    let secondDna = makeComplimentaryDna(firstDna);
    let transferRna = makeTransferRna(informationalRna);
    return { firstDna, secondDna, informationalRna, transferRna, protein };
}
function makeProteinFromInformationalRna(irna) {
    function divideIntoTriplets(irna) {
        let triplets = [];
        let currentTriplet = "";
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
        .join("-");
}
function makeInformationalRnaFromProtein(protein) {
    let result = "";
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
function mapString(string, mapper) {
    let chars = [];
    for (let char of string) {
        chars.push(mapper(char));
    }
    return chars.join("");
}
function makeComplimentaryDna(dna) {
    return mapString(dna, (x) => DNA_COMPLIMENTARITY_SCHEME.get(x));
}
function makeInformationalRna(dna1) {
    return mapString(dna1, (x) => RNA_COMPLIMENTARITY_SCHEME.get(x));
}
function makeDnaFromiRna(irna) {
    return mapString(irna, (x) => DNA_COMPLIMENTARITY_SCHEME.get(x));
}
function makeTransferRna(irna) {
    return mapString(irna, (x) => RNA_COMPLIMENTARITY_SCHEME.get(x));
}
function delws(str) {
    return str.replace(/\s+/g, "");
}
function uniformSequence(seq) {
    return mapString(delws(seq), uniformNucleotide);
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
function validateInput(inputType) {
    setLastInputType(inputType);
    clearError();
    if (inputType === InputType.PROTEIN) {
        const formatedInput = formatProteinSequence(document.querySelector("#proteinInput").value.replace("-", ""));
        for (const aminoacid of formatedInput.split(" ")) {
            if (!isValidAminoacid(aminoacid)) {
                logError(`Ошибка: неизвестная аминокислота '${aminoacid}'`, inputType);
                return false;
            }
        }
        document.getElementById("proteinInput").value = formatedInput;
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
        logError("Ошибка: неполный триплет", inputType);
        return false;
    }
    return true;
}
function getCheckerAndInputElement(inputType) {
    switch (inputType) {
        case InputType.DNA1:
            return { checker: isValidDnaChar, inputElement: document.querySelector("#firstDnaInput") };
        case InputType.DNA2:
            return { checker: isValidDnaChar, inputElement: document.querySelector("#secondDnaInput") };
        case InputType.IRNA:
            return { checker: isValidRnaChar, inputElement: document.querySelector("#informationalRnaInput") };
        case InputType.TRNA:
            return { checker: isValidRnaChar, inputElement: document.querySelector("#transferRnaInput") };
        default:
            throw new Error("impossible value");
    }
}
function isValidAminoacid(aminoacid) {
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
function isValidDnaChar(char) {
    return DNA_VALID_CHARS.includes(char);
}
function isValidRnaChar(char) {
    return RNA_VALID_CHARS.includes(char);
}
function getErrorLogByInputType(inputType) {
    return document.getElementById(inputType + "ErrorLog");
}
function logError(message, inputType) {
    let logger = getErrorLogByInputType(inputType);
    logger.innerText = message;
}
function clearError() {
    for (let x of [InputType.DNA1, InputType.DNA2, InputType.IRNA, InputType.PROTEIN, InputType.TRNA]) {
        logError("", x);
    }
}
function formatOutput(sequence) {
    let triplets = [];
    let currentTriplet = "";
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
    let currentTriplet = "";
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
    .addEventListener("input", () => validateInput(InputType.DNA1));
document.getElementById("secondDnaInput")
    .addEventListener("input", () => validateInput(InputType.DNA2));
document.getElementById("informationalRnaInput")
    .addEventListener("input", () => validateInput(InputType.IRNA));
document.getElementById("transferRnaInput")
    .addEventListener("input", () => validateInput(InputType.TRNA));
document.getElementById("proteinInput")
    .addEventListener("input", () => validateInput(InputType.PROTEIN));
document.getElementById("runButton")
    .addEventListener("click", runApplication);
