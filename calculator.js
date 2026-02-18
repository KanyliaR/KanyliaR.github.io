// Grab the containers from calculator.html
const historyDiv = document.getElementById("history");
const summaryDiv = document.getElementById("summary");

// Valid operator set
const validOperators = new Set(["+", "-", "*", "/", "%"]);


// Store valid computed results for summary stats (exclude errors)
const validResults = [];

// Helpers
function makeTable(headers) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");

  for (const h of headers) {
    const th = document.createElement("th");
    th.textContent = h;
    tr.appendChild(th);
  }
  thead.appendChild(tr);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  return { table, tbody };
}

// Strict validation
function isValidNumberString(s) {
  const trimmed = String(s).trim();
  if (trimmed === "") return false;
  const numberPattern = /^-?(?:\d+\.?\d*|\.\d+)$/;
  return numberPattern.test(trimmed);
}

// HISTORY table
const { table: historyTable, tbody: historyBody } = makeTable([
  "Number 1",
  "Operator",
  "Number 2",
  "Result",
]);
historyDiv.appendChild(historyTable);

// Main prompt loop
do {
  const xInput = prompt("Enter the first number (x):");
  if (xInput === null) break;

  const yInput = prompt("Enter the second number (y):");
  if (yInput === null) break;

  const operator = prompt("Enter operator (+, -, *, /, %):");
  if (operator === null) break;

  let resultCellText = "";
  let isValidRow = true;

  // Validate x
  if (!isValidNumberString(xInput)) {
    resultCellText = "Error: Value #1 (x) is not a valid number";
    isValidRow = false;
  }

  // Validate y
  if (isValidRow && !isValidNumberString(yInput)) {
    resultCellText = "Error: Value #2 (y) is not a valid number";
    isValidRow = false;
  }

  // Convert
  const x = isValidRow ? parseFloat(xInput) : NaN;
  const y = isValidRow ? parseFloat(yInput) : NaN;

    
  if (isValidRow && (isNaN(x) || isNaN(y))) {
    if (isNaN(x)) resultCellText = "Error: Value #1 (x) is not numeric";
    else resultCellText = "Error: Value #2 (y) is not numeric";
    isValidRow = false;
  }

  // Validate operator
  if (isValidRow && !validOperators.has(operator)) {
    resultCellText = "Error: Operator must be +, -, *, /, or %";
    isValidRow = false;
  }

  // Compute
  let computed = null;
  if (isValidRow) {
    if (operator === "+") computed = x + y;
    else if (operator === "-") computed = x - y;
    else if (operator === "*") computed = x * y;
    else if (operator === "/") {
      if (y === 0) {
        resultCellText = "Error: Division by zero";
        isValidRow = false;
      } else computed = x / y;
    }
    else if (operator === "%") {
      if (y === 0) {
        resultCellText = "Error: Modulus by zero";
        isValidRow = false;
      } else computed = x % y;
    }
  }

  if (isValidRow) {
    resultCellText = String(computed);
    validResults.push(computed);
    alert(`${x} ${operator} ${y} = ${computed}`);
  } else {
    alert(resultCellText);
  }

  // Add row
  const row = document.createElement("tr");

  const tdX = document.createElement("td");
  tdX.textContent = xInput;

  const tdOp = document.createElement("td");
  tdOp.textContent = operator;

  const tdY = document.createElement("td");
  tdY.textContent = yInput;

  const tdRes = document.createElement("td");
  tdRes.textContent = resultCellText;
  if (!isValidRow) tdRes.classList.add("error");
  else tdRes.classList.add("ok");

  row.appendChild(tdX);
  row.appendChild(tdOp);
  row.appendChild(tdY);
  row.appendChild(tdRes);
  historyBody.appendChild(row);

} while (true);

// SUMMARY Table
const { table: summaryTable, tbody: summaryBody } = makeTable([
  "Minimum",
  "Maximum",
  "Average",
  "Total",
]);
summaryDiv.appendChild(summaryTable);

let min = "N/A", max = "N/A", avg = "N/A", total = "N/A";

if (validResults.length > 0) {
  let sum = 0;
  min = validResults[0];
  max = validResults[0];

  for (const v of validResults) {
    sum += v;
    if (v < min) min = v;
    if (v > max) max = v;
  }

  total = sum;
  avg = (sum / validResults.length).toFixed(2);
}

const summaryRow = document.createElement("tr");
for (const value of [min, max, avg, total]) {
  const td = document.createElement("td");
  td.textContent = value;
  summaryRow.appendChild(td);
}
summaryBody.appendChild(summaryRow);

