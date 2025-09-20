# Aura - No-Code Visual Editor

Aura is an in-house, "No-Code" visual editor that allows teams like Marketing and Product to build and modify simple web layouts and promotional materials without direct engineering support.

## Features

- Drag and drop components from a palette to a freeform canvas
- Edit component properties in real-time
- Custom inline editor for Text and TextArea elements
- Preview in mobile and desktop modes
- Export and copy HTML
- Undo/Redo functionality (up to 50 steps)

## Project Structure

- `/src/components` - React components for the UI
- `/src/constants` - Application constants and component definitions
- `/src/redux` - Redux store, actions, reducers, and middleware
- `/src/services` - Data access layer (localStorage)

## Available Components

- Text
- TextArea
- Image
- Button

## Getting Started

1. Clone the repository
2. Run `npm install`
3. Run `npm start`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technical Notes

- Built with React and Redux
- Custom drag-and-drop implementation using native browser events
- Uses localStorage for data persistence