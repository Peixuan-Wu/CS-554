import {useState, useContext} from 'react';
import AppContext from '../context/context';
function AddUser() {
  const context = useContext(AppContext);
  const [formData, setFormData] = useState({task: '', taskDesc: ''});

  const handleChange = (e) => {
    setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
  };
  const addUser = () => {
    context.userDispatch({
      type: 'CREATE_USER',
      payload: {name: formData.name, email: formData.email}
    });
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
  };
  console.log(formData);
  return (
    <div className='add'>
      <div className='input-selection'>
        <label>
          Name:
          <input
            onChange={(e) => handleChange(e)}
            id='name'
            name='name'
            placeholder='Name...'
          />
        </label>
        <label>
          Email:
          <input
            type='email'
            onChange={(e) => handleChange(e)}
            id='email'
            name='email'
            placeholder='Email Address...'
          />
        </label>
      </div>
      <button onClick={addUser}>Add User</button>
    </div>
  );
}

export default AddUser;
