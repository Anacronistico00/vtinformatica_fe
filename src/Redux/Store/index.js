import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authentication from '../Reducers/Auth';
import categoryReducer from '../Reducers/CategoryReducer';
import manufacturerReducer from '../Reducers/ManufacturerReducer';

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

const rootReducer = combineReducers({
  auth: authentication,
  categories: categoryReducer,
  manufacturers: manufacturerReducer,
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
