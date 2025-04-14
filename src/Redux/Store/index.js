import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authentication from '../Reducers/Auth';

const mainReducer = combineReducers({
  auth: authentication,
});

const store = configureStore({
  reducer: mainReducer,
});

export default store;
