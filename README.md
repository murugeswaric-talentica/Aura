# Aura - No-Code Visual Editor

## Overview

Aura is a powerful "No-Code" visual editor that empowers marketing and product teams to create and modify web layouts and promotional materials independently, without requiring engineering support. This React-based application features a user-friendly drag-and-drop interface, real-time property editing, and responsive design previews, allowing non-technical team members to build professional web content efficiently.

![Aura Visual Editor](https://via.placeholder.com/800x450?text=Aura+Visual+Editor)

## Features

- **Intuitive Drag-and-Drop Interface**: Easily position components on a freeform canvas
- **Real-Time Property Editing**: Instantly update component attributes with the properties panel
- **Multiple Component Types**: Text, TextArea, Image, and Button components with extensive customization options
- **Inline Content Editing**: Double-click to edit text content directly on the canvas
- **Responsive Preview**: Test layouts in both mobile and desktop views before finalizing
- **HTML Export**: One-click export to production-ready HTML
- **History Management**: Comprehensive undo/redo functionality (up to 50 steps)
- **Persistent Storage**: Automatically saves work using browser localStorage

## Getting Started

Follow these step-by-step instructions to set up and run Aura on your local machine:

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.0.0 or later)
- [npm](https://www.npmjs.com/) (v6.0.0 or later) or [yarn](https://yarnpkg.com/) (v1.22.0 or later)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/murugeswaric-talentica/Aura.git
   cd Aura
   ```

2. **Install dependencies**

   Using npm:
   ```bash
   npm install
   ```

   Or using yarn:
   ```bash
   yarn install
   ```

### Running the Development Server

1. **Start the development server**

   Using npm:
   ```bash
   npm start
   ```

   Using yarn:
   ```bash
   yarn start
   ```

2. **Access the application**
   
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

1. **Create a production build**

   Using npm:
   ```bash
   npm run build
   ```

   Using yarn:
   ```bash
   yarn build
   ```

2. **Serve the production build locally** (optional)

   Install serve:
   ```bash
   npm install -g serve
   ```

   Serve the build folder:
   ```bash
   serve -s build
   ```

   The application will be available at [http://localhost:5000](http://localhost:5000)

### Running Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

## Project Structure

```
aura/
├── public/                 # Static files
├── src/
│   ├── components/         # React components
│   │   ├── CanvasPanel/    # Canvas and components rendering
│   │   ├── PalettePanel/   # Component palette
│   │   ├── PreviewModal/   # Preview functionality
│   │   ├── PropertiesPanel/ # Component properties editor
│   │   └── Toolbar/        # Application toolbar
│   ├── constants/          # Application constants
│   ├── redux/              # Redux state management
│   │   ├── actions/        # Action creators
│   │   ├── reducers/       # State reducers
│   │   └── middleware/     # Redux middleware
│   ├── services/           # Business logic and data services
│   ├── App.js              # Main application component
│   └── index.js            # Application entry point
├── package.json            # Dependencies and scripts
└── README.md               # This documentation
```

## Available Components

Aura provides the following component types:

1. **Text**: Simple text display with customizable font size, weight, and color
2. **TextArea**: Multi-line text with additional formatting options
3. **Image**: Image component with customizable dimensions and styling
4. **Button**: Interactive button with customizable appearance and linking capability

## Technical Details

- **Frontend Framework**: React 17.x with functional components and hooks
- **State Management**: Redux with redux-thunk for async operations
- **Styling**: CSS with BEM methodology
- **Drag-and-Drop**: Custom implementation using native browser events
- **Storage**: Browser localStorage API for data persistence
- **Testing**: Jest and React Testing Library

## Troubleshooting

### Common Issues

1. **Installation Errors**:
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and package-lock.json, then reinstall

2. **Development Server Issues**:
   - Check if port 3000 is available (close other applications that might be using it)
   - Try running with an alternative port: `PORT=3001 npm start`

3. **Preview Not Loading**:
   - Ensure your browser supports iframe sandboxing
   - Try a different modern browser (Chrome, Firefox, Edge)

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.