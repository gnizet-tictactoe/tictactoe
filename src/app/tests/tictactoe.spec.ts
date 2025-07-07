import { TicTacToe } from '../logic/tictactoe';

describe('Game initialization', () => {
    let game: TicTacToe;

    beforeEach(() => {
        game = new TicTacToe();
    });

    it('should initilize an empty grid', () => {
        game.initGame();
        const grid = game.grid();
        expect(grid.every(row => row.every(cell => cell === 'empty'))).toBe(true);
    });

    it('should mark the cell with "x" if human plays first', () => {
        game.pawnChoices = { human: 'x', computer: 'o' };
        game.initGame();

        // Check that the first player is human
        expect(game.currentPlayer).toBe('human');

        // Simulate the human clicking cell (0,0)
        game.handleCellClick(0, 0);

        const grid = game.grid();

        // Check the move was registered correctly
        expect(grid[0][0]).toBe('x');
    });

    it('should not let the human play first if it selected "o"', () => {
        game.pawnChoices = { human: 'o', computer: 'x' };
        game.initGame();

        // Check that the first player is not human
        expect(game.currentPlayer).toBe('computer');
    });
});

describe('Win detection', () => {
    let game: TicTacToe;

    beforeEach(() => {
        game = new TicTacToe();
        game.gameSize = 3;
        game.currentPlayer = 'human';
        game.registerGameResult = jest.fn();
    });

    it('should detect a horizontal win on the first row', () => {
        game.grid.set([
            ['x', 'x', 'x'],
            ['o', 'empty', 'o'],
            ['empty', 'o', 'x']
        ]);

        game.checkForGameEnd();

        expect(game.registerGameResult).toHaveBeenCalledWith('human-win', 'horizontal', 0);
    });

    it('should detect a vertical win on the second column', () => {
        game.grid.set([
            ['x', 'o', 'x'],
            ['x', 'o', 'o'],
            ['empty', 'o', 'x']
        ]);

        game.checkForGameEnd();

        expect(game.registerGameResult).toHaveBeenCalledWith('human-win', 'vertical', 1);
    });

    it('should detect an anti-diagonal win ', () => {
        game.grid.set([
            ['empty', 'x', 'x'],
            ['o', 'x', 'o'],
            ['x', 'o', 'empty']
        ]);

        game.checkForGameEnd();

        expect(game.registerGameResult).toHaveBeenCalledWith('human-win', 'diagonal', 1);
    });

    it('should detect a draw', () => {
        game.grid.set([
            ['x', 'o', 'x'],
            ['x', 'o', 'o'],
            ['o', 'x', 'x']
        ]);

        game.checkForGameEnd();

        expect(game.registerGameResult).toHaveBeenCalledWith('draw');
    });

    it('should not detect a win', () => {
        game.grid.set([
            ['x', 'o', 'x'],
            ['o', 'empty', 'o'],
            ['empty', 'o', 'x']
        ]);

        game.checkForGameEnd();

        expect(game.registerGameResult).not.toHaveBeenCalled();
    });
});

describe('Turn logic', () => {
    let game: TicTacToe;

    beforeEach(() => {
        game = new TicTacToe();
        game.initGame();
    });

    it('should not allow a move if the game is finished', () => {
        // Set up a won grid (3 x's in the first row)
        game.grid.set([
            ['x', 'x', 'x'],
            ['o', 'empty', 'o'],
            ['empty', 'o', 'x']
        ]);

        game.checkForGameEnd();

        expect(game.gameStatus()).toBe('human-win');

        // Try to fill in the middle empty cell after the game is over
        game.handleCellClick(1, 1);

        // The grid should remain unchanged
        expect(game.grid()[1][1]).toBe('empty');
    });


    it('should switch from human to AI after a move', () => {
        expect(game.currentPlayer).toBe('human');

        game.handleCellClick(0, 0);

        expect(game.currentPlayer).toBe('computer');
    });

    it('should not switch turn if the clicked cell is already filled', () => {
        // Human plays first
        game.handleCellClick(0, 0);
        expect(game.currentPlayer).toBe('computer');

        // Pretend it's now human’s turn again
        game.currentPlayer = 'human';

        // Try clicking the same filled cell
        game.handleCellClick(0, 0);

        // Turn should not change
        expect(game.currentPlayer).toBe('human');
    });
});

describe('Invalid inputs', () => {
    let game: TicTacToe;

    beforeEach(() => {
        game = new TicTacToe();
        game.initGame();
    });

    it('should not allow clicking outside the grid', () => {
        // Simulate clicking outside the grid
        game.handleCellClick(-1, -1);
        game.handleCellClick(3, 3);

        // The grid should remain unchanged
        expect(game.grid().flat().filter(cell => cell !== 'empty').length).toBe(0);
    });

    it('should ignore the move if the current player is not human', () => {
        game.currentPlayer = 'computer';
        game.handleCellClick(0, 0);

        // The grid should remain unchanged
        expect(game.grid()[0][0]).toBe('empty');
    });
});

describe('Score tracking', () => {
    let game: TicTacToe;
    beforeEach(() => {
        game = new TicTacToe();
        game.initGame();
    }
    );
    it('should increment human score on human win', () => {
        game.currentPlayer = 'human';
        game.grid.set([
            ['x', 'x', 'x'],
            ['o', 'empty', 'o'],
            ['empty', 'o', 'x']
        ]);
        game.checkForGameEnd();

        // Checks that scores are correct
        expect(game.gameScore().Human).toBe(1);
        expect(game.gameScore().Computer).toBe(0);
        expect(game.gameScore().Draws).toBe(0);
    });

    it('should increment computer score on computer win', () => {
        game.currentPlayer = 'computer';
        game.grid.set([
            ['x', 'x', 'x'],
            ['o', 'empty', 'o'],
            ['empty', 'o', 'x']
        ]);
        game.checkForGameEnd();

        expect(game.gameScore().Human).toBe(0);
        expect(game.gameScore().Computer).toBe(1);
        expect(game.gameScore().Draws).toBe(0);
    });

    it('should increment draws score on draw', () => {
        game.grid.set([
            ['o', 'x', 'o'],
            ['o', 'x', 'o'],
            ['x', 'o', 'x']
        ]);
        game.checkForGameEnd();

        expect(game.gameScore().Human).toBe(0);
        expect(game.gameScore().Computer).toBe(0);
        expect(game.gameScore().Draws).toBe(1);
    });
});