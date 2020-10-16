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
var INPUT_TYPE;
(function (INPUT_TYPE) {
    INPUT_TYPE["DNA1"] = "\u0414\u041D\u041A 1";
    INPUT_TYPE["DNA2"] = "\u0414\u041D\u041A 2";
    INPUT_TYPE["IRNA"] = "\u0438\u0420\u041D\u041A";
    INPUT_TYPE["TRNA"] = "\u0442\u0420\u041D\u041A";
    INPUT_TYPE["PROTEIN"] = "\u0431\u0435\u043B\u043A\u0443";
})(INPUT_TYPE || (INPUT_TYPE = {}));
;
let runButton = document.getElementById("runButton");
let lastInputType = { inputType: INPUT_TYPE.DNA1 };
function setLastInputType(inputType) {
    lastInputType.inputType = inputType;
    runButton.innerText = "Построить по " + inputType;
}
function updateFields(result) {
    $("#dnaInput").val(formatOutput(result.firstDna));
    $("#dna2Input").val(formatOutput(result.secondDna));
    $("#irnaInput").val(formatOutput(result.informationalRna));
    $("#trnaInput").val(formatOutput(result.transferRna));
    $("#proteinInput").val(result.protein);
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
    let informationalRna = uniformSequence($("#irnaInput").val());
    let firstDna = makeDnaFromiRna(informationalRna);
    let secondDna = makeComplimentaryDna(firstDna);
    let transferRna = makeTransferRna(informationalRna);
    let protein = makeProteinFromInformationalRna(informationalRna);
    return { firstDna, secondDna, informationalRna, transferRna, protein };
}
function buildByTransferRna() {
    let transferRna = uniformSequence($("#trnaInput").val());
    let secondDna = makeDnaFromiRna(transferRna);
    let firstDna = makeComplimentaryDna(secondDna);
    let informationalRna = makeInformationalRna(firstDna);
    let protein = makeProteinFromInformationalRna(informationalRna);
    return { firstDna, secondDna, informationalRna, transferRna, protein };
}
function buildByProtein() {
    let protein = $("#proteinInput").val();
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
        let index = 0;
        for (let i of irna) {
            currentTriplet += i;
            index++;
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
        .join("-");
}
function makeInformationalRnaFromProtein(protein) {
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
function uniformSequence(dna) {
    return mapString(delws(dna), uniformNucleotide);
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
    if (type === INPUT_TYPE.PROTEIN) {
        let formatedInput = formatProteinSequence($("#proteinInput").val().replace(/\-/g, ''));
        for (let aminoacid of formatedInput.split("-")) {
            if (!isValidAminoacid(aminoacid)) {
                return logError(`Ошибка: неизвестная аминокислота '${aminoacid}'`, type);
            }
        }
        document.getElementById("proteinInput").value = formatedInput;
    }
    else {
        let { checker, inputElement } = getCheckerAndInputElement(type);
        for (let i of inputElement.value) {
            if (!checker(i)) {
                return logError(`Ошибка: неожиданный символ '${i}'`, type);
            }
        }
        inputElement.value = formatOutput(delws(inputElement.value));
        if (uniformSequence(inputElement.value).length % 3 !== 0) {
            logError("Ошибка: неполный триплет", type);
        }
    }
}
function getCheckerAndInputElement(inputType) {
    switch (inputType) {
        case INPUT_TYPE.DNA1:
            return { checker: isValidDnaChar, inputElement: document.querySelector("#dnaInput") };
        case INPUT_TYPE.DNA2:
            return { checker: isValidDnaChar, inputElement: document.querySelector("#dna2Input") };
        case INPUT_TYPE.IRNA:
            return { checker: isValidRnaChar, inputElement: document.querySelector("#irnaInput") };
        case INPUT_TYPE.TRNA:
            return { checker: isValidRnaChar, inputElement: document.querySelector("#trnaInput") };
        default:
            return { checker: isValidDnaChar, inputElement: document.querySelector("#dnaInput") };
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
        case INPUT_TYPE.DNA1:
            logger = document.querySelector("#dna1err");
        case INPUT_TYPE.DNA2:
            logger = document.querySelector("#dna2err");
        case INPUT_TYPE.IRNA:
            logger = document.querySelector("#irnaerr");
        case INPUT_TYPE.TRNA:
            logger = document.querySelector("#trnaerr");
        case INPUT_TYPE.PROTEIN:
            logger = document.querySelector("#proteinerr");
    }
    logger.innerHTML = message;
}
function clearError() {
    for (let x of [INPUT_TYPE.DNA1, INPUT_TYPE.DNA2, INPUT_TYPE.IRNA, INPUT_TYPE.PROTEIN, INPUT_TYPE.TRNA]) {
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
    .addEventListener("input", () => validateInput(INPUT_TYPE.DNA1));
document.getElementById("dna2Input")
    .addEventListener("input", () => validateInput(INPUT_TYPE.DNA2));
document.getElementById("irnaInput")
    .addEventListener("input", () => validateInput(INPUT_TYPE.IRNA));
document.getElementById("trnaInput")
    .addEventListener("input", () => validateInput(INPUT_TYPE.TRNA));
document.getElementById("proteinInput")
    .addEventListener("input", () => validateInput(INPUT_TYPE.PROTEIN));
document.getElementById("runButton")
    .addEventListener("click", runApplication);
document.getElementById("buildByDna1Button")
    .addEventListener("click", () => updateFields(buildByDnaOne()));
document.getElementById("buildByDna2Button")
    .addEventListener("click", () => updateFields(buildByDnaTwo()));
document.getElementById("buildByiRnaButton")
    .addEventListener("click", () => updateFields(buildByInformationalRna()));
document.getElementById("buildBytRnaButton")
    .addEventListener("click", () => updateFields(buildByTransferRna()));
document.getElementById("buildByProteinButton")
    .addEventListener("click", () => updateFields(buildByProtein()));
