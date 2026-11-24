import { combineReducers } from '@reduxjs/toolkit';
import authentication from '../Reducers/Auth';
import categoryReducer from '../Reducers/CategoryReducer';
import manufacturerReducer from '../Reducers/ManufacturerReducer';
import productsReducer from '../Reducers/ProductsReducer';
import { cartReducer } from '../Reducers/CartReducer';
import ordersReducer from '../Reducers/OrderReducer';
import subCategoryReducer from '../Reducers/SubCategoryReducer';

const rootReducer = combineReducers({
  auth: authentication,
  categories: categoryReducer,
  subcategories: subCategoryReducer,
  manufacturers: manufacturerReducer,
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
});

export default rootReducer;
