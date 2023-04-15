const redux = require('@reduxjs/toolkit');
const reducers = require('../reducers');
const store = redux.configureStore({reducer: reducers});
module.exports = store;
