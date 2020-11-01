// Pennet application
// Autor: Tsvikevich Denis 2019

function makeValueCells<K, V>(map: Map<K, V>): string {
  let cells: string[] = [];

  for (const value of map.values()) {
    cells.push(`<td>${value}</td>`);
  }

  return cells.join("");
}

function makeKeyCells<K, V>(map: Map<K, V>): string {
  let cells: string[] = [];

  for (const key of map.keys()) {
    cells.push(`<td>${key}</td>`);
  }

  return cells.join("");
}

class Counter {
  private counter: Map<string, number>;

  constructor() {
    this.counter = new Map<string, number>();
  }

  count(element: string) {
    if (this.counter.has(element)) {
      this.counter.set(element, this.counter.get(element) + 1);
    }
    else {
      this.counter.set(element, 1);
    }
  }

  getSize(): number {
    return this.counter.size;
  }

  getTable(tableName: string): string {
    return `
      <label>${tableName}: </label><br>
      <table class="table table-bordered">
        <tr>${makeKeyCells(this.counter)} </tr>
        <tr>${makeValueCells(this.counter)} </tr>
      </table>`;
  }
}

function runApplication() {
  clearError();
  document.getElementById("tableplace").innerHTML = "";

  const genotype1 =
    document.querySelector<HTMLInputElement>("#genotype1").value.trim();
  const genotype2 =
    document.querySelector<HTMLInputElement>("#genotype2").value.trim();

  if (!checkGenotypes(genotype1, genotype2)) {
    return;
  }

  const gametesFirst = makeGametes(genotype1);
  const gametesSecond = genotype1 === genotype2 ? gametesFirst : makeGametes(genotype2);

  document.getElementById("tableplace").appendChild(createOutput(gametesFirst, gametesSecond));
}

function fail(error: string): false {
  document.getElementById("errorlogs").innerText = error;
  return false;
}

function clearError() {
  fail("");
}

function createTable(): HTMLTableElement {
  const result = document.createElement("table");
  result.className = "table table-bordered table-responsive";
  return result;
}

function createOutputContainer(): HTMLDivElement {
  const result = document.createElement("div");
  return result;
}

function createLabel(text: string) {
  const result = document.createElement("span");
  result.innerText = text;
  return result;
}

function createRow() {
  const result = document.createElement("tr");
  return result;
}

function createCell(text: string) {
  const result = document.createElement("td");
  result.innerHTML = text;
  return result;
}

function createOutput(g1: string[], g2: string[]): HTMLDivElement {
  const genotypeCounter = new Counter();
  const phenotypeCounter = new Counter();

  let outputContainer = createOutputContainer();

  outputContainer.appendChild(createLabel("Решётка Пеннета:"));

  let punnetTable = createTable();
  outputContainer.appendChild(punnetTable);

  let punnetTableTbody = document.createElement("tbody");
  punnetTable.appendChild(punnetTableTbody);
  let row = createRow();
  punnetTableTbody.appendChild(row);

  row.appendChild(createCell(""));

  for (const i of g2) {
    row.appendChild(createCell(`<span class="gamete gamete-first">${i}</span>`));
  }

  for (const i of g1) {
    row = createRow();
    row.appendChild(createCell(`<span class="gamete gamete-second">${i}</span>`));

    for (const j of g2) {
      let genotype = combineGametes(i, j);
      if (genotype === undefined) {
        return createOutputContainer();
      }

      const phenotype = evalPhenotype(genotype);
      genotypeCounter.count(genotype);
      phenotypeCounter.count(phenotype);

      row.appendChild(createCell(phenotype !== null ? `${genotype}<br>(${phenotype})` : genotype));
    }

    punnetTableTbody.appendChild(row);
  }

  /* let subbuilder = genotypeCounter.getTable("Расщепление по генотипу");
 
   if (phenotypeCounter.getSize() > 1) {
     subbuilder += "<br>" + phenotypeCounter.getTable("Расщепление по фенотипу");
   }
 
   return builder + `</table><br><div>${subbuilder}</div>`;*/
  return outputContainer;
}

