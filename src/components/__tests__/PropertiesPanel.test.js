// Tests for PropertiesPanel component
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PropertiesPanel from '../PropertiesPanel';
import { COMPONENT_TYPES, PROPERTY_DEFINITIONS, UI } from '../../constants';
import * as actions from '../../redux/actions';

// Create mock dispatch function
const mockDispatch = jest.fn();

// Mock useSelector to return different test states
const mockUseSelector = jest.fn();

// Mock the redux hooks
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => mockUseSelector()
}));

// Create a mock updateComponent action
const mockUpdateComponent = jest.fn((id, updates) => ({ 
  type: 'UPDATE_COMPONENT', 
  payload: { id, updates } 
}));

// Mock the actions module
jest.mock('../../redux/actions', () => ({
  updateComponent: (id, updates) => ({ 
    type: 'UPDATE_COMPONENT', 
    payload: { id, updates } 
  })
}));

describe('PropertiesPanel Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockDispatch.mockClear();
    mockUpdateComponent.mockClear();
    mockUseSelector.mockClear();
    
    // Setup spy on actions.updateComponent
    jest.spyOn(actions, 'updateComponent').mockImplementation(mockUpdateComponent);
  });
  
  test('renders with title and no properties when no component is selected', () => {
    // Mock the selector to return no selected component
    mockUseSelector.mockReturnValue({
      components: [],
      selectedComponentId: null
    });
    
    render(<PropertiesPanel />);
    
    // Check panel title
    expect(screen.getByText(UI.PANELS.PROPERTIES)).toBeInTheDocument();
    
    // Check no properties message - using the correct text from the component
    expect(screen.getByText('Select a component to edit its properties.')).toBeInTheDocument();
  });
  
  test('renders properties when a component is selected', () => {
    // Mock the selector to return a selected component
    mockUseSelector.mockReturnValue({
      components: [
        {
          id: 'test-component',
          type: COMPONENT_TYPES.TEXT,
          content: 'Test Text',
          fontSize: 16,
          fontWeight: '400',
          color: '#000000'
        }
      ],
      selectedComponentId: 'test-component'
    });
    
    render(<PropertiesPanel />);
    
    // Check panel title
    expect(screen.getByText(UI.PANELS.PROPERTIES)).toBeInTheDocument();
    
    // Check properties
    expect(screen.getByDisplayValue('Test Text')).toBeInTheDocument();
    // Use getAllByDisplayValue for values that might appear in multiple elements
    expect(screen.getAllByDisplayValue('16')[0]).toBeInTheDocument();
    expect(screen.getByDisplayValue('#000000')).toBeInTheDocument();
    
    // Check labels
    const propertyDefs = PROPERTY_DEFINITIONS[COMPONENT_TYPES.TEXT];
    propertyDefs.forEach(prop => {
      if (!prop.hidden) {
        expect(screen.getByText(prop.label)).toBeInTheDocument();
      }
    });
  });
  
  test('dispatches updateComponent action when a property is changed', () => {
    // Mock the selector to return a selected component
    mockUseSelector.mockReturnValue({
      components: [
        {
          id: 'test-component',
          type: COMPONENT_TYPES.TEXT,
          content: 'Test Text',
          fontSize: 16,
          fontWeight: '400',
          color: '#000000'
        }
      ],
      selectedComponentId: 'test-component'
    });
    
    render(<PropertiesPanel />);
    
    // Find content input
    const contentInput = screen.getByDisplayValue('Test Text');
    
    // Change content
    fireEvent.change(contentInput, { target: { value: 'Updated Text' } });
    
    // Only check that dispatch was called with the correct action
    expect(mockDispatch).toHaveBeenCalledWith({ 
      type: 'UPDATE_COMPONENT', 
      payload: { id: 'test-component', updates: { content: 'Updated Text' } } 
    });
  });
  
  test('renders different property controls based on property type', () => {
    // Mock the selector to return a component with different property types
    mockUseSelector.mockReturnValue({
      components: [
        {
          id: 'test-component',
          type: COMPONENT_TYPES.BUTTON,
          buttonText: 'Test Button',
          backgroundColor: '#3498db',
          textColor: '#ffffff',
          borderRadius: 4,
          fontSize: 16,
          padding: 10
        }
      ],
      selectedComponentId: 'test-component'
    });
    
    render(<PropertiesPanel />);
    
    // Check for text input
    expect(screen.getByDisplayValue('Test Button')).toBeInTheDocument();
    
    // Check for color input
    const colorInputs = screen.getAllByDisplayValue(/#[0-9a-f]{6}/i);
    expect(colorInputs.length).toBeGreaterThan(0);
    
    // Check for number input - using getAllByDisplayValue for values that appear in multiple elements
    expect(screen.getAllByDisplayValue('4')[0]).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('16')[0]).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('10')[0]).toBeInTheDocument();
  });
  
  test('applies correct CSS classes', () => {
    // Mock the selector to return a selected component
    mockUseSelector.mockReturnValue({
      components: [
        {
          id: 'test-component',
          type: COMPONENT_TYPES.TEXT,
          content: 'Test Text',
          fontSize: 16,
          fontWeight: '400',
          color: '#000000'
        }
      ],
      selectedComponentId: 'test-component'
    });
    
    render(<PropertiesPanel />);
    
    // Check panel container
    const panelContainer = screen.getByText(UI.PANELS.PROPERTIES).parentElement;
    expect(panelContainer).toHaveClass('properties-panel');
    
    // Check property groups instead of property items
    const propertyGroups = document.querySelectorAll('.property-group');
    expect(propertyGroups.length).toBeGreaterThan(0);
    
    // Check property inputs
    const propertyInputs = document.querySelectorAll('.property-input');
    expect(propertyInputs.length).toBeGreaterThan(0);
  });
});