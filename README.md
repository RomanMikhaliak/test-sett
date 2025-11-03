# Pet Garden - 3D Farm Game

A 3D interactive farm game built with Three.js, PixiJS, and TypeScript. Features a hybrid rendering system combining 3D scene rendering (Three.js) with 2D UI elements (PixiJS).

## Overview

Pet Garden is a casual 3D farming game where players place items (animals, crops, decorations) on a farm scene. The game uses a state machine architecture to manage different game states and implements the MVC pattern for clean separation of concerns.

![capture](Game.png?raw=true "capture")

[](https://link-url-here.org)
[Desktop](https://youtu.be/Kx5154yXgZI)
[Mobile](https://link-url-here.org)

### Tech Stack

- **Three.js** - 3D scene rendering
- **PixiJS** - 2D UI rendering
- **TypeScript** - Type-safe development
- **GSAP** - Animation library
- **Howler.js** - Audio management

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture

The game follows a layered architecture with clear separation between core systems and game-specific implementations.

### System Architecture

![capture](doc/SystemArchitecture.png?raw=true "capture")

### MVC Architecture

![capture](doc/MVCArchitecture.png?raw=true "capture")

### State Machine Flow

![capture](doc/StateMachineFlow.png?raw=true "capture")

### Component Factory Pattern

![capture](doc/ComponentFactoryPattern.png?raw=true "capture")

### UI Components Hierarchy

![capture](doc/UI Components Hierarchy.png?raw=true "capture")

## Project Structure

```
├── src/
│   ├── core/                   # Core framework components
│   │   ├── eventbus/          # Event system
│   │   ├── factory/           # Factory patterns
│   │   ├── managers/          # Asset & Audio managers
│   │   ├── render/            # Rendering systems
│   │   ├── scene/             # Base scene components
│   │   ├── statemachine/      # State machine
│   │   ├── state/             # Base state class
│   │   └── ui/                # Base UI components
│   │
│   ├── games/
│   │   └── garden/            # Garden game implementation
│   │       ├── controller/    # Game controller (MVC)
│   │       ├── factory/       # Item factory
│   │       ├── model/         # Game model (MVC)
│   │       ├── states/        # Game states
│   │       ├── types/         # TypeScript types
│   │       ├── view/          # View layer (MVC)
│   │       │   ├── scene/     # 3D scene components
│   │       │   └── ui/        # 2D UI components
│   │       ├── config.ts      # Game configuration
│   │       └── GardenGame.ts  # Main game class
│   │
│   ├── utils/                 # Utility functions
│   ├── App.ts                 # Application entry
│   └── main.ts                # Bootstrap
│
├── assets/
│   ├── gltf/                  # 3D models
│   ├── images/                # Textures & sprites
│   └── sounds/                # Audio files
│
└── README.md
```

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (WebGL 2.0 required)

## License

MIT

## Credits

- Three.js - https://threejs.org/
- PixiJS - https://pixijs.com/
- GSAP - https://greensock.com/gsap/
- Howler.js - https://howlerjs.com/
