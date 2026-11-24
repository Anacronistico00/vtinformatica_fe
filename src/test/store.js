import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authentication from '../Redux/Reducers/Auth';
import categoryReducer from '../Redux/Reducers/CategoryReducer';
import manufacturerReducer from '../Redux/Reducers/ManufacturerReducer';
import productsReducer from '../Redux/Reducers/ProductsReducer';
import { cartReducer } from '../Redux/Reducers/CartReducer';
import ordersReducer from '../Redux/Reducers/OrderReducer';
import subCategoryReducer from '../Redux/Reducers/SubCategoryReducer';
import { connectApiClient } from '../Redux/Store/connectApiClient';

/** Store reale senza persistenza, collegato al client HTTP: un'istanza nuova per ogni test. */
export const makeStore = (preloadedState) => {
  const store = configureStore({
    reducer: combineReducers({
      auth: authentication,
      categories: categoryReducer,
      subcategories: subCategoryReducer,
      manufacturers: manufacturerReducer,
      products: productsReducer,
      cart: cartReducer,
      orders: ordersReducer,
    }),
    preloadedState,
  });
  connectApiClient(store);
  return store;
};
