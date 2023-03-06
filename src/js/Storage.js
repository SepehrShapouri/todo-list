export default class Storage {
  static saveTodo(todoToSave) {
    const savedTodos = this.getAllTodos();
    let existedTodos = savedTodos.find((todo) => {
      return parseInt(todo.id) == parseInt(todoToSave.id);
    });
    if (existedTodos) {
      existedTodos.title = todoToSave.title;
      existedTodos.completed = false;
    } else {
      todoToSave.id = new Date().getTime();
      todoToSave.completed = false;
      savedTodos.push(todoToSave);
    }
    localStorage.setItem("todos", JSON.stringify(savedTodos));
    console.log(existedTodos);
  }
  static getAllTodos() {
    return JSON.parse(localStorage.getItem("todos")) || [];
  }
  static deleteTodo(id) {
    const savedTodos = this.getAllTodos();
    const filteredTodos = savedTodos.filter((todo) => {
      return parseInt(todo.id) != parseInt(id);
    });
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
  }
  static completeTodo(todo) {
    const id = todo.dataset.id;
    const savedTodos = this.getAllTodos();
    const completedTodo = savedTodos.find((t) => {
      return parseInt(t.id) == parseInt(id);
    });
    completedTodo.completed = true;
    localStorage.setItem("todos", JSON.stringify(savedTodos));
  }
  static updateTodo(todo) {
    const savedTodos = this.getAllTodos();
    let editedTodo = savedTodos.find(
      (t) => parseInt(t.id) === parseInt(todo.id)
    );
    if (!editedTodo) return
    editedTodo.title = todo.title
    localStorage.setItem("todos", JSON.stringify(savedTodos));
    console.log(editedTodo)
  }
}
