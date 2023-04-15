import todoReducer from './todoReducer';
import userReducer from './userReducer';
const rootReducer = {
  todos: todoReducer,
  users: userReducer
};

export default rootReducer;
