// Set up a custom render function that includes Redux Provider
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// Import your reducers
import rootReducer from '../redux/reducers';

/**
 * Custom render function that wraps components with Redux Provider
 * 
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Options for rendering
 * @param {Object} options.preloadedState - Initial state for the Redux store
 * @param {Object} options.store - Custom Redux store
 * @param {Object} options.renderOptions - Additional options for RTL render
 * @returns {Object} - Object containing the rendered component and RTL utilities
 */
function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: rootReducer,
      preloadedState
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  
  return {
    store,
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
  };
}

/**
 * Creates a mock component for testing
 * 
 * @param {string} type - Component type
 * @param {Object} position - Position object with x and y coordinates
 * @param {Object} properties - Additional component properties
 * @returns {Object} - Mock component object
 */
const createMockComponent = (type, position = { x: 0, y: 0 }, properties = {}) => {
  const id = `mock-${Date.now()}`;
  return {
    id,
    type,
    position,
    ...properties
  };
};

/**
 * Creates a mock editor state for testing
 * 
 * @param {Array} components - List of components in the editor
 * @param {string|null} selectedComponentId - ID of the selected component
 * @param {string} previewMode - Current preview mode
 * @param {boolean} isPreviewVisible - Whether preview is visible
 * @returns {Object} - Mock editor state
 */
const createMockEditorState = ({
  components = [],
  selectedComponentId = null,
  previewMode = 'DESKTOP',
  isPreviewVisible = false
} = {}) => {
  return {
    components,
    selectedComponentId,
    previewMode,
    isPreviewVisible
  };
};

export { renderWithProviders, createMockComponent, createMockEditorState };