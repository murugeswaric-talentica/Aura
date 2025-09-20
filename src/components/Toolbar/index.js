import React from 'react';
import { useDispatch } from 'react-redux';
import { undo, redo, togglePreview } from '../../redux/actions';
import { UI } from '../../constants';
import './Toolbar.css';

function Toolbar() {
  const dispatch = useDispatch();
  
  // Handle undo button click
  const handleUndo = () => {
    dispatch(undo());
  };
  
  // Handle redo button click
  const handleRedo = () => {
    dispatch(redo());
  };
  
  // Handle preview button click
  const handlePreview = () => {
    dispatch(togglePreview(true));
  };

  return (
    <div className="toolbar">
      <div className="toolbar-title">Aura Visual Editor</div>
      
      <div className="toolbar-actions">
        <button className="toolbar-button" onClick={handleUndo}>
          <span className="toolbar-icon">↩️</span>
          <span>{UI.BUTTONS.UNDO}</span>
        </button>
        
        <button className="toolbar-button" onClick={handleRedo}>
          <span className="toolbar-icon">↪️</span>
          <span>{UI.BUTTONS.REDO}</span>
        </button>
        
        <button className="toolbar-button preview-button" onClick={handlePreview}>
          <span className="toolbar-icon">👁️</span>
          <span>{UI.BUTTONS.PREVIEW}</span>
        </button>
      </div>
    </div>
  );
}

export default Toolbar;