# Aura Architecture Documentation

## Table of Contents
1. [Architectural Overview](#architectural-overview)
2. [Architectural Pattern](#architectural-pattern)
3. [Component Architecture Diagram](#component-architecture-diagram)
4. [Technology Justification](#technology-justification)
5. [State Management Strategy](#state-management-strategy)
6. [Component Structure](#component-structure)
7. [Undo/Redo Implementation](#undoredo-implementation)
8. [Performance Considerations](#performance-considerations)
9. [Future Extensions](#future-extensions)

## Architectural Overview

Aura is a no-code visual editor designed to empower non-technical team members to create web layouts without engineering support. The architecture is designed to provide a robust, responsive, and intuitive user experience while maintaining code modularity and testability.

## Architectural Pattern

### Flux Architecture via Redux

Aura implements the **Flux architectural pattern** through Redux, which provides a unidirectional data flow. This architectural choice was made for several compelling reasons:

1. **Predictable State Management**: The visual editor manipulates complex state (component positions, properties, selection state) that needs to be predictable and traceable. Flux's unidirectional data flow ensures state changes follow a strict path: action → reducer → updated state → re-render.

2. **Centralized State**: All application state is stored in a single source of truth, making it easier to:
   - Track component selection
   - Manage component properties
   - Implement undo/redo functionality
   - Persist application state

3. **Separation of Concerns**: The Flux pattern clearly separates:
   - **View Layer** (React components): Render UI based on current state
   - **Action Creators**: Define possible state mutations
   - **Reducers**: Pure functions that apply state transformations
   - **Store**: The centralized state container

4. **Time-Travel Debugging**: Flux architecture makes time-travel debugging possible, which is particularly useful for a visual editor where users may want to revisit previous states.

### Why Not MVC or MVVM?

While MVC (Model-View-Controller) or MVVM (Model-View-ViewModel) patterns are popular for web applications:

- **MVC's bidirectional data flow** would make it harder to track state changes in a complex editor with multiple interacting components
- **MVVM's two-way data binding** could lead to cascading updates that are difficult to debug in a draggable component environment

The Flux pattern avoids these pitfalls by enforcing strict unidirectional data flow, making the application more predictable and easier to debug.

## Component Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                          React Components                           │
│                                                                     │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐  │
│  │   Toolbar  │   │PalettePanel│   │CanvasPanel │   │PropertiesP.│  │
│  └─────┬──────┘   └─────┬──────┘   └─────┬──────┘   └─────┬──────┘  │
│        │                │                │                │         │
│        └────────────────┼────────────────┼────────────────┘         │
│                         │                │                          │
│                         ▼                ▼                          │
│                  ┌─────────────────────────────┐                    │
│                  │       User Interactions     │                    │
│                  └──────────────┬──────────────┘                    │
└──────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                         Redux Data Flow                             │
│                                                                     │
│  ┌────────────┐         ┌────────────┐         ┌────────────┐       │
│  │            │ dispatch │            │ update  │            │       │
│  │  Actions   ├────────►│  Reducers  ├────────►│   Store    │       │
│  │            │         │            │         │            │       │
│  └────────────┘         └────────────┘         └─────┬──────┘       │
│                                                      │              │
│                                                      │              │
│  ┌────────────────────┐                              │              │
│  │     Middleware     │◄─────────────────────────────┘              │
│  │                    │                                             │
│  │ ┌───────────────┐  │                                             │
│  │ │HistoryMiddlew.│  │                                             │
│  │ └───────────────┘  │                                             │
│  │ ┌───────────────┐  │                                             │
│  │ │StorageMiddlew.│  │                                             │
│  │ └───────────────┘  │                                             │
│  └─────────┬──────────┘                                             │
│            │                                                        │
└────────────┼───────────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────┐     ┌────────────────────────────┐
│                            │     │                            │
│      External Services     │     │     Browser Features       │
│                            │     │                            │
│  ┌───────────────────────┐ │     │  ┌───────────────────────┐ │
│  │   EditorService       │ │     │  │       LocalStorage    │ │
│  │  - HTML Generation    │ │     │  │  - Persistence        │ │
│  │  - Component Utilities│ │     │  └───────────────────────┘ │
│  └───────────────────────┘ │     │                            │
│                            │     └────────────────────────────┘
└────────────────────────────┘
```

### Communication Flow

1. **User Interactions**: Users interact with React components (drag components, edit properties, etc.)
2. **Action Dispatching**: These interactions dispatch Redux actions
3. **Reducer Processing**: Reducers process actions and update application state
4. **Store Update**: The Redux store is updated with the new state
5. **Middleware Effects**: 
   - History middleware captures state for undo/redo
   - Storage middleware persists state to localStorage
6. **Component Re-rendering**: React components receive updated state and re-render
7. **External Services**: Services like EditorService handle specialized logic (HTML export)

## Technology Justification

### React

**Selected**: React 17.x
**Alternatives Considered**: Vue.js, Angular, Svelte

**Justification**:
- **Component Model**: React's component-based architecture perfectly aligns with our visual editor's needs for reusable UI elements
- **Virtual DOM**: Provides efficient updates for a highly interactive interface with frequent state changes
- **One-way Data Flow**: Complements the Flux architecture for predictable state management
- **Mature Ecosystem**: Rich ecosystem of libraries, tools, and community support
- **Developer Experience**: JSX provides an intuitive way to express UI components with their logic
- **React Hooks**: Enable functional components with state management, reducing boilerplate and improving code readability

### Redux

**Selected**: Redux with redux-thunk
**Alternatives Considered**: MobX, Context API + useReducer, Recoil

**Justification**:
- **Centralized State**: Essential for a visual editor where components interact with each other
- **Predictable State Updates**: Reducers ensure predictable state transitions
- **Time-Travel Capabilities**: Crucial for implementing robust undo/redo functionality
- **Middleware Support**: Allows for powerful extensions like history tracking and persistence
- **DevTools**: Excellent debugging tools for complex state
- **Thunk Middleware**: Provides clean handling of asynchronous operations (like saving to localStorage)

### Custom CSS

**Selected**: Plain CSS with BEM methodology
**Alternatives Considered**: Styled-components, Tailwind CSS, SASS/SCSS

**Justification**:
- **Performance**: Direct CSS without abstraction layers provides the best performance
- **BEM Methodology**: Ensures CSS scalability and avoids specificity issues
- **Control**: Full control over styling, crucial for a visual editor with precise positioning requirements
- **No Runtime Cost**: No CSS-in-JS performance overhead
- **Simplicity**: Easier onboarding for new developers
- **Browser Compatibility**: Maximum compatibility with minimum dependencies

### Custom Drag-and-Drop

**Selected**: Native browser events
**Alternatives Considered**: react-dnd, react-draggable, Dragula

**Justification**:
- **Precision**: Fine-grained control over drag behavior essential for a design tool
- **Performance**: Direct DOM manipulation provides the best performance for complex positioning
- **Customization**: Complete control over the drag experience, including visual feedback
- **No Dependencies**: Reduced bundle size and fewer potential compatibility issues
- **Learning Value**: Demonstrates understanding of browser events and DOM manipulation

### LocalStorage for Persistence

**Selected**: Browser's localStorage API
**Alternatives Considered**: IndexedDB, Backend API, Firebase

**Justification**:
- **Simplicity**: Easy to implement with no backend requirements
- **Instant Persistence**: Synchronous API ensures no data loss during page refreshes
- **Sufficient Capacity**: Adequate for storing design data (5-10MB per domain)
- **No Network Dependencies**: Works offline, essential for a design tool
- **Reduced Complexity**: No authentication or network error handling required

## State Management Strategy

### Why Centralized State?

The decision to use Redux for centralized state management was driven by the complex interactions between components in a visual editor:

1. **Component Selection**: When a user clicks on a component, multiple parts of the UI need to update:
   - The selected component needs to show a selection indicator
   - The properties panel needs to display that component's properties
   - Keyboard shortcuts need to target the selected component

2. **Property Changes**: When properties are updated:
   - The visual representation needs to update
   - The change needs to be recorded for undo/redo
   - The state needs to be persisted

3. **Canvas Management**: Managing multiple components on a canvas requires:
   - Consistent z-index handling
   - Coordinated drag and drop operations
   - Selection state tracking

Centralizing this state in Redux provides a single source of truth that all components can access, eliminating prop drilling and ensuring consistency across the UI.

### State Structure

The Redux store is structured to support the specific needs of a visual editor:

```javascript
{
  editor: {
    components: [
      {
        id: 'unique-id',
        type: 'TEXT',
        position: { x: 100, y: 100 },
        // component-specific properties
        content: 'Hello World',
        fontSize: 16,
        // ...
      },
      // more components
    ],
    selectedComponentId: 'unique-id',
    showPreview: false,
    previewMode: 'DESKTOP'
  },
  history: {
    past: [ /* previous states */ ],
    future: [ /* states to redo */ ]
  }
}
```

This structure:
- Keeps all components in a flat array for easy iteration and lookup
- Tracks the currently selected component by ID
- Separates UI state (preview visibility) from component data
- Maintains history stacks for undo/redo operations

## Component Structure

### Component Hierarchy Design Principles

Aura's component structure follows several key principles:

1. **Separation of Concerns**: Components are divided based on their functional responsibility:
   - **Container Components**: Connect to Redux and handle data flow (PalettePanel, PropertiesPanel)
   - **Presentational Components**: Focus on rendering and user interaction (PropertyControl, PaletteItem)

2. **Composition over Inheritance**: Complex components are built by composing simpler components rather than using inheritance hierarchies

3. **Single Responsibility Principle**: Each component has a clear, focused purpose:
   - CanvasPanel: Manages the editing canvas
   - PalettePanel: Provides component templates
   - PropertiesPanel: Edits selected component properties
   - PreviewModal: Shows the final output preview

4. **Smart & Dumb Component Pattern**:
   - Smart components connect to Redux and handle logic
   - Dumb components receive props and render UI

### Why This Structure?

This component structure was chosen to:

1. **Improve Testability**: Smaller, focused components are easier to test in isolation
2. **Enhance Reusability**: Components with clear responsibilities can be reused in different contexts
3. **Simplify Reasoning**: Clear separation makes the code easier to understand and maintain
4. **Enable Parallel Development**: Team members can work on different components simultaneously

## Undo/Redo Implementation

### Time-Travel State Management

The undo/redo functionality is a critical feature for any visual editor, allowing users to experiment freely without fear of making mistakes. Our implementation uses a "time travel" approach with specialized middleware:

1. **State Snapshots**: Each significant state change creates a snapshot stored in the history stack
2. **Action Filtering**: Not all actions trigger history recording (e.g., selection changes)
3. **Memory Efficiency**: Limit history depth to prevent excessive memory usage
4. **Serializable State**: Ensure all state can be serialized for storage

### Why Redux Middleware?

Redux middleware was chosen for history management because:

1. **Non-Intrusive**: History recording doesn't contaminate component or reducer logic
2. **Centralized Processing**: All state changes flow through a single point
3. **Selective Recording**: Can intelligently decide which actions affect history
4. **Performance**: Minimal overhead as it leverages existing Redux architecture

### Implementation Details

```javascript
// Simplified history middleware implementation
const historyMiddleware = store => next => action => {
  // Capture previous state for specific actions
  if (isHistoryAction(action.type)) {
    const previousState = store.getState().editor;
    const result = next(action);
    
    // Record to history after state change
    store.dispatch({
      type: 'RECORD_HISTORY',
      payload: { previousState }
    });
    
    return result;
  }
  
  return next(action);
};
```

This approach:
- Maintains clean separation between application logic and history management
- Provides a consistent mechanism for undo/redo operations
- Integrates seamlessly with the existing Redux architecture

## Performance Considerations

Several architectural decisions were made specifically to ensure good performance:

1. **Component Memoization**: React.memo is used to prevent unnecessary re-renders
2. **Normalized State**: Component data is stored in a flat structure for O(1) lookups
3. **Batch Updates**: Related state changes are batched to minimize re-renders
4. **Virtualized Rendering**: For applications with many components, virtualized lists can be implemented
5. **Efficient Drag Operations**: During drag, only position changes are updated, not the entire component

## Future Extensions

The architecture was designed to be extensible in several ways:

1. **New Component Types**: Adding new component types requires minimal changes:
   - Add a new constant in COMPONENT_TYPES
   - Create a renderer function in componentRenderers
   - Add appropriate property controls
   - Update HTML export logic

2. **Collaborative Editing**: The architecture could support real-time collaboration by:
   - Replacing localStorage with a backend service
   - Implementing Operational Transformation or CRDT algorithms
   - Adding user presence indicators

3. **Templates System**: Pre-designed templates could be added by:
   - Creating a template store/service
   - Adding template import/export functionality
   - Implementing a template browser component

4. **Plugin System**: A plugin architecture could extend editor functionality by:
   - Defining a plugin API for registering components and tools
   - Creating middleware for plugin integration
   - Implementing a plugin manager