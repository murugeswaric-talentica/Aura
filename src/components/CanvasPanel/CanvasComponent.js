import React, { useState, useRef, useEffect } from 'react';
import { COMPONENT_TYPES } from '../../constants';
import './CanvasPanel.css';

// Component renderers based on type
const componentRenderers = {
  [COMPONENT_TYPES.TEXT]: ({ properties, isEditing, onContentChange }) => {
    if (isEditing) {
      return (
        <div
          contentEditable
          suppressContentEditableWarning
          autoFocus
          onBlur={(e) => onContentChange(e.target.textContent)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              e.target.blur();
            }
          }}
          style={{
            fontSize: `${properties.fontSize}px`,
            fontWeight: properties.fontWeight,
            color: properties.color,
            width: '100%',
            minWidth: '50px',
            outline: 'none',
            padding: '5px'
          }}
        >
          {properties.content}
        </div>
      );
    }
    
    return (
      <div style={{
        fontSize: `${properties.fontSize}px`,
        fontWeight: properties.fontWeight,
        color: properties.color,
        minWidth: '50px',
        minHeight: '20px',
        cursor: 'text',
        padding: '5px'
      }}>
        {properties.content || 'Double-click to edit'}
      </div>
    );
  },
  
  [COMPONENT_TYPES.TEXTAREA]: ({ properties, isEditing, onContentChange }) => {
    if (isEditing) {
      return (
        <div
          contentEditable
          suppressContentEditableWarning
          autoFocus
          onBlur={(e) => onContentChange(e.target.textContent)}
          onKeyDown={(e) => {
            // Only blur on Ctrl+Enter for TextArea to allow multiline text
            if (e.key === 'Enter' && e.ctrlKey) {
              e.preventDefault();
              e.target.blur();
            }
          }}
          style={{
            fontSize: `${properties.fontSize}px`,
            color: properties.color,
            textAlign: properties.textAlign,
            minWidth: '100px',
            minHeight: '50px',
            outline: 'none',
            whiteSpace: 'pre-wrap',
            padding: '5px'
          }}
        >
          {properties.content}
        </div>
      );
    }
    
    return (
      <div style={{
        fontSize: `${properties.fontSize}px`,
        color: properties.color,
        textAlign: properties.textAlign,
        whiteSpace: 'pre-wrap',
        minWidth: '100px',
        minHeight: '50px',
        cursor: 'text',
        padding: '5px'
      }}>
        {properties.content || 'Double-click to edit'}
      </div>
    );
  },
  
  [COMPONENT_TYPES.IMAGE]: ({ properties }) => {
    return (
      <img
        src={properties.imageUrl || 'https://via.placeholder.com/150'}
        alt={properties.altText}
        style={{
          height: `${properties.height}px`,
          width: `${properties.width}px`,
          objectFit: properties.objectFit,
          borderRadius: `${properties.borderRadius}px`,
          display: 'block'
        }}
      />
    );
  },
  
  [COMPONENT_TYPES.BUTTON]: ({ properties, isEditing, onContentChange }) => {
    if (isEditing) {
      return (
        <div
          contentEditable
          suppressContentEditableWarning
          autoFocus
          onBlur={(e) => onContentChange(e.target.textContent)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.target.blur();
            }
          }}
          style={{
            fontSize: `${properties.fontSize}px`,
            padding: `${properties.padding}px`,
            backgroundColor: properties.backgroundColor,
            color: properties.textColor,
            borderRadius: `${properties.borderRadius}px`,
            outline: 'none',
            cursor: 'text'
          }}
        >
          {properties.buttonText}
        </div>
      );
    }
    
    return (
      <button
        style={{
          fontSize: `${properties.fontSize}px`,
          padding: `${properties.padding}px`,
          backgroundColor: properties.backgroundColor,
          color: properties.textColor,
          borderRadius: `${properties.borderRadius}px`,
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {properties.buttonText}
      </button>
    );
  }
};

function CanvasComponent({ component, isSelected, onSelect, onMove, onUpdate }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const componentRef = useRef(null);
  
  const { id, type, position } = component;
  const properties = { ...component };
  
  // Extract type and position from properties
  delete properties.id;
  delete properties.type;
  delete properties.position;

  // Handle mouse down event for dragging
  const handleMouseDown = (e) => {
    if (isEditing) return; // Don't allow dragging while editing
    
    // Prevent text selection during drag
    e.preventDefault();
    
    // Select this component
    onSelect(id);
    
    // Enable dragging
    setIsDragging(true);
    
    // Calculate offset from mouse position to component position
    const componentRect = componentRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - componentRect.left,
      y: e.clientY - componentRect.top
    });
  };

  // Handle double click for inline editing
  const handleDoubleClick = (e) => {
    // Only enable editing for text-based components
    if (type === COMPONENT_TYPES.TEXT || type === COMPONENT_TYPES.TEXTAREA || type === COMPONENT_TYPES.BUTTON) {
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  // Handle content change for inline editing
  const handleContentChange = (newContent) => {
    // Update content based on component type
    if (type === COMPONENT_TYPES.TEXT || type === COMPONENT_TYPES.TEXTAREA) {
      onContentChange({ content: newContent });
    } else if (type === COMPONENT_TYPES.BUTTON) {
      onContentChange({ buttonText: newContent });
    }
    
    setIsEditing(false);
  };

  // Handle content change by updating Redux store
  const onContentChange = (changes) => {
    // Update the component's properties in Redux
    if (onUpdate) {
      onUpdate(id, changes);
    }
  };

  // Add global mouse move and mouse up event listeners for dragging
  useEffect(() => {
    // Handle mouse move event
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      // Calculate new position based on mouse position and offset
      const parentRect = componentRef.current.parentElement.getBoundingClientRect();
      const newX = e.clientX - parentRect.left - dragOffset.x;
      const newY = e.clientY - parentRect.top - dragOffset.y;
      
      // Update component position in Redux store
      onMove(id, { x: newX, y: newY });
    };
    
    // Handle mouse up event
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    // Add event listeners if dragging
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, id, onMove]);

  // Get renderer based on component type
  const renderComponent = componentRenderers[type] || (() => <div>Unknown Component</div>);

  return (
    <div
      ref={componentRef}
      className={`component ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        left: position.x,
        top: position.y
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={(e) => handleDoubleClick(e)}
    >
      {renderComponent({ properties, isEditing, onContentChange: handleContentChange })}
    </div>
  );
}

export default CanvasComponent;