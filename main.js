const inputTodo = document.querySelector(".todo-input");
const listTodo = document.querySelector(".todo-list");
const listNotTodo = document.querySelector(".not-todo-list");
const addTodoBtn = document.querySelector(".btn-todo-add");
const todoListDone = JSON.parse(localStorage.getItem("todoListDone")) ?? [];
const todoListNotDone =
  JSON.parse(localStorage.getItem("todoListNotDone")) ?? [];
let editJobIdx = -1;

window.onload = () => {
  handleStatus();
  renderJob();
};

(function () {
  document.onmousemove = handleMouseMove;
  const mousePoint = document.querySelector(".mouse-point");
  document.onmousedown = () => {
    mousePoint.classList.add("clicked");
  };
  document.onmouseup = () => {
    mousePoint.classList.remove("clicked");
  };

  function handleMouseMove(event) {
    const mousePoint = document.querySelector(".mouse-point");
    if (event.pageY > 0 && event.pageX > 0) {
      setTimeout(() => {
        mousePoint.style.top = `${event.pageY}px`;
        mousePoint.style.left = `${event.pageX}px`;
      }, 150);
    }
  }
})();

addTodoBtn.onclick = () => {
  if (inputTodo.value !== "" && addTodoBtn.dataset.type == "add") {
    addJob(inputTodo.value);
    clearInput();
    renderJob();
  }
  if (addTodoBtn.dataset.type == "save" && inputTodo.value !== "") {
    addTodoBtn.dataset.type = "add";
    addTodoBtn.innerHTML = "Add";
    editJob(editJobIdx);
  }
  saveTodoListLocalStorage();
};

window.onkeyup = (e) => {
  if (e.keyCode == 13) {
    addTodoBtn.click();
  }
};

function clearInput() {
  inputTodo.value = "";
  inputTodo.focus();
}

function handleDeleteJob(index, type = false) {
  if (confirm("Do you want to delete ?")) {
    type ? todoListDone.splice(index, 1) : todoListNotDone.splice(index, 1);
    saveTodoListLocalStorage();
    renderJob();
  }
}

function activeDone(idx) {
  listNotTodo.children[idx].classList.add("done");
  todoListDone.push(todoListNotDone[idx]);
  todoListNotDone.splice(idx, 1);
  saveTodoListLocalStorage();
  renderJob();
  console.log(idx);
  console.log(todoListNotDone);
  console.log(todoListDone);
}

function activeNotDone(idx) {
  listTodo.children[idx].classList.remove("done");
  todoListNotDone.push(todoListDone[idx]);
  todoListDone.splice(idx, 1);
  saveTodoListLocalStorage();
  renderJob();
}

function handleStatus() {
  setStatus();
}

function handleEdit(idx, type = false) {
  addTodoBtn.dataset.type = "save";
  addTodoBtn.innerHTML = "Save";
  type
    ? (inputTodo.value = todoListDone[idx].title)
    : (inputTodo.value = todoListNotDone[idx].title);
  editJobIdx = idx;
  inputTodo.focus();
}

function editJob(idx, type = false) {
  type
    ? (todoListDone[idx].title = inputTodo.value)
    : (todoListNotDone[idx].title = inputTodo.value);
  renderJob();
  clearInput();
  editJobIdx = -1;
  saveTodoListLocalStorage();
}

function saveTodoListLocalStorage() {
  localStorage.setItem("todoListDone", JSON.stringify(todoListDone));
  localStorage.setItem("todoListNotDone", JSON.stringify(todoListNotDone));
}

function resetApp() {
  clearInput();
  addTodoBtn.dataset.type = "add";
  addTodoBtn.innerHTML = "Add";
  inputTodo.focus();
}

function renderJob() {
  handleStatus();
  resetApp();
  let todoNotDoneListHtml = "",
    todoDoneListHtml = "";
  todoDoneListHtml = todoListDone.map(
    (job, index) =>
      `<li class="todo-job done center">
          <div class="todo-job-item center">
            <div onclick="activeNotDone(${index})" class="todo-job-done todo-job-done-${index} center">
              <div class="todo-check"></div>
              <div class="todo-checked">
                <svg class="todo-checked-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM339.8 211.8C350.7 200.9 350.7 183.1 339.8 172.2C328.9 161.3 311.1 161.3 300.2 172.2L192 280.4L147.8 236.2C136.9 225.3 119.1 225.3 108.2 236.2C97.27 247.1 97.27 264.9 108.2 275.8L172.2 339.8C183.1 350.7 200.9 350.7 211.8 339.8L339.8 211.8z"/></svg>  
              </div>
            </div>
            <span>${job.title}</span>
            <button onclick="handleDeleteJob(${index}, true)" class="delete-btn delete-job-${index}">X</button>
            <button onclick="handleEdit(${index}, true)" class="edit-btn edit-job-${index}"><i class="fa-solid fa-pen"></i></button>
          </div>
      </li>`
  );
  todoNotDoneListHtml = todoListNotDone.map(
    (job, index) =>
      `<li class="todo-job center">
          <div class="todo-job-item center">
            <div onclick="activeDone(${index})" class="todo-job-done todo-job-done-${index} center">
              <div class="todo-check"></div>
              <div class="todo-checked">
                <svg class="todo-checked-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM339.8 211.8C350.7 200.9 350.7 183.1 339.8 172.2C328.9 161.3 311.1 161.3 300.2 172.2L192 280.4L147.8 236.2C136.9 225.3 119.1 225.3 108.2 236.2C97.27 247.1 97.27 264.9 108.2 275.8L172.2 339.8C183.1 350.7 200.9 350.7 211.8 339.8L339.8 211.8z"/></svg>  
              </div>
            </div>
            <span>${job.title}</span>
            <button onclick="handleDeleteJob(${index})" class="delete-btn delete-job-${index}">X</button>
            <button onclick="handleEdit(${index})" class="edit-btn edit-job-${index}"><i class="fa-solid fa-pen"></i></button>
          </div>
      </li>`
  );
  listNotTodo.innerHTML = todoNotDoneListHtml;
  listTodo.innerHTML = todoDoneListHtml;
}

function setStatus() {
  const doneStatus = document.querySelector(".done-status");
  const notDoneStatus = document.querySelector(".not-done-status");
  doneStatus.innerText =
    todoListDone.length + "/" + (todoListNotDone.length + todoListDone.length);
  notDoneStatus.innerText =
  todoListNotDone.length + "/" + (todoListNotDone.length + todoListDone.length);
}

function addJob(job) {
  todoListNotDone.push({
    title: job,
    done: false,
  });
}
