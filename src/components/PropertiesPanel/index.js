import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateComponent } from '../../redux/actions';
import { PROPERTY_DEFINITIONS, UI } from '../../constants';
import './PropertiesPanel.css';

function PropertiesPanel() {
  const dispatch = useDispatch();
  const { components, selectedComponentId } = useSelector(state => state.editor);
  
  // Find selected component
  const selectedComponent = components.find(component => component.id === selectedComponentId);
  
  // Handle property change
  const handlePropertyChange = (propertyId, value) => {
    if (!selectedComponent) return;
    
    // Dispatch update component action
    dispatch(updateComponent(selectedComponent.id, { [propertyId]: value }));
  };
  
  // Render a property control based on its type
  const renderPropertyControl = (property) => {
    // If property is hidden, don't render it
    if (property.hidden) return null;
    
    // If component or property doesn't exist, don't render
    if (!selectedComponent || !property) return null;
    
    // Get property value from component
    const value = selectedComponent[property.id];
    
    // Switch based on property type
    switch (property.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handlePropertyChange(property.id, e.target.value)}
            className="property-input"
          />
        );
        
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handlePropertyChange(property.id, e.target.value)}
            className="property-input property-textarea"
            rows={4}
          />
        );
        
      case 'number':
        return (
          <div className="property-number-control">
            <input
              type="number"
              value={value || 0}
              min={property.min}
              max={property.max}
              step={property.step}
              onChange={(e) => handlePropertyChange(property.id, Number(e.target.value))}
              className="property-input"
            />
            <input
              type="range"
              value={value || 0}
              min={property.min}
              max={property.max}
              step={property.step}
              onChange={(e) => handlePropertyChange(property.id, Number(e.target.value))}
              className="property-slider"
            />
          </div>
        );
        
      case 'color':
        return (
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => handlePropertyChange(property.id, e.target.value)}
            className="property-input property-color"
          />
        );
        
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handlePropertyChange(property.id, e.target.value)}
            className="property-input"
          >
            {property.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'buttonGroup':
        return (
          <div className="button-group">
            {property.options.map(option => (
              <button
                key={option.value}
                onClick={() => handlePropertyChange(property.id, option.value)}
                className={`button-group-item ${value === option.value ? 'active' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        );
        
      default:
        return <div>Unknown property type: {property.type}</div>;
    }
  };

  return (
    <div className="panel properties-panel">
      <h3 className="panel-title">{UI.PANELS.PROPERTIES}</h3>
      
      {!selectedComponent && (
        <div className="no-selection-message">
          Select a component to edit its properties.
        </div>
      )}
      
      {selectedComponent && (
        <div className="properties-form">
          <div className="property-type">
            <strong>Type:</strong> {selectedComponent.type}
          </div>
          
          {PROPERTY_DEFINITIONS[selectedComponent.type]?.map(property => (
            <div key={property.id} className="property-group">
              <label className="property-label">{property.label}</label>
              {renderPropertyControl(property)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PropertiesPanel;