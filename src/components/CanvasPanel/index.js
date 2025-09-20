import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComponent, selectComponent, clearSelection, moveComponent, updateComponent } from '../../redux/actions';
import { COMPONENT_TYPES, DEFAULT_PROPERTIES, UI } from '../../constants';
import './CanvasPanel.css';
import editorService from '../../services/EditorService';
import CanvasComponent from './CanvasComponent';

function CanvasPanel() {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  
  // Get components from Redux store
  const { components, selectedComponentId } = useSelector(state => state.editor);
  
  // Handle drop event when a component is dropped on the canvas
  const handleDrop = (e) => {
    e.preventDefault();
    
    // Get component type from dataTransfer
    const componentType = e.dataTransfer.getData('component-type');
    
    // If no component type, return
    if (!componentType) return;
    
    // Get canvas bounding box
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    // Calculate drop position relative to canvas
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;
    
    // Create new component
    const newComponent = {
      id: editorService.generateUniqueId(),
      type: componentType,
      position: { x, y },
      ...DEFAULT_PROPERTIES[componentType]
    };
    
    // Dispatch action to add component to store
    dispatch(addComponent(newComponent));
  };
  
  // Handle dragover event
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  
  // Handle click on canvas background
  const handleCanvasClick = (e) => {
    // If the click target is the canvas itself, clear selection
    if (e.target === canvasRef.current) {
      dispatch(clearSelection());
    }
  };

  // Handle component movement on the canvas
  const moveComponentOnCanvas = useCallback((id, position) => {
    dispatch(moveComponent(id, position));
  }, [dispatch]);

  // Handle component selection
  const handleSelectComponent = useCallback((id) => {
    dispatch(selectComponent(id));
  }, [dispatch]);

  // Handle component property updates
  const updateComponentProperties = useCallback((id, properties) => {
    dispatch(updateComponent(id, properties));
  }, [dispatch]);

  return (
    <div className="panel canvas-panel">
      <h3 className="panel-title">{UI.PANELS.CANVAS}</h3>
      <div 
        ref={canvasRef}
        className="canvas"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleCanvasClick}
      >
        {components.map((component) => (
          <CanvasComponent
            key={component.id}
            component={component}
            isSelected={component.id === selectedComponentId}
            onSelect={handleSelectComponent}
            onMove={moveComponentOnCanvas}
            onUpdate={updateComponentProperties}
          />
        ))}
      </div>
    </div>
  );
}

export default CanvasPanel;