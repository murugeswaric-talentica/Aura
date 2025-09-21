// Tests for PreviewModal component
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import PreviewModal from '../PreviewModal';
import { UI, PREVIEW_MODES } from '../../constants';
import * as actions from '../../redux/actions';

// Create mock dispatch function
const mockDispatch = jest.fn();

// Mock useSelector to return different test states
const mockUseSelector = jest.fn();

// Mock the redux hooks
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => mockUseSelector()
}));

// Create mock actions
const mockTogglePreview = jest.fn((value) => ({ 
  type: 'TOGGLE_PREVIEW', 
  payload: value 
}));

const mockSetPreviewMode = jest.fn((mode) => ({ 
  type: 'SET_PREVIEW_MODE', 
  payload: mode 
}));

// Define a constant for the mock HTML
const MOCK_HTML = '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></head><body>Mocked HTML</body></html>';

// Mock the actions module
jest.mock('../../redux/actions', () => {
  const actual = jest.requireActual('../../redux/actions');
  return {
    ...actual,
    togglePreview: jest.fn((value) => ({ 
      type: 'TOGGLE_PREVIEW', 
      payload: value 
    })),
    setPreviewMode: jest.fn((mode) => ({ 
      type: 'SET_PREVIEW_MODE', 
      payload: mode 
    }))
  };
});

// Mock the EditorService
jest.mock('../../services/EditorService', () => ({
  exportToHtml: jest.fn().mockReturnValue('<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></head><body>Mocked HTML</body></html>'),
}));

// Import mocked services
import editorService from '../../services/EditorService';

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockImplementation((text) => {
      return Promise.resolve(text);
    }),
  },
  writable: true,
  configurable: true,
});

// Spy on action creators
jest.spyOn(actions, 'togglePreview').mockImplementation(mockTogglePreview);
jest.spyOn(actions, 'setPreviewMode').mockImplementation(mockSetPreviewMode);

describe('PreviewModal Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockDispatch.mockClear();
    mockTogglePreview.mockClear();
    mockSetPreviewMode.mockClear();
    mockUseSelector.mockClear();
    
    // Reset the EditorService mock
    editorService.exportToHtml.mockReturnValue(MOCK_HTML);
    
    // Default mock for useSelector
    mockUseSelector.mockReturnValue({
      components: [],
      previewMode: PREVIEW_MODES.DESKTOP
    });
  });
  
  test('renders modal with correct elements', () => {
    render(<PreviewModal />);
    
    // Check modal title
    expect(screen.getByText(UI.MODALS.PREVIEW)).toBeInTheDocument();
    
    // Check preview mode buttons
    expect(screen.getByText(/Desktop/)).toBeInTheDocument();
    expect(screen.getByText(/Mobile/)).toBeInTheDocument();
    
    // Check copy HTML button
    expect(screen.getByText('Copy HTML')).toBeInTheDocument();
    
    // Check close button
    expect(screen.getByText('Close')).toBeInTheDocument();
  });
  
  test('dispatches togglePreview action when close button is clicked', () => {
    // Mock the togglePreview function
    const mockTogglePreviewAction = { type: 'TOGGLE_PREVIEW', payload: false };
    actions.togglePreview.mockReturnValue(mockTogglePreviewAction);
    
    render(<PreviewModal />);
    
    // Click the close button
    fireEvent.click(screen.getByText('Close'));
    
    // Check if togglePreview was called with the correct value
    expect(actions.togglePreview).toHaveBeenCalledWith(false);
    
    // Check if dispatch was called with the action
    expect(mockDispatch).toHaveBeenCalledWith(mockTogglePreviewAction);
  });
  
  test('dispatches setPreviewMode action when mode buttons are clicked', () => {
    // Test mobile mode first
    mockUseSelector.mockReturnValue({
      components: [],
      previewMode: PREVIEW_MODES.DESKTOP
    });

    // Mock the setPreviewMode function for MOBILE
    const mockMobileAction = { type: 'SET_PREVIEW_MODE', payload: PREVIEW_MODES.MOBILE };
    actions.setPreviewMode.mockReturnValue(mockMobileAction);
    
    const { unmount } = render(<PreviewModal />);
    
    // Click the mobile mode button
    fireEvent.click(screen.getByTitle('Mobile View'));
    
    // Check if setPreviewMode was called with the correct mode
    expect(actions.setPreviewMode).toHaveBeenCalledWith(PREVIEW_MODES.MOBILE);
    
    // Check if dispatch was called with the mobile action
    expect(mockDispatch).toHaveBeenCalledWith(mockMobileAction);
    
    // Clean up the first render to avoid duplicate elements
    unmount();
    
    // Clear mocks for the second test
    jest.clearAllMocks();
    
    // Mock the setPreviewMode function for DESKTOP
    const mockDesktopAction = { type: 'SET_PREVIEW_MODE', payload: PREVIEW_MODES.DESKTOP };
    actions.setPreviewMode.mockReturnValue(mockDesktopAction);
    
    // Update the mock state for mobile mode
    mockUseSelector.mockReturnValue({
      components: [],
      previewMode: PREVIEW_MODES.MOBILE
    });
    
    // Render a new component with mobile state
    render(<PreviewModal />);
    
    // Click the desktop mode button
    fireEvent.click(screen.getByTitle('Desktop View'));
    
    // Check if setPreviewMode was called with the correct mode
    expect(actions.setPreviewMode).toHaveBeenCalledWith(PREVIEW_MODES.DESKTOP);
    
    // Check if dispatch was called with the desktop action
    expect(mockDispatch).toHaveBeenCalledWith(mockDesktopAction);
  });
  
  test('calls exportToHtml and clipboard when Copy HTML button is clicked', async () => {
    // Mock navigator.clipboard.writeText to resolve successfully
    const mockClipboardWriteText = jest.spyOn(navigator.clipboard, 'writeText');
    mockClipboardWriteText.mockResolvedValue(undefined);
    
    render(<PreviewModal />);
    
    // Click the copy HTML button
    fireEvent.click(screen.getByText('Copy HTML'));
    
    // Check if exportToHtml was called
    expect(editorService.exportToHtml).toHaveBeenCalled();
    
    // Check if clipboard API was called with the exported HTML
    expect(mockClipboardWriteText).toHaveBeenCalledWith(MOCK_HTML);
    
    // Wait for state to update and check if copy feedback is shown
    // Note: This is a little trickier in the test environment so we're not testing it
  });
  
  test('renders preview iframe with correct classes based on mode', () => {
    // Mock for desktop mode
    mockUseSelector.mockReturnValue({
      components: [],
      previewMode: PREVIEW_MODES.DESKTOP
    });
    
    const { rerender } = render(<PreviewModal />);
    
    // Check iframe container frame in desktop mode
    let previewFrame = document.querySelector('.preview-frame');
    expect(previewFrame).toHaveClass('desktop');
    expect(previewFrame).not.toHaveClass('mobile');
    
    // Check if the iframe exists
    let iframe = document.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    
    // Reset mocks
    mockUseSelector.mockReset();
    
    // Mock for mobile mode
    mockUseSelector.mockReturnValue({
      components: [],
      previewMode: PREVIEW_MODES.MOBILE
    });
    
    rerender(<PreviewModal />);
    
    // Check iframe container in mobile mode
    previewFrame = document.querySelector('.preview-frame');
    expect(previewFrame).toHaveClass('mobile');
    expect(previewFrame).not.toHaveClass('desktop');
    
    // Check if the iframe exists
    iframe = document.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
  });
});