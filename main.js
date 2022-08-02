const inputTodo = document.querySelector(".todo-input");
const listTodo = document.querySelector(".todo-list");
const addTodoBtn = document.querySelector(".btn-todo-add");
const todoList = JSON.parse(localStorage.getItem("todoList")) ?? [];
let todoListDone = [];
let editJobIdx = -1;

window.onload = () => {
  renderJob();
  handleStatus();
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

function handleDeleteJob(index) {
  if (confirm("Do you want to delete ?")) {
    todoList.splice(index, 1);
    todoListDone.splice(index, 1);
    saveTodoListLocalStorage();
    renderJob();
  }
}

function activeDone(idx) {
  listTodo.childNodes[idx].classList.toggle("done");
  if (listTodo.childNodes[idx].classList.contains("done")) {
    todoList[idx].done = true;
    todoListDone.push(listTodo.childNodes[idx]);
  } else {
    todoList[idx].done = false;
    todoListDone.splice(idx, 1);
  }
  saveTodoListLocalStorage();
  renderJob();
}

function checkDone(index) {
  return todoList[index].done ? "done" : "";
}

function handleStatus() {
  todoListDone = todoList.filter((job) => job.done == true);
  setStatus();
}

function handleEdit(idx) {
  addTodoBtn.dataset.type = "save";
  addTodoBtn.innerHTML = "Save";
  inputTodo.value = todoList[idx].title;
  editJobIdx = idx;
  inputTodo.focus();
}

function editJob(idx) {
  todoList[idx].title = inputTodo.value;
  renderJob();
  clearInput();
  editJobIdx = -1;
  console.log(todoList);
  saveTodoListLocalStorage();
}

function saveTodoListLocalStorage() {
  localStorage.setItem("todoList", JSON.stringify(todoList));
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
  let todoListHtml = todoList.map((job, index) => {
    return `<li class="todo-job ${checkDone(index)} center">
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
              </li>`;
  });
  listTodo.innerHTML = todoListHtml.join("");
}

function setStatus() {
  const doneStatus = document.querySelector(".done-status");
  doneStatus.innerText = todoListDone.length + "/" + todoList.length;
}

function addJob(job) {
  todoList.push({
    title: job,
    done: false,
  });
}
