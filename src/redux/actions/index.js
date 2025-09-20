import { ACTION_TYPES } from '../../constants';

// Component actions
export const addComponent = (component) => ({
  type: ACTION_TYPES.ADD_COMPONENT,
  payload: component
});

export const updateComponent = (id, properties) => ({
  type: ACTION_TYPES.UPDATE_COMPONENT,
  payload: {
    id,
    properties
  }
});

export const deleteComponent = (id) => ({
  type: ACTION_TYPES.DELETE_COMPONENT,
  payload: id
});

export const moveComponent = (id, position) => ({
  type: ACTION_TYPES.MOVE_COMPONENT,
  payload: {
    id,
    position
  }
});

export const selectComponent = (id) => ({
  type: ACTION_TYPES.SELECT_COMPONENT,
  payload: id
});

export const clearSelection = () => ({
  type: ACTION_TYPES.CLEAR_SELECTION
});

// History actions
export const undo = () => ({
  type: ACTION_TYPES.UNDO
});

export const redo = () => ({
  type: ACTION_TYPES.REDO
});

// Preview actions
export const setPreviewMode = (mode) => ({
  type: ACTION_TYPES.SET_PREVIEW_MODE,
  payload: mode
});

export const togglePreview = (isVisible) => ({
  type: ACTION_TYPES.TOGGLE_PREVIEW,
  payload: isVisible
});

// Application state
export const loadState = (state) => ({
  type: ACTION_TYPES.LOAD_STATE,
  payload: state
});

export const resetState = () => ({
  type: ACTION_TYPES.RESET_STATE
});