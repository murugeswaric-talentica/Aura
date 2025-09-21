// Tests for Toolbar component
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Toolbar from '../Toolbar';
import { UI } from '../../constants';
import * as actions from '../../redux/actions';

// Create mock dispatch function
const mockDispatch = jest.fn();

// Mock react-redux
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch
}));

describe('Toolbar Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockDispatch.mockClear();
  });
  
  test('renders toolbar with title and buttons', () => {
    render(<Toolbar />);
    
    // Check toolbar title
    expect(screen.getByText('Aura Visual Editor')).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByText(UI.BUTTONS.UNDO)).toBeInTheDocument();
    expect(screen.getByText(UI.BUTTONS.REDO)).toBeInTheDocument();
    expect(screen.getByText(UI.BUTTONS.PREVIEW)).toBeInTheDocument();
  });
  
  test('dispatches undo action when undo button is clicked', () => {
    render(<Toolbar />);
    
    // Click the undo button
    fireEvent.click(screen.getByText(UI.BUTTONS.UNDO));
    
    // Check if the undo action was dispatched
    expect(mockDispatch).toHaveBeenCalledWith(actions.undo());
  });
  
  test('dispatches redo action when redo button is clicked', () => {
    render(<Toolbar />);
    
    // Click the redo button
    fireEvent.click(screen.getByText(UI.BUTTONS.REDO));
    
    // Check if the redo action was dispatched
    expect(mockDispatch).toHaveBeenCalledWith(actions.redo());
  });
  
  test('dispatches togglePreview action when preview button is clicked', () => {
    render(<Toolbar />);
    
    // Click the preview button
    fireEvent.click(screen.getByText(UI.BUTTONS.PREVIEW));
    
    // Check if the togglePreview action was dispatched
    expect(mockDispatch).toHaveBeenCalledWith(actions.togglePreview(true));
  });
  
  test('applies correct CSS classes', () => {
    render(<Toolbar />);
    
    // Check toolbar container
    expect(screen.getByText('Aura Visual Editor').parentElement).toHaveClass('toolbar');
    
    // Check buttons
    const undoButton = screen.getByText(UI.BUTTONS.UNDO).closest('button');
    const redoButton = screen.getByText(UI.BUTTONS.REDO).closest('button');
    const previewButton = screen.getByText(UI.BUTTONS.PREVIEW).closest('button');
    
    expect(undoButton).toHaveClass('toolbar-button');
    expect(redoButton).toHaveClass('toolbar-button');
    expect(previewButton).toHaveClass('toolbar-button');
    expect(previewButton).toHaveClass('preview-button');
    
    // Check icons
    expect(screen.getAllByText(/↩️|↪️|👁️/).length).toBe(3);
  });
});