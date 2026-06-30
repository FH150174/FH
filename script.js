const display = document.getElementById('result');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.value = currentInput;
}

function clearAll() {
  currentInput = '0';
  previousInput = '';
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function inputNumber(num) {
  if (shouldResetDisplay) {
    currentInput = num;
    shouldResetDisplay = false;
  } else {
    currentInput = currentInput === '0' ? num : currentInput + num;
  }
  updateDisplay();
}

function inputDecimal() {
  if (shouldResetDisplay) {
    currentInput = '0.';
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  if (!currentInput.includes('.')) {
    currentInput += '.';
  }
  updateDisplay();
}

function inputBackspace() {
  if (shouldResetDisplay) return;

  currentInput = currentInput.slice(0, -1);
  if (currentInput === '' || currentInput === '-') {
    currentInput = '0';
  }
  updateDisplay();
}

function inputPercent() {
  const value = parseFloat(currentInput);
  if (!isNaN(value)) {
    currentInput = String(value / 100);
    updateDisplay();
  }
}

function calculate(a, b, op) {
  const num1 = parseFloat(a);
  const num2 = parseFloat(b);

  switch (op) {
    case 'add':
      return num1 + num2;
    case 'subtract':
      return num1 - num2;
    case 'multiply':
      return num1 * num2;
    case 'divide':
      return num2 === 0 ? '错误' : num1 / num2;
    default:
      return b;
  }
}

function handleOperator(op) {
  const current = parseFloat(currentInput);

  if (operator && !shouldResetDisplay) {
    const result = calculate(previousInput, currentInput, operator);
    currentInput = String(result);
    previousInput = currentInput;
  } else {
    previousInput = currentInput;
  }

  operator = op;
  shouldResetDisplay = true;
  updateDisplay();
}

function handleEquals() {
  if (!operator || shouldResetDisplay) return;

  const result = calculate(previousInput, currentInput, operator);
  currentInput = String(result);
  operator = null;
  previousInput = '';
  shouldResetDisplay = true;
  updateDisplay();
}

// 事件委托：所有按钮点击
document.querySelector('.buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const action = btn.dataset.action;

  if (!isNaN(action)) {
    inputNumber(action);
  } else {
    switch (action) {
      case 'clear':
        clearAll();
        break;
      case 'backspace':
        inputBackspace();
        break;
      case 'percent':
        inputPercent();
        break;
      case 'decimal':
        inputDecimal();
        break;
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        handleOperator(action);
        break;
      case 'equals':
        handleEquals();
        break;
    }
  }
});

// 键盘支持
document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (key >= '0' && key <= '9') {
    inputNumber(key);
  } else if (key === '.') {
    inputDecimal();
  } else if (key === '+') {
    handleOperator('add');
  } else if (key === '-') {
    handleOperator('subtract');
  } else if (key === '*') {
    handleOperator('multiply');
  } else if (key === '/') {
    e.preventDefault();
    handleOperator('divide');
  } else if (key === '%') {
    inputPercent();
  } else if (key === 'Enter' || key === '=') {
    handleEquals();
  } else if (key === 'Escape' || key === 'c' || key === 'C') {
    clearAll();
  } else if (key === 'Backspace') {
    inputBackspace();
  }
});

updateDisplay();
