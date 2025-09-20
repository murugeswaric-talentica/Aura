import React from 'react';
import { COMPONENT_TYPES, DEFAULT_PROPERTIES, UI } from '../../constants';
import './PalettePanel.css';
import editorService from '../../services/EditorService';

function PalettePanel() {
  const componentTypes = Object.values(COMPONENT_TYPES);

  // Handle drag start event
  const handleDragStart = (e, componentType) => {
    // Store component type in dataTransfer
    e.dataTransfer.setData('component-type', componentType);
    // Set effectAllowed to copy
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Render a palette item for each component type
  const renderPaletteItem = (componentType) => {
    let label = '';
    let icon = '📄';

    switch(componentType) {
      case COMPONENT_TYPES.TEXT:
        label = 'Text';
        icon = 'T';
        break;
      case COMPONENT_TYPES.TEXTAREA:
        label = 'TextArea';
        icon = '¶';
        break;
      case COMPONENT_TYPES.IMAGE:
        label = 'Image';
        icon = '🖼️';
        break;
      case COMPONENT_TYPES.BUTTON:
        label = 'Button';
        icon = '🔘';
        break;
      default:
        label = componentType;
    }

    return (
      <div 
        key={componentType} 
        className="component-palette-item"
        draggable={true}
        onDragStart={(e) => handleDragStart(e, componentType)}
      >
        <div className="palette-item-icon">{icon}</div>
        <div className="palette-item-label">{label}</div>
      </div>
    );
  };

  return (
    <div className="panel palette-panel">
      <h3 className="panel-title">{UI.PANELS.PALETTE}</h3>
      <div className="palette-items">
        {componentTypes.map(renderPaletteItem)}
      </div>
    </div>
  );
}

export default PalettePanel;