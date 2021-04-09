"use strict";
function assert(condition, msg) {
    if (!condition) {
        throw new Error(msg);
    }
}
document.addEventListener("click", (event) => {
    assert(event.target !== null, "Cant find event.target");
    const target = event.target;
    if (target.matches("button")) {
        target.focus();
    }
});
const calculator = document.querySelector(".calculator");
assert(calculator !== null, "Cant find calculator element");
const display = calculator.querySelector(".calculator__display");
const calculatorButtonsDiv = calculator.querySelector(".calculator__keys");
// Functions
/**
 * Gets the displayed value
 */
const getDisplayValue = () => {
    var _a;
    return (_a = calculator.querySelector(".calculator__display")) === null || _a === void 0 ? void 0 : _a.textContent;
};
const calculate = (operator, firstValueArg, secondValueArg) => {
    const firstValue = parseFloat(firstValueArg);
    const secondValue = parseFloat(secondValueArg);
    if (operator === "plus")
        return firstValue + secondValue;
    if (operator === "minus")
        return firstValue - secondValue;
    if (operator === "times")
        return firstValue * secondValue;
    if (operator === "divide")
        return firstValue / secondValue;
};
/**
 * Presses a calculator key
 */
const pressKey = (key) => {
    const keyElement = document.querySelector(`[data-key="${key}"]`);
    assert(keyElement !== null, "Cant find calculator element");
    keyElement.click();
};
/**
 * Presses calculator keys in sequence
 * @param  {...any} keys
 */
const pressKeys = (...keys) => {
    keys.forEach(pressKey);
};
/**
 * Resets calculator
 */
const resetCalculator = () => {
    pressKeys("clear", "clear");
    console.assert(getDisplayValue() === "0", "Clear calculator");
    console.assert(!calculator.dataset.firstValue, "No first value");
    console.assert(!calculator.dataset.operator, "No operator value");
    console.assert(!calculator.dataset.modifierValue, "No operator value");
};
function handleClearKey(calculator, button) {
    const { previousButtonType } = calculator.dataset;
    assert(display !== null, "Cant find display element");
    display.textContent = "0";
    button.textContent = "AC";
    if (previousButtonType === "clear") {
        delete calculator.dataset.firstValue;
        delete calculator.dataset.operator;
        delete calculator.dataset.modifierValue;
    }
}
function handleNumberKeys(calculator, button) {
    const { previousButtonType } = calculator.dataset;
    // @ts-ignore
    const { key } = button.dataset;
    const displayValue = getDisplayValue();
    if (displayValue === "0") {
        display.textContent = key;
    }
    else {
        display.textContent = displayValue + key;
    }
    if (previousButtonType === "operator") {
        display.textContent = key;
    }
    if (previousButtonType === "equal") {
        resetCalculator();
        display.textContent = key;
    }
}
function handleDecimalKey(calculator) {
    const displayValue = getDisplayValue();
    const { previousButtonType } = calculator.dataset;
    assert(displayValue !== null, "Cant find displayValue element");
    assert(displayValue !== undefined, "Cant find displayValue element");
    if (!displayValue.includes(".")) {
        display.textContent = displayValue + ".";
    }
    if (previousButtonType === "equal") {
        resetCalculator();
        display.textContent = "0.";
    }
    if (previousButtonType === "operator") {
        display.textContent = "0.";
    }
}
function handleOperatorKeys(calculator, button) {
    const { previousButtonType, firstValue, operator } = calculator.dataset;
    const displayValue = getDisplayValue();
    button.classList.add("is-pressed");
    const secondValue = displayValue;
    if (previousButtonType !== "operator" &&
        previousButtonType !== "equal" &&
        firstValue &&
        operator) {
        if (secondValue === undefined || secondValue === null)
            return;
        const result = calculate(operator, firstValue, secondValue);
        if (typeof result !== "number")
            return;
        const resultAsString = result.toString();
        display.textContent = resultAsString;
        calculator.dataset.firstValue = resultAsString;
    }
    else {
        if (displayValue)
            calculator.dataset.firstValue = displayValue;
    }
    calculator.dataset.operator = button.dataset.key;
}
function handleEqualKey(calculator) {
    const displayValue = getDisplayValue();
    const { firstValue, operator, modifierValue } = calculator.dataset;
    const secondValue = modifierValue || displayValue;
    if (firstValue && operator) {
        if (secondValue === undefined || secondValue === null)
            return;
        const result = calculate(operator, firstValue, secondValue);
        if (typeof result !== "number")
            return;
        const resultAsString = result.toString();
        display.textContent = resultAsString;
        calculator.dataset.firstValue = resultAsString;
        calculator.dataset.modifierValue = secondValue;
    }
    else {
        if (displayValue) {
            const displayValueAsNumber = parseFloat(displayValue) * 1;
            const displayValueAsString = displayValueAsNumber.toString();
            display.textContent = displayValueAsString;
        }
    }
}
assert(calculatorButtonsDiv !== null, "Cant find calculatorButtonsDiv element");
calculatorButtonsDiv.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.closest("button"))
        return;
    const button = event.target;
    const { buttonType, key } = button.dataset;
    const { previousButtonType } = calculator.dataset;
    const displayValue = display.textContent;
    const operatorKeys = [...calculatorButtonsDiv.children].filter((button) => {
        const buttonAsHTMLElement = button;
        buttonAsHTMLElement.dataset.buttonType === "operator";
    });
    operatorKeys.forEach((button) => button.classList.remove("is-pressed"));
    if (buttonType !== "clear") {
        const clearButton = calculator.querySelector("[data-button-type=clear]");
        assert(clearButton !== null, "Cant find cclearButton element");
        clearButton.textContent = "CE";
    }
    switch (buttonType) {
        case "clear":
            handleClearKey(calculator, button);
            break;
        case "number":
            handleNumberKeys(calculator, button);
            break;
        case "decimal":
            handleDecimalKey(calculator);
            break;
        case "operator":
            handleOperatorKeys(calculator, button);
            break;
        case "equal":
            handleEqualKey(calculator);
            break;
    }
    calculator.dataset.previousButtonType = buttonType;
});
calculatorButtonsDiv.addEventListener("keydown", (event) => {
    const keyBoardEvent = event;
    let key = keyBoardEvent.key;
    //Operator keys
    if (key === "+")
        key = "plus";
    if (key === "-")
        key = "minus";
    if (key === "*")
        key = "times";
    if (key === "/")
        key = "divide";
    //Special keys
    if (key === ".")
        key = "decimal";
    if (key === "Backspace")
        key = "clear";
    if (key === "Escape")
        key = "clear";
    if (key === "Enter")
        key = "equal";
    if (key === "=")
        key = "equal";
    const button = calculator.querySelector(`[data-key="${key}"]`);
    if (!button)
        return;
    event.preventDefault();
    button.click();
});
// Testing
// =======
/**
 * Runs a test
 * @param {Object} test
 */
