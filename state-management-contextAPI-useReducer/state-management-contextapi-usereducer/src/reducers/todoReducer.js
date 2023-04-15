import {v4 as uuid} from 'uuid';
const initialTodoState = [
  {
    id: uuid(),
    task: 'Pay the Cable Bill',
    taskDesc: 'Pay the cable by the 15th',
    completed: false
  }
];
let copyState = null;
let index = 0;

const reducer = (state, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'CREATE_TODO':
      console.log('payload', payload);
      return [
        ...state,
        {
          id: uuid(),
          task: payload.task,
          taskDesc: payload.taskDesc,
          completed: false
        }
      ];
    case 'DELETE_TODO':
      copyState = [...state];
      index = copyState.findIndex((x) => x.id === payload.id);
      copyState.splice(index, 1);
      return [...copyState];
    case 'COMPLETE_TODO':
      copyState = [...state];
      index = copyState.findIndex((x) => x.id === payload.id);
      copyState[index].completed = true;
      return [...copyState];
    case 'UNCOMPLETE_TODO':
      copyState = [...state];
      index = copyState.findIndex((x) => x.id === payload.id);
      copyState[index].completed = false;
      return [...copyState];
    default:
      return state;
  }
};

let exported = {
  reducer,
  initialTodoState
};
export default exported;
