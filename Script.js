let currentInput = "";
let currentRoast = "Ready to judge your math skills...";

const resultEl = document.getElementById("result");
const expressionEl = document.getElementById("expression");
const roastEl = document.getElementById("roast-text");

function appendNumber(num) {
  if (currentInput === "0" && num === "0") return;
  if (currentInput === "0" && num !== ".") {
    currentInput = num;
  } else {
    currentInput += num;
  }
  updateDisplay();
}

function appendDot(dot) {
  const parts = currentInput.split(/[\+\-\*\/%]/);
  const lastPart = parts[parts.length - 1];
  if (!lastPart.includes(".")) {
    currentInput = currentInput === "" ? "0." : currentInput + dot;
    updateDisplay();
  }
}

function appendOperator(op) {
  if (currentInput === "") return;
  const lastChar = currentInput.slice(-1);
  if ("+-*/%".includes(lastChar)) {
    currentInput = currentInput.slice(0, -1) + op;
  } else {
    currentInput += op;
  }
  updateDisplay();
}

function clearAll() {
  currentInput = "";
  expressionEl.textContent = "";
  resultEl.textContent = "0";
  setRoast("Wiped clean. Like your memory before an exam.");
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function updateDisplay() {
  resultEl.textContent = currentInput || "0";
}

function setRoast(message) {
  roastEl.style.opacity = 0;
  setTimeout(() => {
    roastEl.textContent = message;
    roastEl.style.opacity = 1;
  }, 150);
}

function getRoast(expr, result) {
  // Edge case: division by zero
  if (expr.includes("/0") && !expr.includes("/0.")) {
    return "Dividing by zero? Trying to implode the universe?";
  }

  // Easy additions
  if (expr === "1+1" || expr === "2+2") {
    return "Really? You booted up a browser for that?";
  }

  // Multiply by 0
  if (expr.includes("*0")) {
    return "Multiplied by zero. Gone, reduced to atoms.";
  }

  // Funny numbers
  if (result === 69) return "Nice. Very mature.";
  if (result === 404) return "Error 404: Brain not found.";
  if (result === 0) return "Zero. Exactly your contribution to the group project.";
  if (result < 0) return "Negative numbers? Just like your bank account.";
  if (result > 1000000) return "Big numbers! Must be counting dreams that won't happen.";

  // Random general roasts
  const roasts = [
    "I calculated that in 0.0001s. You took 5 seconds to type it.",
    "A standard calculator would have done this with less attitude.",
    "Even my CPU fans sighed at that calculation.",
    "Don't let your math teacher see this history.",
    "I hope you're not balancing personal finances with this."
  ];

  return roasts[Math.floor(Math.random() * roasts.length)];
}

function calculate() {
  if (!currentInput) return;

  const originalExpr = currentInput;
  try {
    // Sanitize input to only allowed characters
    if (!/^[0-9+\-*/. %]+$/.test(currentInput)) {
      throw new Error("Invalid Input");
    }

    // Evaluate expression safely
    const computed = Function('"use strict"; return (' + currentInput + ')')();

    if (!isFinite(computed)) {
      setRoast("Dividing by zero? Black hole generated.");
      resultEl.textContent = "Infinity";
      return;
    }

    const roundedResult = Math.round(computed * 10000000) / 10000000;
    expressionEl.textContent = originalExpr + " =";
    resultEl.textContent = roundedResult;
    setRoast(getRoast(originalExpr, roundedResult));

    currentInput = roundedResult.toString();
  } catch (err) {
    setRoast("That syntax is an absolute disaster.");
    resultEl.textContent = "Syntax Error";
  }
}

// Keyboard input support
document.addEventListener("keydown", (e) => {
  if ((e.key >= "0" && e.key <= "9")) appendNumber(e.key);
  if (["+", "-", "*", "/", "%"].includes(e.key)) appendOperator(e.key);
  if (e.key === ".") appendDot(".");
  if (e.key === "Enter" || e.key === "=") calculate();
  if (e.key === "Backspace") deleteLast();
  if (e.key === "Escape") clearAll();
});
