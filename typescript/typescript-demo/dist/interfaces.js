function showTodo(todo) {
    return `Title: ${todo.title} Todo: ${todo.text} `;
}
let myTodo = { title: 'Pay Cable Bill', text: 'Make sure you pay the cable bill by the 15th' };
console.log(showTodo(myTodo));
