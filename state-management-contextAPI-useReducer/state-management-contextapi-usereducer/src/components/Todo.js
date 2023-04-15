import AppContext from '../context/context';
import React, {useContext} from 'react';
function Todo(props) {
  const context = useContext(AppContext);
  const deleteTodo = () => {
    context.todoDispatch({
      type: 'DELETE_TODO',
      payload: {id: props.todo.id}
    });
  };

  const completeTodoToggle = (compFlag) => {
    if (compFlag === 'comp')
      context.todoDispatch({
        type: 'COMPLETE_TODO',
        payload: {id: props.todo.id}
      }); //dispatch(actions.completeTodo(props.todo.id));
    if (compFlag === 'uncomp')
      context.todoDispatch({
        type: 'UNCOMPLETE_TODO',
        payload: {id: props.todo.id}
      }); //dispatch(actions.uncompleteTodo(props.todo.id));
  };

  return (
    <div className='todo-wrapper'>
      <table>
        <tbody>
          <tr>
            <td>Todo:</td>
            <td>{props.todo.task}</td>
          </tr>
          <tr>
            <td>Todo Description:</td>
            <td>{props.todo.taskDesc}</td>
          </tr>
          <tr>
            <td>Completed:</td>
            <td>{`${props.todo.completed}`}</td>
          </tr>
          <tr>
            <td>
              <button onClick={deleteTodo}>Delete Todo</button>
            </td>
            <td>
              {!props.todo.completed && (
                <button onClick={() => completeTodoToggle('comp')}>
                  Complete
                </button>
              )}
              {props.todo.completed && (
                <button onClick={() => completeTodoToggle('uncomp')}>
                  UnComplete
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Todo;
