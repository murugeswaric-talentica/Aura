import { ACTION_TYPES } from '../../constants';
import historyReducer from '../reducers/historyReducer';

const historyMiddleware = store => {
  let history = {
    past: [],
    future: []
  };

  return next => action => {
    // Get current state before action is applied
    const currentState = store.getState().editor;

    // Update history based on the action
    if (action.type === ACTION_TYPES.UNDO) {
      if (history.past.length > 0) {
        const previousState = history.past[history.past.length - 1];
        
        // Update our local history tracker before dispatching load state
        history = historyReducer(history, action, currentState);
        
        // Dispatch a load state action with the previous state
        store.dispatch({
          type: ACTION_TYPES.LOAD_STATE,
          payload: previousState
        });
        
        // Return early to prevent double history update
        return next(action);
      }
      return next(action);
    }

    if (action.type === ACTION_TYPES.REDO) {
      if (history.future.length > 0) {
        const nextState = history.future[0];
        
        // Update our local history tracker before dispatching load state
        history = historyReducer(history, action, currentState);
        
        // Dispatch a load state action with the next state
        store.dispatch({
          type: ACTION_TYPES.LOAD_STATE,
          payload: nextState
        });
        
        // Return early to prevent double history update
        return next(action);
      }
      return next(action);
    }
    
    // Let the action go through the normal flow for other actions
    const result = next(action);

    // Update history for all other actions
    history = historyReducer(history, action, currentState);

    return result;
  };
};

export default historyMiddleware;