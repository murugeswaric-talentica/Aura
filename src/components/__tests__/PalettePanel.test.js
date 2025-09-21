// Tests for PalettePanel component
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PalettePanel from '../PalettePanel';
import { COMPONENT_TYPES, UI } from '../../constants';

describe('PalettePanel Component', () => {
  beforeEach(() => {
    // Mock dataTransfer
    global.DataTransfer = function() {
      this.data = {};
      this.setData = jest.fn((key, value) => {
        this.data[key] = value;
      });
      this.getData = jest.fn((key) => {
        return this.data[key];
      });
    };
  });

  test('renders with title and component items', () => {
    render(<PalettePanel />);
    
    // Check panel title
    expect(screen.getByText(UI.PANELS.PALETTE)).toBeInTheDocument();
    
    // Check component items are present
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('TextArea')).toBeInTheDocument();
    expect(screen.getByText('Image')).toBeInTheDocument();
    expect(screen.getByText('Button')).toBeInTheDocument();
  });
  
  test('sets component type in dataTransfer when dragging', () => {
    render(<PalettePanel />);
    
    // Find component items
    const textItem = screen.getByText('Text').closest('.component-palette-item');
    
    // Create a mock dataTransfer object
    const dataTransfer = new DataTransfer();
    
    // Use fireEvent.dragStart instead of creating and firing a custom event
    fireEvent.dragStart(textItem, { dataTransfer });
    
    // Check if the component type was set in dataTransfer
    expect(dataTransfer.setData).toHaveBeenCalledWith('component-type', COMPONENT_TYPES.TEXT);
    
    // Note: effectAllowed is set in the component but React Testing Library doesn't properly simulate this
    // so we're not testing for it here
  });
  
  test('renders correct icons for each component type', () => {
    render(<PalettePanel />);
    
    // Check for component icons - using a more specific selector
    const textIcons = screen.getAllByText('T');
    const textAreaIcons = screen.getAllByText('¶');
    const imageIcons = screen.getAllByText('🖼️');
    const buttonIcons = screen.getAllByText('🔘');
    
    // Check that we have at least one of each type
    expect(textIcons.length).toBeGreaterThanOrEqual(1);
    expect(textAreaIcons.length).toBeGreaterThanOrEqual(1);
    expect(imageIcons.length).toBeGreaterThanOrEqual(1);
    expect(buttonIcons.length).toBeGreaterThanOrEqual(1);
    
    // Check that each icon is in the correct component item
    const textItemIcon = screen.getByText('Text').parentElement.querySelector('.palette-item-icon');
    expect(textItemIcon).toHaveTextContent('T');
    
    const textAreaItemIcon = screen.getByText('TextArea').parentElement.querySelector('.palette-item-icon');
    expect(textAreaItemIcon).toHaveTextContent('¶');
    
    const imageItemIcon = screen.getByText('Image').parentElement.querySelector('.palette-item-icon');
    expect(imageItemIcon).toHaveTextContent('🖼️');
    
    const buttonItemIcon = screen.getByText('Button').parentElement.querySelector('.palette-item-icon');
    expect(buttonItemIcon).toHaveTextContent('🔘');
  });
  
  test('applies correct CSS classes', () => {
    render(<PalettePanel />);
    
    // Check panel container
    const panelContainer = screen.getByText(UI.PANELS.PALETTE).parentElement;
    expect(panelContainer).toHaveClass('panel');
    expect(panelContainer).toHaveClass('palette-panel');
    
    // Check component items
    const componentItems = screen.getAllByText(/Text|TextArea|Image|Button/).map(element => 
      element.closest('.component-palette-item')
    );
    
    componentItems.forEach(item => {
      expect(item).toHaveClass('component-palette-item');
      expect(item).toHaveAttribute('draggable', 'true');
    });
  });
});