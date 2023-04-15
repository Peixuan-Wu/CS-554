import AppContext from '../context/context';
import React, {useContext} from 'react';
function User(props) {
  const context = useContext(AppContext);
  const deleteUser = () => {
    context.userDispatch({
      type: 'DELETE_USER',
      payload: {id: props.user.id}
    });
  };

  return (
    <div className='todo-wrapper'>
      <table>
        <tbody>
          <tr>
            <td>Name:</td>
            <td>{props.user.name}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{props.user.email}</td>
          </tr>

          <tr>
            <td>
              <button onClick={deleteUser}>Delete User</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default User;
