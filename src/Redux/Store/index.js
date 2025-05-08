import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authentication from '../Reducers/Auth';
import categoryReducer from '../Reducers/CategoryReducer';
import manufacturerReducer from '../Reducers/ManufacturerReducer';
import productsReducer from '../Reducers/ProductsReducer';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // salva nel localStorage
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import expireTransform from '../../Utils/PersistConfig';
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

const persistConfig = {
  key: 'root',
  storage,
  transforms: [expireTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
