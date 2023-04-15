import {useState, useContext} from 'react';
import AppContext from '../context/context';
function AddTodo() {
  const context = useContext(AppContext);
  const [formData, setFormData] = useState({task: '', taskDesc: ''});

  const handleChange = (e) => {
    setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
  };
  const addTodo = () => {
    context.todoDispatch({
      type: 'CREATE_TODO',
      payload: {task: formData.task, taskDesc: formData.taskDesc}
    });
    document.getElementById('task').value = '';
    document.getElementById('taskDesc').value = '';
  };
  console.log(formData);
  return (
    <div className='add'>
      <div className='input-selection'>
        <label>
          Todo:
          <input
            onChange={(e) => handleChange(e)}
            id='task'
            name='task'
            placeholder='Todo name...'
          />
        </label>
        <label>
          Todo Description:
          <input
            onChange={(e) => handleChange(e)}
            id='taskDesc'
            name='taskDesc'
            placeholder='Todo Description...'
          />
        </label>
      </div>
      <button onClick={addTodo}>Add Todo</button>
    </div>
  );
}

export default AddTodo;
