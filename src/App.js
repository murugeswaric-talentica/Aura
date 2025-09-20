import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PalettePanel from './components/PalettePanel';
import CanvasPanel from './components/CanvasPanel';
import PropertiesPanel from './components/PropertiesPanel';
import Toolbar from './components/Toolbar';
import PreviewModal from './components/PreviewModal';
import { loadState } from './redux/actions';
import editorService from './services/EditorService';

function App() {
  const dispatch = useDispatch();
  const isPreviewVisible = useSelector(state => state.editor.isPreviewVisible);

  // Load saved state on initial render
  useEffect(() => {
    const savedState = editorService.loadEditorState();
    if (savedState) {
      dispatch(loadState(savedState));
    }
  }, [dispatch]);

  return (
    <div className="app-container">
      <Toolbar />
      
      <PalettePanel />
      <CanvasPanel />
      <PropertiesPanel />
      
      {isPreviewVisible && <PreviewModal />}
    </div>
  );
}

export default App;