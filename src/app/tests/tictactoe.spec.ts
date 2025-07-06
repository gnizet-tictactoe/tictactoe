import { TicTacToe } from '../logic/tictactoe';

describe('TicTacToe win detection', () => {
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
