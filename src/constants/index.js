// Component Types
export const COMPONENT_TYPES = {
  TEXT: 'TEXT',
  TEXTAREA: 'TEXTAREA',
  IMAGE: 'IMAGE',
  BUTTON: 'BUTTON',
};

// Component Default Properties
export const DEFAULT_PROPERTIES = {
  [COMPONENT_TYPES.TEXT]: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    content: 'Text Component'
  },
  [COMPONENT_TYPES.TEXTAREA]: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'left',
    content: 'TextArea Component'
  },
  [COMPONENT_TYPES.IMAGE]: {
    imageUrl: 'https://via.placeholder.com/150',
    altText: 'Image',
    objectFit: 'cover',
    borderRadius: 0,
    height: 150,
    width: 150
  },
  [COMPONENT_TYPES.BUTTON]: {
    url: '#',
    buttonText: 'Button',
    fontSize: 16,
    padding: 10,
    backgroundColor: '#3498db',
    textColor: '#ffffff',
    borderRadius: 4
  }
};

// Component Property Definitions (for the Properties Panel)
export const PROPERTY_DEFINITIONS = {
  [COMPONENT_TYPES.TEXT]: [
    { 
      id: 'fontSize', 
      label: 'Font Size', 
      type: 'number', 
      min: 8, 
      max: 72, 
      step: 1 
    },
    { 
      id: 'fontWeight', 
      label: 'Font Weight', 
      type: 'select', 
      options: [
        { value: '400', label: '400 - Normal' },
        { value: '700', label: '700 - Bold' }
      ]
    },
    { 
      id: 'color', 
      label: 'Color', 
      type: 'color' 
    },
    {
      id: 'content',
      label: 'Content',
      type: 'text'
    }
  ],
  [COMPONENT_TYPES.TEXTAREA]: [
    { 
      id: 'fontSize', 
      label: 'Font Size', 
      type: 'number', 
      min: 8, 
      max: 72, 
      step: 1 
    },
    { 
      id: 'color', 
      label: 'Color', 
      type: 'color' 
    },
    { 
      id: 'textAlign', 
      label: 'Text Align', 
      type: 'buttonGroup', 
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' }
      ]
    },
    {
      id: 'content',
      label: 'Content',
      type: 'textarea'
    }
  ],
  [COMPONENT_TYPES.IMAGE]: [
    { 
      id: 'imageUrl', 
      label: 'Image URL', 
      type: 'text' 
    },
    { 
      id: 'altText', 
      label: 'Alt Text', 
      type: 'text' 
    },
    { 
      id: 'objectFit', 
      label: 'Object Fit', 
      type: 'select', 
      options: [
        { value: 'cover', label: 'Cover' },
        { value: 'contain', label: 'Contain' },
        { value: 'fill', label: 'Fill' }
      ]
    },
    { 
      id: 'borderRadius', 
      label: 'Border Radius', 
      type: 'number', 
      min: 0, 
      max: 100, 
      step: 1 
    },
    { 
      id: 'height', 
      label: 'Height', 
      type: 'number', 
      min: 10, 
      max: 1000, 
      step: 1 
    },
    { 
      id: 'width', 
      label: 'Width', 
      type: 'number', 
      min: 10, 
      max: 1000, 
      step: 1 
    }
  ],
  [COMPONENT_TYPES.BUTTON]: [
    { 
      id: 'url', 
      label: 'URL', 
      type: 'text' 
    },
    { 
      id: 'buttonText', 
      label: 'Button Text', 
      type: 'text' 
    },
    { 
      id: 'fontSize', 
      label: 'Font Size', 
      type: 'number', 
      min: 8, 
      max: 72, 
      step: 1 
    },
    { 
      id: 'padding', 
      label: 'Padding', 
      type: 'number', 
      min: 0, 
      max: 50, 
      step: 1 
    },
    { 
      id: 'backgroundColor', 
      label: 'Background Color', 
      type: 'color' 
    },
    { 
      id: 'textColor', 
      label: 'Text Color', 
      type: 'color' 
    },
    { 
      id: 'borderRadius', 
      label: 'Border Radius', 
      type: 'number', 
      min: 0, 
      max: 100, 
      step: 1 
    }
  ]
};

// Action Types
export const ACTION_TYPES = {
  // Canvas actions
  ADD_COMPONENT: 'ADD_COMPONENT',
  UPDATE_COMPONENT: 'UPDATE_COMPONENT',
  DELETE_COMPONENT: 'DELETE_COMPONENT',
  MOVE_COMPONENT: 'MOVE_COMPONENT',
  SELECT_COMPONENT: 'SELECT_COMPONENT',
  CLEAR_SELECTION: 'CLEAR_SELECTION',
  
  // History actions
  UNDO: 'UNDO',
  REDO: 'REDO',
  
  // Preview actions
  SET_PREVIEW_MODE: 'SET_PREVIEW_MODE',
  TOGGLE_PREVIEW: 'TOGGLE_PREVIEW',
  
  // Application state
  LOAD_STATE: 'LOAD_STATE',
  RESET_STATE: 'RESET_STATE',
};

// Preview Modes
export const PREVIEW_MODES = {
  DESKTOP: 'DESKTOP',
  MOBILE: 'MOBILE',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  EDITOR_STATE: 'AURA_EDITOR_STATE',
};

// UI Constants
export const UI = {
  PANELS: {
    PALETTE: 'Palette',
    CANVAS: 'Canvas',
    PROPERTIES: 'Properties'
  },
  MODALS: {
    PREVIEW: 'Preview',
  },
  BUTTONS: {
    UNDO: 'Undo',
    REDO: 'Redo',
    PREVIEW: 'Preview',
    COPY_HTML: 'Copy HTML',
    CLOSE: 'Close',
    APPLY: 'Apply',
    CANCEL: 'Cancel'
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  STORAGE_UNAVAILABLE: 'Local storage is not available in this browser.',
  COMPONENT_NOT_FOUND: 'Component not found.',
  INVALID_COMPONENT_TYPE: 'Invalid component type.',
  MAX_HISTORY_REACHED: 'Maximum history limit reached.',
};

// Export all constants as a group
const CONSTANTS = {
  COMPONENT_TYPES,
  DEFAULT_PROPERTIES,
  PROPERTY_DEFINITIONS,
  ACTION_TYPES,
  PREVIEW_MODES,
  STORAGE_KEYS,
  UI,
  ERROR_MESSAGES
};

export default CONSTANTS;