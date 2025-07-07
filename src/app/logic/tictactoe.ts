import { computed, Injectable, signal } from "@angular/core";
import { CellValue } from "../interface/cellValue";
import { PlayerType } from "../interface/playerType";
import { PawnType } from "../interface/pawnType";
import { GameStatus } from "../interface/gameStatus";

@Injectable({
    providedIn: 'root',
})
export class TicTacToe {

    // === GAME SETTINGS ===

    gameSize = 3;
    pawnChoices = { 'human': 'x' as PawnType, 'computer': 'o' as PawnType };


    // === GAME STATE ===

    gameStatus = signal<GameStatus>('not-started');
    gameScore = signal<{ Human: number, Draws: number, Computer: number }>({ Human: 0, Draws: 0, Computer: 0 });

    // Details about the victory of the game are used to highlight the winning cells
    // Orientation can be 'horizontal', 'vertical', or 'diagonal'
    // Index indicates which row, column, or diagonal won (diagonal 0 is the main diagonal, diagonal 1 is the anti-diagonal)
    gameVictoryDetails = signal<{ orientation: string, index: number }>({ orientation: '', index: -1 });

    // Current player's turn
    currentPlayer = 'human' as PlayerType;

    // Value of each cell in the grid
    grid = signal<CellValue[][]>([]);

    // Keep track of the # of filled cells
    filledCells = computed(() => {
        let count = 0;
        for (const row of this.grid()) {
            for (const cell of row) {
                if (cell !== 'empty') count++;
            }
        }
        return count;
    });

    // This signal is used for triggering animations in the score component
    scoreChanged = signal<string | null>(null);


    // === INIT FUNCTIONS ===

    initGrid() {
        // Initialize the grid with 'empty' values for each cell
        let newGrid = Array.from({ length: this.gameSize }, () =>
            Array.from({ length: this.gameSize }, () => 'empty' as CellValue)
        );
        this.grid.set(newGrid);
    }

    initGame() {
        // Reset game state
        this.initGrid();
        this.gameVictoryDetails.set({ orientation: '', index: -1 }); // Reset game victory details
        this.currentPlayer = this.getStartingPlayer();
        this.gameStatus.set('running');

        // Launch game by launching the first turn
        this.nextTurn();
    }


    // === GAME LOGIC FUNCTIONS ===

    // Handle the human click on a cell
    handleCellClick(row: number, col: number): void {
        // Check bounds
        if (row < 0 || row >= this.gameSize || col < 0 || col >= this.gameSize) {
            return;
        }
        if (this.gameStatus() === 'running' && this.currentPlayer === 'human' && this.grid()[row][col] === 'empty') {
            this.grid.update(grid => {
                // Make a copy of the grid so that signals associated to grid update correctly
                const newGrid = grid.map(r => [...r]);
                newGrid[row][col] = this.pawnChoices['human'];
                return newGrid;
            });

            this.checkForGameEnd();
        }
    }

    // Computer behavior: perform a random (but valid) move
    performComputerMove(): void {

        // Track the empty cells
        let emptyCells: { row: number, col: number }[] = [];

        for (let i = 0; i < this.gameSize; i++) {
            for (let j = 0; j < this.gameSize; j++) {
                if (this.grid()[i][j] === 'empty') {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }

        // Select a random empty cell for the computer's move
        const randomEmptyCell = Math.floor(Math.random() * emptyCells.length);

        // Deep clone of the grid 
        const newGrid = this.grid().map(row => [...row]);

        // Fill the selected cell
        newGrid[emptyCells[randomEmptyCell].row][emptyCells[randomEmptyCell].col] = this.pawnChoices['computer'];

        // Update the signal with the new grid reference
        this.grid.set(newGrid);

        this.checkForGameEnd();
    }

    nextTurn(): void {
        if (this.currentPlayer === 'human') {
            // Still waiting for the human player to click on a cell
            return;
        }

        if (this.currentPlayer === 'computer') {
            // Delay the computer's move to simulate thinking time
            setTimeout(() => {
                this.performComputerMove();
            }, 300);
        }
    }

    getStartingPlayer(): PlayerType {
        // Determine the starting player based on the pawn choices : x starts first
        return this.pawnChoices['human'] === 'x' ? 'human' : 'computer';
    }

    checkForGameEnd(): void {
        const grid = this.grid();

        // Check rows
        for (let i = 0; i < this.gameSize; i++) {

            let candidateCellValue = grid[i][0];

            if (candidateCellValue !== 'empty' && grid[i].every(cell => cell === candidateCellValue)) {
                this.registerGameResult(`${this.currentPlayer}-win`, 'horizontal', i);
                return;
            }
        }

        // Check columns
        for (let j = 0; j < this.gameSize; j++) {

            let candidateCellValue = grid[0][j];

            if (candidateCellValue !== 'empty' && grid.every(row => row[j] === candidateCellValue)) {
                this.registerGameResult(`${this.currentPlayer}-win`, 'vertical', j);
                return;
            }
        }

        // Check diagonal
        let candidateCellValue = this.grid()[0][0];

        if (candidateCellValue !== 'empty' && grid.every((row, col) => row[col] === candidateCellValue)) {
            this.registerGameResult(`${this.currentPlayer}-win`, 'diagonal', 0);
            return;
        }

        // Check anti-diagonal
        candidateCellValue = grid[0][this.gameSize - 1];

        if (candidateCellValue !== 'empty' && grid.every((row, col) => row[this.gameSize - 1 - col] === candidateCellValue)) {
            this.registerGameResult(`${this.currentPlayer}-win`, 'diagonal', 1);
            return;
        }

        // Check for a draw
        if (this.filledCells() === this.gameSize * this.gameSize) {
            this.registerGameResult('draw');
            return;
        }

        // If this code is reached, the game is still running
        this.setNextPlayer();
        this.nextTurn();
    }


    // === UTILS FUNCTIONS ===

    selectPawnType(pawnType: PawnType): void {
        console.log(`Pawn type selected: ${pawnType}`);
        if (this.gameStatus() !== 'running') {
            this.pawnChoices['human'] = pawnType;
            this.pawnChoices['computer'] = pawnType === 'x' ? 'o' : 'x';
        }
    }

    setNextPlayer(): void {
        // Switch to the next player
        this.currentPlayer = this.currentPlayer === 'human' ? 'computer' : 'human';
    }

    registerGameResult(result: GameStatus, orientation?: string, index?: number): void {
        if (result === 'human-win') {
            this.gameScore.update(score => ({ ...score, Human: score.Human + 1 }));
            this.scoreChanged.set('Human');
        } else if (result === 'computer-win') {
            this.gameScore.update(score => ({ ...score, Computer: score.Computer + 1 }));
            this.scoreChanged.set('Computer');
        } else if (result === 'draw') {
            this.gameScore.update(score => ({ ...score, Draws: score.Draws + 1 }));
            this.scoreChanged.set('Draws');
        }
        this.gameStatus.set(result);

        if (orientation && index !== undefined) {
            this.gameVictoryDetails.set({ orientation, index });
        } else {
            this.gameVictoryDetails.set({ orientation: '', index: -1 });
        }
    }
}
