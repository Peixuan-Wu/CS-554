import {useState, useContext} from 'react';
import AppContext from '../context/context';
import AddUser from './AddUser';
import User from './User';
function Users() {
  const [addBtnToggle, setBtnToggle] = useState(false);
  const context = useContext(AppContext);
  console.log(context.users);
  return (
    <div className='todo-wrapper'>
      <button onClick={() => setBtnToggle(!addBtnToggle)}>Add A User</button>
      <br />
      <br />
      <br />
      {addBtnToggle && <AddUser />}
      <br />
      {context.users.map((user) => {
        return <User key={user.id} user={user} />;
      })}
    </div>
  );
}

export default Users;
