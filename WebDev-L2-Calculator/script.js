const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

function calculate(value) {
    if (value === "C") {
        display.value = "";
    }
    else if (value === "⌫") {
        display.value = display.value.slice(0, -1);
    }
    else if (value === "=") {
        try {
            const result = eval(display.value);

            if (!isFinite(result)) {
                display.value = "Error";
            } else {
                display.value = result;
            }
        } catch {
            display.value = "Error";
        }
    }
    else {
        display.value += value;
    }
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        calculate(button.innerText);
    });
});

document.addEventListener("keydown", (event) => {

    const key = event.key;

    if (
        "0123456789+-*/.%".includes(key)
    ) {
        display.value += key;
    }

    else if (key === "Enter") {
        event.preventDefault();
        calculate("=");
    }

    else if (key === "Backspace") {
        calculate("⌫");
    }

    else if (key === "Delete") {
        calculate("C");
    }
});