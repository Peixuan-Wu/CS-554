import {v4 as uuid} from 'uuid';
const initialUserState = [
  {
    id: uuid(),
    name: 'Patrick Hill',
    email: 'phill@stevens.edu'
  }
];
let copyState = null;
let index = 0;

const reducer = (state, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'CREATE_USER':
      console.log('payload', payload);
      return [...state, {id: uuid(), name: payload.name, email: payload.email}];
    case 'DELETE_USER':
      copyState = [...state];
      index = copyState.findIndex((x) => x.id === payload.id);
      copyState.splice(index, 1);
      return [...copyState];

    default:
      return state;
  }
};

let exported = {
  reducer,
  initialUserState
};
export default exported;
