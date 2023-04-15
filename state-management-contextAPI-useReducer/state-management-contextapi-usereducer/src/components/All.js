import AppContext from '../context/context';
import {useContext} from 'react';
const All = () => {
  const context = useContext(AppContext);

  return (
    <div className='todos-wrapper'>
      <h2 id='heading'>All State</h2>
      <h3>Todos</h3>
      <ul>
        {context.todos.map((todo) => {
          return <li key={todo.id}>{todo.task}</li>;
        })}
      </ul>
      <br />
      <button
        onClick={() =>
          context.todoDispatch({
            type: 'CREATE_TODO',
            payload: {
              task: 'Task Added from ALL component',
              taskDesc: 'How now brown cow?'
            }
          })
        }
      >
        Add Task
      </button>
      <hr />
      <h3>Users</h3>
      <ul>
        {context.users.map((user) => {
          return <li key={user.id}>{user.name}</li>;
        })}
      </ul>
      <br />
      <button
        onClick={() =>
          context.userDispatch({
            type: 'CREATE_USER',
            payload: {name: 'Mickey Mouse', email: 'MMouse@disney.com'}
          })
        }
      >
        Add User
      </button>
    </div>
  );
};

export default All;
