import {v4 as uuid} from 'uuid';
const initalState = [
  {
    id: uuid(),
    task: 'Pay the Cable Bill',
    taskDesc: 'Pay the cable by the 15th',
    completed: false
  }
];

let copyState = null;
let index = 0;

const todoReducer = (state = initalState, action) => {
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
      return state.map((todo) => {
        if (todo.id === payload.id) {
          return {
            ...todo,
            completed: true
          };
        } else return todo;
      });

    case 'UNCOMPLETE_TODO':
      return state.map((todo) => {
        if (todo.id === payload.id) {
          return {
            ...todo,
            completed: false
          };
        } else return todo;
      });
    default:
      return state;
  }
};

export default todoReducer;
