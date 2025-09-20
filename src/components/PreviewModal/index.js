import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { togglePreview, setPreviewMode } from '../../redux/actions';
import { UI, PREVIEW_MODES } from '../../constants';
import './PreviewModal.css';
import editorService from '../../services/EditorService';

function PreviewModal() {
  const dispatch = useDispatch();
  const { components, previewMode } = useSelector(state => state.editor);
  const [copied, setCopied] = useState(false);
  
  // Handle close button click
  const handleClose = () => {
    dispatch(togglePreview(false));
  };
  
  // Handle mode change
  const handleModeChange = (mode) => {
    dispatch(setPreviewMode(mode));
  };
  
  // Handle copy HTML button click
  const handleCopyHtml = () => {
    const html = editorService.exportToHtml(components);
    navigator.clipboard.writeText(html)
      .then(() => {
        setCopied(true);
        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy HTML:', err);
      });
  };

  // Generate HTML for preview with responsive modifications
  const mobileMetaTag = '<meta name="viewport" content="width=350, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">';
  const desktopMetaTag = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
  
  // Generate base HTML
  const baseHtml = editorService.exportToHtml(components);
  
  // Insert appropriate meta tag based on preview mode
  const previewHtml = previewMode === PREVIEW_MODES.MOBILE
    ? baseHtml.replace('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">', mobileMetaTag)
    : baseHtml.replace('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">', desktopMetaTag);
  
  return (
    <div className="modal">
      <div className="modal-content preview-modal">
        <div className="preview-header">
          <h3 className="preview-title">{UI.MODALS.PREVIEW}</h3>
          <div className="preview-actions">
            <div className="preview-mode-selector">
              <button 
                className={`mode-button ${previewMode === PREVIEW_MODES.DESKTOP ? 'active' : ''}`}
                onClick={() => handleModeChange(PREVIEW_MODES.DESKTOP)}
                title="Desktop View"
              >
                💻 Desktop
              </button>
              <button 
                className={`mode-button ${previewMode === PREVIEW_MODES.MOBILE ? 'active' : ''}`}
                onClick={() => handleModeChange(PREVIEW_MODES.MOBILE)}
                title="Mobile View"
              >
                📱 Mobile
              </button>
            </div>
            <button 
              className="copy-button"
              onClick={handleCopyHtml}
            >
              {copied ? '✅ Copied!' : `${UI.BUTTONS.COPY_HTML}`}
            </button>
            <button 
              className="close-button"
              onClick={handleClose}
            >
              {UI.BUTTONS.CLOSE}
            </button>
          </div>
        </div>
        
        <div className="preview-container">
          <div className={`preview-frame ${previewMode === PREVIEW_MODES.MOBILE ? 'mobile' : 'desktop'}`}>
            <iframe
              title="Preview"
              srcDoc={previewHtml}
              className="preview-iframe"
              sandbox="allow-same-origin"
              ref={iframe => {
                if (iframe) {
                  iframe.onload = () => {
                    try {
                      // Add extra styling to the iframe document to fix alignment
                      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                      const style = iframeDoc.createElement('style');
                      style.textContent = `
                        * { text-align: initial; }
                        .aura-container { width: 100% !important; }
                      `;
                      iframeDoc.head.appendChild(style);
                    } catch (e) {
                      console.error("Could not modify iframe document", e);
                    }
                  };
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;