function evalPhenotype(genotype) {
  const phenotypeParts = new Map

  for (const allel of genotype) {
    let val = document.querySelector<HTMLInputElement>("#inputFor" + allel).value;

    if (!val) {
      continue;
    }

    if (allel.toUpperCase() == allel) {
      phenotypeParts.set(allel, val);
    }

    if (!phenotypeParts.has(allel.toUpperCase())) {
      phenotypeParts.set(allel, val);
    }
  }

  if (!phenotypeParts.size) {
    return null;
  }

  return [...phenotypeParts.values()].join(", ");
}

function combineGametes(g1, g2): string {
  if (g1.length !== g2.length) {
    fail("wrong gamet length");
    return undefined;
  }

  let parts = [];
  for (let i = 0; i < g1.length; i++) {
    parts.push(g1[i] < g2[i] ? g1[i] + g2[i] : g2[i] + g1[i]);
  }

  return parts.join("");
}

function unique<T>(values: T[]): T[] {
  return [...new Set<T>(values)];
}

// Создаёт набор гамет для заданного генотипа
function makeGametes(genotype: string): string[] {
  function helper(genotype: string, position: number): string[] | undefined {
    // если аллелей не осталось - undefined
    if (position >= genotype.length) {
      return undefined;
    }

    const gams = helper(genotype, position + 2)

    // если перебрали всё - удаляем повторяющиеся элементы
    if (gams === undefined) {
      return unique([genotype[position], genotype[position + 1]]);
    }

    return genotype[position] === genotype[position + 1] ?
      gams.map(i => genotype[position] + i)
      :
      [...gams.map(i => genotype[position] + i), ...gams.map(i => genotype[position + 1] + i)];
  }

  return helper(genotype, 0);
}

function onChangeText() {
  clearError()

  document.getElementById("gametparams").innerHTML = "";
  const genotype1 = document.querySelector<HTMLInputElement>("#genotype1").value.trim();
  const genotype2 = document.querySelector<HTMLInputElement>("#genotype2").value.trim();

  if (!checkGenotypes(genotype1, genotype2)) {
    return;
  }

  const gametes = makeGametes(genotype1);

  if (!gametes) {
    return;
  }

  const alleles = mergeStrings(gametes[0].toUpperCase(), gametes[0].toLowerCase())

  let inputs = [];

  for (const allel of alleles) {
    inputs.push(createPhenotypeInput(allel));
  }

  document.getElementById("gametparams").innerHTML = inputs.join("");
}

function createPhenotypeInput(allel) {
  return `
    <div class="input-control">
      <label for="inputFor${allel}"> Фенотип ${allel}</label>
      <input type="text" class="form-control" id="inputFor${allel}">
    </div>
  `;
}

function checkGenotype(genotype: string): boolean {
  // поддерживаются только аллели, кратные двум
  if (genotype.length % 2 != 0) {
    return fail(`Введён некорректный генотип ${genotype}`);
  }

  return true;
}

function checkGenotypes(genotype1: string, genotype2: string): boolean {
  if (!checkGenotype(genotype1) && !checkGenotype(genotype2)) {
    return false;
  }

  // число аллелей должно быть одинаковым
  if (genotype1.length !== genotype2.length) {
    return fail(`Генотипы ${genotype1} и ${genotype2} некорректны`);
  }

  // порядок аллелей должен быть одинаковым
  for (let i = 0; i < genotype1.length; i++) {
    if (genotype1[i].toLowerCase() !== genotype2[i].toLowerCase()) {
      return fail(`Генотипы ${genotype1} и ${genotype2} некорректны`);
    }
  }

  return true;
}

function mergeStrings(string1, string2) {
  let buffer = [];
  for (let i = 0; i < string1.length; i++) {
    buffer.push(string1[i] + string2[i]);
  }
  return buffer.join("");
}

document.getElementById("genotype1")
  .addEventListener("input", onChangeText);

document.getElementById("genotype2")
  .addEventListener("input", onChangeText);

document.getElementById("runButton")
  .addEventListener("click", runApplication);