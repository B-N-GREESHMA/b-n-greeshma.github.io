const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const categoryInput = document.getElementById("categoryInput");
const taskList = document.getElementById("taskList");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");
const clearAllBtn = document.getElementById("clearAll");
const toggleDarkMode = document.getElementById("toggleDarkMode");
const completeSound = document.getElementById("completeSound");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  taskList.innerHTML = '';
  const filtered = tasks.filter(task => {
    const statusMatch = statusFilter.value === 'all' ||
      (statusFilter.value === 'completed' && task.completed) ||
      (statusFilter.value === 'pending' && !task.completed);

    const categoryMatch = categoryFilter.value === 'all' ||
      task.category === categoryFilter.value;

    return statusMatch && categoryMatch;
  });

  filtered.sort((a, b) => new Date(a.dueDate || '2100-01-01') - new Date(b.dueDate || '2100-01-01'));
  filtered.forEach(addTaskToDOM);
}

function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.className = 'task-item';
  if (task.completed) li.classList.add('completed');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => toggleComplete(task.id));

  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = `${task.text} (${task.category}) - Due: ${task.dueDate || 'N/A'}`;

  const editBtn = document.createElement('button');
  editBtn.textContent = '✏️';
  editBtn.className = 'edit-btn';
  editBtn.addEventListener('click', () => {
    const newText = prompt("Edit task:", task.text);
    if (newText) {
      task.text = newText;
      saveTasks();
      loadTasks();
    }
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '❌';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
    loadTasks();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    completeSound.play();
    saveTasks();
    loadTasks();
  }
}

function addTask() {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const category = categoryInput.value;

  if (!text) return alert("Please enter a task!");

  const task = {
    id: Date.now(),
    text,
    dueDate,
    category,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  loadTasks();

  taskInput.value = '';
  dueDateInput.value = '';
  categoryInput.value = 'all';
}

clearAllBtn.addEventListener('click', () => {
  if (confirm("Clear all tasks?")) {
    tasks = [];
    saveTasks();
    loadTasks();
  }
});

toggleDarkMode.addEventListener('click', () => {
  document.body.classList.toggle("dark");
});

loadTasks();
