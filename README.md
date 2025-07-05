# Tic Tac Toe – Angular App

Simple Tic Tac Toe game built with Angular.

## Features

- 3x3 game grid (grid size editable in `src/app/logic/tictactoe.ts`)
- Player vs Computer logic
- Computer plays at random
- Game result display

## Requirements

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v20.19+)
- [Angular CLI](https://angular.io/cli)

## Installation

If you are running on Windows, make sure to use cmd or bash - not PowerShell

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
    logic/             # Game logic
    app.ts             # Root component
  index.html
  main.ts
  styles.css           # Global styles
```
