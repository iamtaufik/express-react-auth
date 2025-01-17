import { configureStore } from '@reduxjs/toolkit';
import authTokenSlice from './authSlice';
// @ts-ignore
import storageSession from 'redux-persist/lib/storage/session';
import { persistStore, persistReducer } from 'redux-persist';

const authTokenPersistConfig = {
  key: 'authToken',
  storage: storageSession,
};

export const store = configureStore({
  reducer: {
    authToken: persistReducer(authTokenPersistConfig, authTokenSlice.reducer),
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export const persistor = persistStore(store);
