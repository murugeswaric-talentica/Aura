import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import historyMiddleware from './middleware/historyMiddleware';
import localStorageMiddleware, { loadStateFromLocalStorage } from './middleware/localStorageMiddleware';
import { ACTION_TYPES } from '../constants';

// Load state from localStorage
const persistedState = loadStateFromLocalStorage();

// Create the Redux store
const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState ? { editor: persistedState } : undefined,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(historyMiddleware, localStorageMiddleware)
});

// Initialize state from localStorage if available
if (persistedState) {
  store.dispatch({
    type: ACTION_TYPES.LOAD_STATE,
    payload: persistedState
  });
}

export default store;