const runTest = (test) => {
    pressKeys(...test.keys);
    console.assert(getDisplayValue() === test.result, test.message);
    resetCalculator();
};
const testClearKey = () => {
    var _a;
    // Before calculation
    pressKeys("5", "clear");
    console.assert(getDisplayValue() === "0", "Clear before calculation");
    console.assert(((_a = calculator.querySelector('[data-key="clear"]')) === null || _a === void 0 ? void 0 : _a.textContent) === "AC", "Clear once, should show AC");
    resetCalculator();
    // After calculator
    pressKeys("5", "times", "9", "equal", "clear");
    const { firstValue, operator } = calculator.dataset;
    console.assert(Boolean(firstValue), "Clear once;  should have first value");
    console.assert(Boolean(operator), "Clear once;  should have operator value");
    resetCalculator();
};
const tests = [
    // Initial Expressions
    {
        message: "Number key",
        keys: ["2"],
        result: "2",
    },
    {
        message: "Number Number",
        keys: ["3", "5"],
        result: "35",
    },
    {
        message: "Number Decimal",
        keys: ["4", "decimal"],
        result: "4.",
    },
    {
        message: "Number Decimal Number",
        keys: ["4", "decimal", "5"],
        result: "4.5",
    },
    // Calculations
    {
        message: "Addition",
        keys: ["2", "plus", "5", "equal"],
        result: "7",
    },
    {
        message: "Subtraction",
        keys: ["5", "minus", "9", "equal"],
        result: "-4",
    },
    {
        message: "Multiplication",
        keys: ["4", "times", "8", "equal"],
        result: "32",
    },
    {
        message: "Division",
        keys: ["5", "divide", "1", "0", "equal"],
        result: "0.5",
    },
    // Easy Edge Cases
    // Number keys first
    {
        message: "Number Equal",
        keys: ["5", "equal"],
        result: "5",
    },
    {
        message: "Number Decimal Equal",
        keys: ["2", "decimal", "4", "5", "equal"],
        result: "2.45",
    },
    // Decimal keys first
    {
        message: "Decimal key",
        keys: ["decimal"],
        result: "0.",
    },
    {
        message: "Decimal Decimal",
        keys: ["2", "decimal", "decimal"],
        result: "2.",
    },
    {
        message: "Decimal Decimal",
        keys: ["2", "decimal", "5", "decimal", "5"],
        result: "2.55",
    },
    {
        message: "Decimal Equal",
        keys: ["2", "decimal", "equal"],
        result: "2",
    },
    // Equal key first
    {
        message: "Equal",
        keys: ["equal"],
        result: "0",
    },
    {
        message: "Equal Number",
        keys: ["equal", "3"],
        result: "3",
    },
    {
        message: "Number Equal Number",
        keys: ["5", "equal", "3"],
        result: "3",
    },
    {
        message: "Equal Decimal",
        keys: ["equal", "decimal"],
        result: "0.",
    },
    {
        message: "Number Equal Decimal",
        keys: ["5", "equal", "decimal"],
        result: "0.",
    },
    {
        message: "Calculation + Operator",
        keys: ["1", "plus", "1", "equal", "plus", "1", "equal"],
        result: "3",
    },
    // Operator Keys first
    {
        message: "Operator Decimal",
        keys: ["times", "decimal"],
        result: "0.",
    },
    {
        message: "Number Operator Decimal",
        keys: ["5", "times", "decimal"],
        result: "0.",
    },
    {
        message: "Number Operator Equal",
        keys: ["7", "divide", "equal"],
        result: "1",
    },
    {
        message: "Number Operator Operator",
        keys: ["9", "times", "divide"],
        result: "9",
    },
    // Difficult edge cases
    // Operator calculation
    {
        message: "Operator calculation",
        keys: ["9", "plus", "5", "plus"],
        result: "14",
    },
    {
        message: "Operator follow-up calculation",
        keys: ["1", "plus", "2", "plus", "3", "plus", "4", "plus", "5", "plus"],
        result: "15",
    },
    // Equal followup calculation
    {
        message: "Number Operator Equal Equal",
        keys: ["9", "minus", "equal", "equal"],
        result: "-9",
    },
    {
        message: "Number Operator Number Equal Equal",
        keys: ["8", "minus", "5", "equal", "equal"],
        result: "-2",
    },
];
// Runs the tests
testClearKey();
tests.forEach(runTest);
