import React, {useContext, useState} from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';
import AppContext from '../context/context';

function Todos() {
  const [addBtnToggle, setBtnToggle] = useState(false);

  const context = useContext(AppContext);
  console.log(context.todos);
  return (
    <div className='todo-wrapper'>
      <h2>My Todos</h2>
      <button onClick={() => setBtnToggle(!addBtnToggle)}>Add A Todo</button>
      <br />
      <br />
      <br />
      {addBtnToggle && <AddTodo />}
      <br />
      {context.todos.map((todo) => {
        console.log(todo.task);
        return <Todo key={todo.id} todo={todo} />;
      })}
    </div>
  );
}

export default Todos;
