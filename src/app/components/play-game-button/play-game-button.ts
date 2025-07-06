import { Component, inject } from "@angular/core";
import { TicTacToe } from "../../logic/tictactoe";

@Component({
    selector: "play-game-button",
    templateUrl: "./play-game-button.html",
    styleUrls: ["./play-game-button.css"],
})
export class PlayGameButtonComponent {
    ticTacToe = inject(TicTacToe);

    gameStatus = this.ticTacToe.gameStatus;

    playGame() {
        this.ticTacToe.initGame();
    }
}