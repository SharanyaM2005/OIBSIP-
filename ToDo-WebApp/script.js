const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearAllButton = document.getElementById("clearAll");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskCount() {
    const pendingTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = tasks.filter(task => task.completed).length;

    taskCount.textContent =
        `${pendingTasks} pending • ${completedTasks} completed`;
}

function displayTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    tasks.forEach(task => {

        const li = document.createElement("li");
        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        const leftSection = document.createElement("div");
        leftSection.className = "task-left";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        leftSection.appendChild(checkbox);
        leftSection.appendChild(taskText);

        const buttonSection = document.createElement("div");
        buttonSection.className = "button-section";

        // Edit Button
        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {

            const newText = prompt(
                "Edit your task:",
                task.text
            );

            if (newText !== null && newText.trim() !== "") {
                task.text = newText.trim();

                saveTasks();
                displayTasks();
            }
        });

        // Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {

            tasks = tasks.filter(item => item.id !== task.id);

            saveTasks();
            displayTasks();
        });

        buttonSection.appendChild(editButton);
        buttonSection.appendChild(deleteButton);

        li.appendChild(leftSection);
        li.appendChild(buttonSection);

        taskList.appendChild(li);
    });

    updateTaskCount();
}

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    displayTasks();
}

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        addTask();
    }
});

clearAllButton.addEventListener("click", () => {

    if (tasks.length === 0) {
        return;
    }

    const confirmation = confirm(
        "Are you sure you want to delete all tasks?"
    );

    if (confirmation) {
        tasks = [];

        saveTasks();
        displayTasks();
    }
});

displayTasks();