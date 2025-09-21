# Aura Project Structure

This document provides a detailed breakdown of the Aura project structure, explaining the purpose and functionality of each folder and key module.

## Overview

Aura is structured as a modern React application with Redux for state management. The project follows a modular architecture to maintain separation of concerns and improve code maintainability.

## Directory Structure

```
aura/
├── public/                 # Static files
├── src/                    # Source code
│   ├── components/         # React components
│   ├── constants/          # Application constants
│   ├── redux/              # Redux state management
│   ├── services/           # Business logic services
│   ├── App.js              # Main application component
│   └── index.js            # Application entry point
├── node_modules/           # Dependencies (not committed to git)
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Dependency lock file
├── README.md               # Project overview
└── PROJECT_STRUCTURE.md    # This file
```

## Key Directories and Files

### `/public`

Contains static files that are directly copied to the build folder when the application is built:

- `index.html` - The HTML template for the application
- `favicon.ico` - The application icon
- `manifest.json` - Web app manifest for PWA functionality

### `/src`

The main source code directory containing all JavaScript/JSX code:

#### `/src/components`

React components organized by feature or functionality:

- `/CanvasPanel` - The main editing canvas where components are placed and manipulated
  - `CanvasPanel.js` - The main container component for the canvas
  - `CanvasComponent.js` - The individual draggable components rendered on the canvas
  - `CanvasPanel.css` - Styles for the canvas panel

- `/PalettePanel` - The component palette from which users can drag new components
  - `index.js` - The main palette component
  - `PaletteItem.js` - Individual items in the palette
  - `PalettePanel.css` - Styles for the palette

- `/PreviewModal` - Modal for previewing the created design in desktop/mobile modes
  - `index.js` - The preview modal component
  - `PreviewModal.css` - Styles for the preview modal

- `/PropertiesPanel` - Panel for editing the properties of selected components
  - `index.js` - The properties panel container
  - `PropertyControl.js` - Control elements for different property types
  - `PropertiesPanel.css` - Styles for the properties panel

- `/Toolbar` - The top toolbar for application actions
  - `index.js` - The toolbar component
  - `Toolbar.css` - Styles for the toolbar

- `/__tests__` - Test files for components using React Testing Library and Jest
  - Component test files with `.test.js` extension

#### `/src/constants`

Application-wide constant definitions:

- `index.js` - Main constants file containing:
  - `COMPONENT_TYPES` - Enumeration of available component types (TEXT, TEXTAREA, IMAGE, BUTTON)
  - `UI` - User interface text and labels
  - `PREVIEW_MODES` - Enum for preview modes (DESKTOP, MOBILE)
  - `STORAGE_KEYS` - Keys used for localStorage
  - `ERROR_MESSAGES` - Standard error messages
  - `INITIAL_STATE` - Default application state

#### `/src/redux`

Redux state management files:

- `/actions` - Action creators
  - `index.js` - Action creator functions (addComponent, selectComponent, moveComponent, etc.)
  - `types.js` - Action type constants

- `/reducers` - State reducers
  - `index.js` - Root reducer that combines all reducers
  - `editorReducer.js` - Main reducer for editor state
  - `historyReducer.js` - Reducer for undo/redo functionality

- `/middleware` - Redux middleware
  - `historyMiddleware.js` - Middleware for tracking state changes for undo/redo
  - `storageMiddleware.js` - Middleware for persisting state to localStorage

- `store.js` - Redux store configuration

#### `/src/services`

Business logic and data services:

- `EditorService.js` - Handles HTML export, localStorage operations, and component utilities
- `__tests__` - Test files for services

#### Main Files

- `/src/App.js` - Main application component that integrates all panels and components
- `/src/index.js` - Entry point that renders the React app and sets up Redux store
- `/src/App.css` - Global application styles

## Component Interaction Flow

1. **User Interaction**: Users interact with the interface (drag components, edit properties, etc.)
2. **Action Dispatching**: These interactions dispatch Redux actions
3. **Reducer Processing**: Reducers process actions and update the application state
4. **Component Rendering**: React components re-render based on the updated state
5. **Middleware Effects**: Middleware handles side effects like persistence and history management

## State Management

The Redux store maintains the following key state:

- `editor.components` - Array of all components on the canvas
- `editor.selectedComponentId` - ID of the currently selected component
- `editor.previewMode` - Current preview mode (desktop/mobile)
- `editor.showPreview` - Whether the preview modal is visible
- `history.past` - Previous states for undo functionality
- `history.future` - Saved states for redo functionality

## Testing Strategy

The project uses Jest and React Testing Library for testing:

- **Component Tests**: Test component rendering and interactions
- **Service Tests**: Test business logic and data operations
- **Reducer Tests**: Test state transitions in reducers

## Development Workflow

1. Components are defined in their respective directories
2. Redux actions and reducers manage state changes
3. Services handle business logic and external operations
4. Components receive state via Redux and render accordingly

## Build Process

When the application is built:

1. Webpack bundles all JavaScript/JSX files
2. CSS is processed and optimized
3. Static files are copied from `/public`
4. The result is placed in a `/build` directory ready for deployment

## Extending the Project

### Adding a New Component Type

1. Add a new component type constant in `/src/constants/index.js`
2. Create a renderer in `CanvasComponent.js`
3. Add a new item in the palette panel
4. Add property controls in the properties panel
5. Update `EditorService.js` to handle HTML export for the new component type

### Adding a New Feature

1. Define new action types and action creators
2. Update the relevant reducers to handle the new actions
3. Create new components or update existing ones to use the new functionality
4. Update services if needed to support the new feature