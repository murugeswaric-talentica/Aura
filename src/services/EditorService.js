import { STORAGE_KEYS, ERROR_MESSAGES } from '../constants';

// Check if localStorage is available
const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// EditorService handles data operations
class EditorService {
  constructor() {
    this.storageAvailable = isStorageAvailable();
    if (!this.storageAvailable) {
      console.warn(ERROR_MESSAGES.STORAGE_UNAVAILABLE);
    }
  }

  // Save the entire editor state
  saveEditorState(state) {
    if (!this.storageAvailable) return false;
    
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEYS.EDITOR_STATE, serializedState);
      return true;
    } catch (error) {
      console.error('Error saving editor state:', error);
      return false;
    }
  }

  // Load the entire editor state
  loadEditorState() {
    if (!this.storageAvailable) return null;
    
    try {
      const serializedState = localStorage.getItem(STORAGE_KEYS.EDITOR_STATE);
      if (serializedState === null) return null;
      return JSON.parse(serializedState);
    } catch (error) {
      console.error('Error loading editor state:', error);
      return null;
    }
  }

  // Clear editor state from storage
  clearEditorState() {
    if (!this.storageAvailable) return false;
    
    try {
      localStorage.removeItem(STORAGE_KEYS.EDITOR_STATE);
      return true;
    } catch (error) {
      console.error('Error clearing editor state:', error);
      return false;
    }
  }

  // Generate a unique ID for components
  generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  // Export editor state to HTML
  exportToHtml(components) {
    let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
    html += '  <meta charset="UTF-8">\n';
    html += '  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n';
    html += '  <title>Exported from Aura</title>\n';
    html += '  <style>\n';
    html += '    * { box-sizing: border-box; }\n';
    html += '    html { margin: 0; padding: 0; width: 100%; }\n';
    html += '    body { margin: 0; padding: 0; overflow-x: hidden; width: 100%; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; line-height: 1.5; text-align: left; }\n';
    html += '    .aura-container { position: relative; width: 100%; min-height: 100vh; padding: 10px; margin: 0 auto; max-width: 1200px; }\n';
    html += '    .aura-component { position: absolute; transition: transform 0.2s ease; }\n';
    html += '    .aura-component:hover { transform: scale(1.005); }\n';
    html += '    @media (max-width: 768px) {\n';
    html += '      .aura-component { position: absolute; transform: none !important; }\n';
    html += '    }\n';
    html += '    @media (max-width: 768px) {\n';
    html += '      body { width: 350px; margin: 0 auto; }\n';
    html += '      .aura-container { padding: 5px; position: relative; width: 100%; margin: 0; }\n';
    html += '      .aura-component { max-width: 340px; left: auto !important; right: auto !important; }\n';
    html += '    }\n';
    html += '  </style>\n';
    html += '</head>\n<body>\n';
    html += '  <div class="aura-container">\n';

    // Add each component
    components.forEach(component => {
      html += this.generateComponentHtml(component);
    });

    html += '  </div>\n';
    html += '</body>\n</html>';

    return html;
  }

  // Generate HTML for a specific component
  generateComponentHtml(component) {
    const { type, position, id, ...properties } = component;
    const positionStyle = `left: ${position.x}px; top: ${position.y}px;`;
    // Add mobile positioning attributes as data attributes to be used in media queries
    let style = `position: absolute; ${positionStyle} box-sizing: border-box; text-align: left; `;
    let html = '';

    switch (type) {
      case 'TEXT':
        style += `font-size: ${properties.fontSize}px; font-weight: ${properties.fontWeight}; color: ${properties.color};`;
        html = `    <div id="${id}" class="aura-component" style="${style}">${properties.content}</div>\n`;
        break;
      
      case 'TEXTAREA':
        style += `font-size: ${properties.fontSize}px; color: ${properties.color}; text-align: ${properties.textAlign};`;
        html = `    <div id="${id}" class="aura-component" style="${style}">${properties.content}</div>\n`;
        break;
      
      case 'IMAGE':
        style += `height: ${properties.height}px; width: ${properties.width}px; border-radius: ${properties.borderRadius}px;`;
        html = `    <img id="${id}" class="aura-component" src="${properties.imageUrl}" alt="${properties.altText}" style="${style} object-fit: ${properties.objectFit};" />\n`;
        break;
      
      case 'BUTTON':
        style += `font-size: ${properties.fontSize}px; padding: ${properties.padding}px; background-color: ${properties.backgroundColor}; color: ${properties.textColor}; border-radius: ${properties.borderRadius}px; text-decoration: none; display: inline-block; border: none; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.15); transition: all 0.2s ease;`;
        html = `    <a id="${id}" class="aura-component" href="${properties.url}" style="${style}" onmouseover="this.style.transform='scale(1.05)';this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)';" onmouseout="this.style.transform='scale(1)';this.style.boxShadow='0 2px 5px rgba(0,0,0,0.15)';">${properties.buttonText}</a>\n`;
        break;
      
      default:
        html = `    <div id="${id}" class="aura-component" style="${style}">Unknown component type</div>\n`;
    }

    return html;
  }
}

// Export a singleton instance
const editorService = new EditorService();
export default editorService;