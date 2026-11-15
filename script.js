let mode = "focus";
let timeLeft = 25 * 60;
let timerId = null;

const themes = [
  { className: "", label: "Theme: Classic Paper" },
  { className: "theme-sepia", label: "Theme: Sepia Typewriter" },
  { className: "theme-night", label: "Theme: Night Terminal" }
];
let themeIndex = 0;

let tasks = [
  { text: "Finish building Grandma's website", done: false },
  { text: "Test all 5 keyboard shortcuts", done: false }
];

const timerEl = document.getElementById("timer");
const statusEl = document.getElementById("status-msg");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const themeBtn = document.getElementById("theme-btn");
const themeLabel = document.getElementById("theme-label");
const btnFocus = document.getElementById("btn-focus");
const btnBreak = document.getElementById("btn-break");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const clearDoneBtn = document.getElementById("clear-done");

function updateDisplay() {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  timerEl.textContent = `${mins}:${secs}`;
}

function toggleTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    startBtn.textContent = "Start";
    statusEl.textContent = "Timer paused.";
  } else {
    startBtn.textContent = "Pause";
    statusEl.textContent = mode === "focus" ? "Stay focused..." : "Enjoy your break!";
    timerId = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timerId);
        timerId = null;
        startBtn.textContent = "Start";
        statusEl.textContent = "Time is up!";
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  startBtn.textContent = "Start";
  timeLeft = mode === "focus" ? 25 * 60 : 5 * 60;
  statusEl.textContent = "Timer reset.";
  updateDisplay();
}

function switchMode(newMode) {
  mode = newMode;
  btnFocus.classList.toggle("active", mode === "focus");
  btnBreak.classList.toggle("active", mode === "break");
  resetTimer();
}

function cycleTheme() {
  themeIndex = (themeIndex + 1) % themes.length;
  document.body.className = themes[themeIndex].className;
  themeLabel.textContent = themes[themeIndex].label;
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.done ? " done" : "");
    li.innerHTML = `<span>${task.done ? "[x]" : "[ ]"} ${task.text}</span>`;
    li.addEventListener("click", () => {
      tasks[index].done = !tasks[index].done;
      renderTasks();
    });
    taskList.appendChild(li);
  });
  const remaining = tasks.filter(t => !t.done).length;
  taskCount.textContent = `${remaining} task${remaining === 1 ? "" : "s"} remaining`;
}

startBtn.addEventListener("click", toggleTimer);
resetBtn.addEventListener("click", resetTimer);
themeBtn.addEventListener("click", cycleTheme);
btnFocus.addEventListener("click", () => switchMode("focus"));
btnBreak.addEventListener("click", () => switchMode("break"));

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = taskInput.value.trim();
  if (value) {
    tasks.push({ text: value, done: false });
    taskInput.value = "";
    renderTasks();
  }
});

clearDoneBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.done);
  renderTasks();
});

document.addEventListener("keydown", (e) => {
  if (document.activeElement === taskInput) {
    if (e.key === "Escape") taskInput.blur();
    return;
  }

  const key = e.key.toLowerCase();
  if (key === "s") toggleTimer();
  if (key === "r") resetTimer();
  if (key === "t") cycleTheme();
  if (key === "m") switchMode(mode === "focus" ? "break" : "focus");
  if (key === "n") {
    e.preventDefault();
    taskInput.focus();
  }
});

updateDisplay();
renderTasks();
