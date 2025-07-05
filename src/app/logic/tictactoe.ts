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
    gameScore = signal<{ human: number, computer: number, draw: number }>({ human: 0, computer: 0, draw: 0 });

    // Current player's turn
    currentPlayer = 'human' as PlayerType;

    // Value of each cell in the grid
    grid = signal<CellValue[][]>([]);

    initGame() {

        // Initialize the grid with 'empty' values for each cell
        let newGrid = Array.from({ length: this.gridSize }, () =>
            Array.from({ length: this.gridSize }, () => 'empty' as CellValue)
        );
        this.grid.set(newGrid);

        // Reset game state
        this.filledCells = 0;
        this.currentPlayer = 'human'; // TODO: change based on pawn selection (x starts first)
    }

    playGame() {
        this.initGame();
        this.gameStatus.set('running');
    }

    handleCellClick(row: number, col: number): void {
        if (this.gameStatus() === 'running' && this.currentPlayer === 'human') {
            this.grid.update(grid => {
                if (grid[row][col] === 'empty') {
                    grid[row][col] = this.pawnChoices['human'];
                    this.nextTurn()
                }
                return grid;
            }
            );
        }
    }

    handleComputerMove(): void {
        if (this.currentPlayer === 'computer') {

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

            // Fill the selected cell with the computer's pawn type
            this.grid.update(grid => {
                grid[emptyCells[randomEmptyCell].row][emptyCells[randomEmptyCell].col] = this.pawnChoices['computer'];
                this.nextTurn();
                return grid;
            });
        }
    }

    nextTurn(): void {
        this.filledCells++;
        if (this.checkForGameEnd()) {
            return;
        }

        if (this.currentPlayer === 'human') {
            this.currentPlayer = 'computer';
            this.handleComputerMove();
        } else {
            this.currentPlayer = 'human';
        }
    }

    checkForGameEnd(): boolean {
        // Check rows
        for (let i = 0; i < this.gridSize; i++) {

            let candidateCellValue = this.grid()[i][0];

            if (candidateCellValue !== 'empty' && this.grid()[i].every(cell => cell === candidateCellValue)) {
                this.registerGameResult(`${this.currentPlayer}-win`);
                return true;
            }
        }

        // Check columns
        for (let j = 0; j < this.gridSize; j++) {

            let candidateCellValue = this.grid()[0][j];

            if (candidateCellValue !== 'empty' && this.grid().every(row => row[j] === candidateCellValue)) {
                this.registerGameResult(`${this.currentPlayer}-win`);
                return true;
            }
        }

        // Check diagonal
        let candidateCellValue = this.grid()[0][0];

        if (candidateCellValue !== 'empty' && this.grid().every((row, col) => row[col] === candidateCellValue)) {
            this.registerGameResult(`${this.currentPlayer}-win`);
            return true;
        }

        // Check anti-diagonal
        candidateCellValue = this.grid()[0][this.gridSize - 1];

        if (candidateCellValue !== 'empty' && this.grid().every((row, col) => row[this.gridSize - 1 - col] === candidateCellValue)) {
            this.registerGameResult(`${this.currentPlayer}-win`);
            return true;
        }

        // Check for a draw
        if (this.filledCells === this.gridSize * this.gridSize) {
            this.registerGameResult('draw');
            return true;
        }

        return false;
    }

    registerGameResult(result: string): void {
        if (result === 'human-win') {
            this.gameScore.update(score => ({ ...score, human: score.human + 1 }));
        } else if (result === 'computer-win') {
            this.gameScore.update(score => ({ ...score, computer: score.computer + 1 }));
        } else if (result === 'draw') {
            this.gameScore.update(score => ({ ...score, draw: score.draw + 1 }));
        }
        this.gameStatus.set(result);
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
