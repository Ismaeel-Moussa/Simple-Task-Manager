
function saveTasksToLocalStorage(tasks) {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromLocalStorage() {
    return JSON.parse(window.localStorage.getItem('tasks')) || [];
}

// Convert timestamp to DD/MM/YYYY h:mm AM/PM
function formatTimestamp(timestampStr) {
    let timestamp = Number(timestampStr);
    let date = new Date(timestamp);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); 
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

function createTaskElement(task) {
    let taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.dataset.id = task.id;
    taskElement.innerHTML = `
        <div class="info">
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <p class="${task.completed ? 'completed' : ''}">${task.title}</p>
        </div>
        <time>${formatTimestamp(task.id)}</time>
        <button class="delete-btn">Delete</button>
    `;
    document.querySelector(".tasks").appendChild(taskElement);
}

function handleCheckBox(event) {
    let taskElement = event.target.closest('.task');
    let paragraph = taskElement.querySelector('p');
    let checkbox = event.target;

    // Toggle visual state
    paragraph.classList.toggle('completed', checkbox.checked);

    // Update localStorage
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.map(task => {
        if (task.id === taskElement.dataset.id) {
            return { ...task, completed: checkbox.checked };
        }
        return task;
    });
    saveTasksToLocalStorage(updatedTasks);
}
    

function handleDelete(event) {
    let taskElement = event.target.parentElement;
    let taskId = taskElement.dataset.id;
    taskElement.remove();
    let tasks = getTasksFromLocalStorage();
    let updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasksToLocalStorage(updatedTasks);
}

// Add EventListener for Delete Button and Checkbox
document.querySelector('.tasks').addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        handleDelete(event);
    }
    if (event.target.matches('input[type="checkbox"]')) {
        handleCheckBox(event);
    }
});

// Create tasks on loading
document.addEventListener('DOMContentLoaded', function() {
   
    let tasks = getTasksFromLocalStorage();
    if(tasks.length > 0) {
        tasks.forEach(task => createTaskElement(task));
    }
});

let input = document.querySelector(".input");
let addButton = document.querySelector(".add");

addButton.onclick = function () { 

    if (input.value.trim() === "") return;

    let newTask = {
        id: Date.now().toString(), 
        title: input.value.trim(),
        completed: false
    };

    createTaskElement(newTask);
    let tasks = getTasksFromLocalStorage();
    tasks.push(newTask);
    saveTasksToLocalStorage(tasks);
    input.value = "";

};

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        document.querySelector(".add").click(); 
    }
});

let deleteAllButton = document.querySelector(".delete-all");

deleteAllButton.onclick = function () {
    document.querySelector(".tasks").innerHTML = "";
    window.localStorage.removeItem("tasks");
}


