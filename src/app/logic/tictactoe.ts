import { Injectable, signal } from "@angular/core";
import { CellValue } from "../interface/cellValue";
import { PlayerType } from "../interface/playerType";
import { PawnType } from "../interface/pawnType";

@Injectable({
    providedIn: 'root',
})
export class TicTacToe {

    // === GAME SETTINGS ===
    gridSize = 3;
    pawnChoices = { 'human': 'x' as PawnType, 'computer': 'o' as PawnType };


    // === GAME STATE ===
    filledCells = 0;
    gameStatus = signal<string>('');
    gameScore = signal<{ Human: number, Draws: number, Computer: number }>({ Human: 0, Draws: 0, Computer: 0 });

    // Details about the victory of the game are used to highlight the winning cells
    // Orientation can be 'horizontal', 'vertical', or 'diagonal'
    // Index indicates which row, column, or diagonal won (diagonal 0 is the main diagonal, diagonal 1 is the anti-diagonal)
    gameVictoryDetails = signal<{ orientation: string, index: number }>({ orientation: '', index: -1 });

    // Current player's turn
    currentPlayer = 'human' as PlayerType;

    // Value of each cell in the grid
    grid = signal<CellValue[][]>([]);

    showPopup = signal<boolean>(true);

    // This signal is used for triggering animations in the score component
    scoreChanged = signal<string | null>(null);

    initGrid() {
        // Initialize the grid with 'empty' values for each cell
        let newGrid = Array.from({ length: this.gridSize }, () =>
            Array.from({ length: this.gridSize }, () => 'empty' as CellValue)
        );
        this.grid.set(newGrid);
    }

    initGame() {

        // Reset game state
        this.initGrid();
        this.filledCells = 0;
        this.gameVictoryDetails.set({ orientation: '', index: -1 }); // Reset game victory details
        this.currentPlayer = this.getStartingPlayer();
        this.gameStatus.set('running');
        this.showPopup.set(false);

        this.nextTurn();
    }

    getStartingPlayer(): PlayerType {
        // Determine the starting player based on the pawn choices : x starts first
        return this.pawnChoices['human'] === 'x' ? 'human' : 'computer';
    }

    handleCellClick(row: number, col: number): void {
        if (this.gameStatus() === 'running' && this.currentPlayer === 'human') {
            this.grid.update(grid => {
                grid[row][col] = this.pawnChoices['human'];
                return grid;
            }
            );

            this.filledCells++;
            this.checkForGameEnd();
        }
    }

    performComputerMove(): void {

        // Track the empty cells
        let emptyCells: { row: number, col: number }[] = [];

        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
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

        this.filledCells++;
        this.checkForGameEnd();
    }

    nextTurn(): void {
        if (this.currentPlayer === 'human') {
            return;
        }

        if (this.currentPlayer === 'computer') {
            // Delay the computer's move to simulate thinking time
            setTimeout(() => {
                this.performComputerMove();
            }, 300);
        }
    }

    setNextPlayer(): void {
        // Switch to the next player
        this.currentPlayer = this.currentPlayer === 'human' ? 'computer' : 'human';
    }

    checkForGameEnd(): void {
        // Check rows
        for (let i = 0; i < this.gridSize; i++) {

            let candidateCellValue = this.grid()[i][0];

            if (candidateCellValue !== 'empty' && this.grid()[i].every(cell => cell === candidateCellValue)) {
                this.registerGameResult(`${this.currentPlayer}-win`, 'horizontal', i);
                return;
            }
        }

        // Check columns
        for (let j = 0; j < this.gridSize; j++) {

            let candidateCellValue = this.grid()[0][j];

            if (candidateCellValue !== 'empty' && this.grid().every(row => row[j] === candidateCellValue)) {
                this.registerGameResult(`${this.currentPlayer}-win`, 'vertical', j);
                return;
            }
        }

        // Check diagonal
        let candidateCellValue = this.grid()[0][0];

        if (candidateCellValue !== 'empty' && this.grid().every((row, col) => row[col] === candidateCellValue)) {
            this.registerGameResult(`${this.currentPlayer}-win`, 'diagonal', 0);
            return;
        }

        // Check anti-diagonal
        candidateCellValue = this.grid()[0][this.gridSize - 1];

        if (candidateCellValue !== 'empty' && this.grid().every((row, col) => row[this.gridSize - 1 - col] === candidateCellValue)) {
            this.registerGameResult(`${this.currentPlayer}-win`, 'diagonal', 1);
            return;
        }

        // Check for a draw
        if (this.filledCells === this.gridSize * this.gridSize) {
            this.registerGameResult('draw');
            return;
        }

        // If this code is reached, the game is still running
        this.setNextPlayer();
        this.nextTurn();
    }

    registerGameResult(result: string, orientation?: string, index?: number): void {
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

        // Show the popup with the game result
        this.showPopup.set(true);
    }

    selectPawnType(pawnType: PawnType): void {
        // Only allow pawn selection if game is over
        console.log(`Pawn type selected: ${pawnType}`);
        if (this.gameStatus() !== 'running') {
            this.pawnChoices['human'] = pawnType;
            this.pawnChoices['computer'] = pawnType === 'x' ? 'o' : 'x';
        }
    }
}
