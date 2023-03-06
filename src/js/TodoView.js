import Storage from "./Storage.js";
const toggleAddTodo = document.querySelector(".toggle-input");
const todoInputBox = document.querySelector(".input-box");
const addTodoInput = document.querySelector(".input-box input");
const addTodoBtn = document.querySelector(".addtodo");
const todoList = document.querySelector(".todo-list");
const sideBarToggler = document.querySelector(".expand-app");
const sideBarTogglerLogo = document.querySelector(".expand-app i");
const mainContainer = document.querySelector(".main");
const appDay = document.querySelector(".day");
const appYear = document.querySelector(".date span .year");
const appMonth = document.querySelector(".date span .month");
const monthDay = document.querySelector(".month-day");
const editTodoModal = document.querySelector(".edit-todo");
const closeEditModalBtn = document.querySelector(".close-edit-modal");
const backdrop = document.querySelector(".backdrop");
class TodoView {
  constructor() {
    toggleAddTodo.addEventListener("click", (e) => this.toggleInputBox());
    addTodoBtn.addEventListener("click", (e) => this.addTodo(e));
    sideBarToggler.addEventListener("click", (e) => this.toggleSideBar());
    closeEditModalBtn.addEventListener("click", (e) =>
      this.toggleEditTodoModal()
    );
    this.setAppDate();
    this.todos = [];
    this.todoFunctions = [];
    this.todoObjects = [];
  }
  setApp() {
    this.todos = Storage.getAllTodos();
    this.createTodoList(this.todos);
  }
  toggleInputBox() {
    todoInputBox.classList.toggle("input-box-active");
  }
  addTodo(e) {
    const todo = {
      title: addTodoInput.value,
    };
    Storage.saveTodo(todo);
    this.setApp();
    this.toggleInputBox();
    addTodoInput.value = "";
  }
  createTodoList(todos) {
    let result = "";
    todos.forEach((todo) => {
      result += `
            <li class="list-item" data-id="${todo.id}">
            <p class="todo-title">${todo.title}</p>
            <div class="todo-functions " data-id="${todo.id}">
            <button class="todo-done-btn">
              <i class="fa-regular fa-circle"></i>
            </button>
         <i class="fa-solid fa-pen"></i><i class="fa-solid fa-trash-can"></i>
          </div>
          </li>`;
    });
    todoList.innerHTML = result;
    const todoFunctions = [...document.querySelectorAll(".todo-functions")];
    this.todoFunctions = todoFunctions;
    todoFunctions.forEach((f) => {
      f.addEventListener("click", (e) => this.todoLogic(e));
    });
    this.todoObjects = [...document.querySelectorAll(".list-item")];
    this.checkCompleted(this.todos, this.todoObjects);
  }

  toggleSideBar() {
    if (sideBarTogglerLogo.classList.contains("fa-arrow-right")) {
      mainContainer.classList.add("main-active");
      sideBarTogglerLogo.classList.remove("fa-arrow-right");
      sideBarTogglerLogo.classList.add("fa-arrow-left");
      this.todoFunctions.forEach((f) => {
        f.classList.add("todo-functions-da");
      });
    } else if (sideBarTogglerLogo.classList.contains("fa-arrow-left")) {
      mainContainer.classList.remove("main-active");
      sideBarTogglerLogo.classList.add("fa-arrow-right");
      sideBarTogglerLogo.classList.remove("fa-arrow-left");
      this.todoFunctions.forEach((f) => {
        f.classList.remove("todo-functions-da");
      });
    }
  }
  closeSideBar() {
    mainContainer.classList.remove("main-active");
    sideBarTogglerLogo.classList.add("fa-arrow-right");
    sideBarTogglerLogo.classList.remove("fa-arrow-left");
    this.todoFunctions.forEach((f) => {
      f.classList.remove("todo-functions-da");
    });
  }
  todoLogic(e) {
    const value = e.target;
    const id = e.target.parentElement.dataset.id;
    if (value.classList.contains("fa-pen")) {
      this.editTodo(id);
    }
    if (value.classList.contains("fa-circle")) {
      this.completeTodo(e);
    }
    if (value.classList.contains("fa-trash-can")) {
      this.deleteTodo(id);
    }
  }
  deleteTodo(id) {
    Storage.deleteTodo(id);
    this.setApp();
    this.toggleSideBar();
  }
  completeTodo(e) {
    const todo = e.target.parentElement.parentElement.parentElement;
    Storage.completeTodo(todo);
    this.setApp();
  }
  setAppDate() {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUNE",
      "JULY",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    appDay.innerText = days[new Date().getDay()];
    appYear.innerText = new Date().getFullYear();
    monthDay.innerText = new Date().getDate();
    appMonth.innerText = months[new Date().getMonth()];
  }
  findActiveTodo(id) {
    return this.todos.find((todo) => {
      return parseInt(todo.id) == parseInt(id);
    });
  }
  checkCompleted(todos, todoObjects) {
    const completedTodos = todos.filter((todo) => {
      return todo.completed == true;
    });
    const filtereById = (arr1, arr2) => {
      let res = [];
      res = arr1.filter((el) => {
        return arr2.find((element) => {
          return element.id == el.dataset.id;
        });
      });
      return res;
    };
    const filteredTodos = filtereById(todoObjects, completedTodos);
    filteredTodos.forEach((todo) => {
      todo.classList.toggle("completed-todo");
      const todoLogo = todo.childNodes[3].childNodes[1].childNodes[1];
      todoLogo.classList.remove("fa-regular");
      todoLogo.classList.remove("fa-circle");
      todoLogo.classList.add("fa-solid");
      todoLogo.classList.add("fa-check");
    });
    this.closeSideBar();
  }
  createEditTodoInput(confirmBtn, currentTitle) {
    const editTodoInput = document.createElement("input");
    editTodoInput.classList.add("edit-input");
    editTodoInput.type = "text";
    editTodoInput.value = currentTitle;
    editTodoInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        confirmBtn.click();
      }
    });
    return editTodoInput;
  }
  editTodo(id) {
    this.toggleEditTodoModal();
    const activeTodo = this.findActiveTodo(id);
    const currentTitle = activeTodo.title;
    const confirmEdit = document.querySelector("#confirm-edit");
    const editTodoInput = this.createEditTodoInput(confirmEdit, currentTitle);
    // Create a new input field for editing the todo

    // Replace the existing input field with the new one
    const editTodoContainer = document.querySelector(".edit-wrapper");
    editTodoContainer.innerHTML = "";
    editTodoContainer.appendChild(editTodoInput);

    confirmEdit.addEventListener("click", (e) => {
      const newTitle = editTodoInput.value;
      const index = this.todos.findIndex(
        (todo) => parseInt(todo.id) === parseInt(id)
      );
      if (index !== -1) {
        // Update the title of the corresponding todo object in the todos array
        this.todos[index].title = newTitle;

        // Save the updated todos array to localStorage
        localStorage.setItem("todos", JSON.stringify(this.todos));

        // Update the UI to reflect the updated todos array
        this.setApp();
        editTodoModal.classList.remove("modal-active");
        backdrop.style.display = "none";
      }
    });
  }

  toggleEditTodoModal() {
    if (editTodoModal.classList.contains("modal-active")) {
      editTodoModal.classList.remove("modal-active");
      backdrop.style.display = "none";
    } else if (!editTodoModal.classList.contains("modal-active")) {
      editTodoModal.classList.add("modal-active");
      backdrop.style.display = "block";
    }
  }
}
export default new TodoView();
