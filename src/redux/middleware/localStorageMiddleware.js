import { STORAGE_KEYS } from '../../constants';

const localStorageMiddleware = store => next => action => {
  // Let action go through the normal flow
  const result = next(action);
  
  // After state changes, save to localStorage
  const state = store.getState();
  try {
    const serializedState = JSON.stringify(state.editor);
    localStorage.setItem(STORAGE_KEYS.EDITOR_STATE, serializedState);
  } catch (err) {
    console.error('Could not save state to localStorage:', err);
  }
  
  return result;
};

export const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEYS.EDITOR_STATE);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load state from localStorage:', err);
    return undefined;
  }
};

export default localStorageMiddleware;