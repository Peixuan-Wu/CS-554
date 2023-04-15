import './App.css';
import React, {useReducer} from 'react';
import Todos from './components/Todos';
import Users from './components/Users';
import All from './components/All';

import AppContext from './context/context';
import reducers from './reducers';

function App() {
  const [todos, todoDispatch] = useReducer(
    reducers.todos.reducer,
    reducers.todos.initialTodoState
  );
  const [users, userDispatch] = useReducer(
    reducers.users.reducer,
    reducers.users.initialUserState
  );
  return (
    <AppContext.Provider value={{todos, todoDispatch, users, userDispatch}}>
      <div className='App'>
        <div>
          <h1> Todo Tracker</h1>

          <Todos />
        </div>
        <hr />
        <div>
          <h1>Users</h1>
          <Users />
        </div>
        <div>
          <h1>ALL</h1>
          <All />
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
