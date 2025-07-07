# Tic Tac Toe – Angular App

Simple Tic Tac Toe game built with Angular.
Play the game (without install): https://gnizet-tictactoe.github.io/tictactoe/

## Features

- Animated Tic Tac Toe game
- 3x3 game grid (grid size editable in `/src/app/logic/tictactoe.ts`)
- Player vs Computer
- Computer plays at random
- Game result display
- Score tracking
- Light/dark theme
- Basic test suite

## Requirements

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v20.19+)
- [Angular CLI](https://angular.io/cli)

## Installation

```bash
# Clone the repository
git clone https://github.com/gnizet-tictactoe/tictactoe.git
cd tictactoe

# Install dependencies
npm install
```

## Run the app locally
```bash
# Start the development server
npm start

# Open in your browser
http://localhost:4200
```

The app will automatically reload if you change any of the source files.

## Project structure
```
src/
  app/
    components/        # Reusable UI components (Grid, cells, buttons, etc.)
    interface/         # Type interfaces
    logic/             # Game logic + theme
    tests/             
    app.ts             # Root component
  index.html
  main.ts
  styles.css           # Global styles
```

## Tests

All the tests are written inside `/src/app/tests/`

To execute the tests, run `npx jest`
