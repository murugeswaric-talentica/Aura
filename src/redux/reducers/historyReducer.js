import { ACTION_TYPES } from '../../constants';

const initialState = {
  past: [],
  future: []
};

// Actions that should be tracked for undo/redo
const trackableActions = [
  ACTION_TYPES.ADD_COMPONENT,
  ACTION_TYPES.UPDATE_COMPONENT,
  ACTION_TYPES.DELETE_COMPONENT,
  ACTION_TYPES.MOVE_COMPONENT
];

const historyReducer = (state = initialState, action, currentEditorState) => {
  // Handle UNDO
  if (action.type === ACTION_TYPES.UNDO) {
    if (state.past.length === 0) return state;

    const newPast = state.past.slice(0, state.past.length - 1);

    return {
      past: newPast,
      future: [currentEditorState, ...state.future]
    };
  }

  // Handle REDO
  if (action.type === ACTION_TYPES.REDO) {
    if (state.future.length === 0) return state;

    const newFuture = state.future.slice(1);

    return {
      past: [...state.past, currentEditorState],
      future: newFuture
    };
  }

  // Skip history tracking for these actions
  if (action.type === ACTION_TYPES.LOAD_STATE ||
      action.type === ACTION_TYPES.RESET_STATE) {
    return state;
  }

  // Only track specified actions for history
  if (trackableActions.includes(action.type)) {
    // Limit history to 50 steps
    const MAX_HISTORY = 50;
    const updatedPast = [...state.past, { ...currentEditorState }];
    
    return {
      past: updatedPast.slice(-MAX_HISTORY),
      future: []
    };
  }

  return state;
};

export default historyReducer;