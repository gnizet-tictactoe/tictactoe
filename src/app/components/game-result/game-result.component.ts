import { Component, inject } from "@angular/core";
import { TicTacToe } from "../../logic/tictactoe";

@Component({
    selector: "game-result",
    templateUrl: "./game-result.component.html",
    styleUrls: ["./game-result.component.css"],
})
export class GameResultComponent {
    ticTacToe = inject(TicTacToe);
    gameStatus = this.ticTacToe.gameStatus;
}