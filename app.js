
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add task
taskForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") return;

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();
});

// Render tasks
function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML =
            '<p class="empty">No tasks found.</p>';
    }

    filteredTasks.forEach(task => {
        const div = document.createElement("div");

        div.className = task.completed
            ? "task done"
            : "task";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete";

        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        div.append(checkbox, span, deleteBtn);

        taskList.appendChild(div);
    });

    updateStats();
}

// Update statistics
function updateStats() {
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const remaining = total - completed;

    document.getElementById("total").textContent = total;

    document.getElementById("completed").textContent =
        completed;

    document.getElementById("remaining").textContent =
        remaining;

    const percentage = total === 0
        ? 0
        : (completed / total) * 100;

    document.getElementById("progressBar").style.width =
        percentage + "%";
}

// Filters
document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".filter.active")
            .classList.remove("active");

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

// Initial render
renderTasks();
