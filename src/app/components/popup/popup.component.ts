import { Component, inject, Input } from "@angular/core";
import { GameResultComponent } from "../game-result/game-result.component";
import { PawnSelectionComponent } from "../pawn-selection/pawn-selection.component";
import { PlayGameButtonComponent } from "../play-game-button/play-game-button";
import { ScoreComponent } from "../score/score.component";
import { TicTacToe } from "../../logic/tictactoe";

@Component({
    selector: "popup",
    templateUrl: "./popup.component.html",
    styleUrls: ["./popup.component.css"],
    imports: [GameResultComponent, PawnSelectionComponent, PlayGameButtonComponent, ScoreComponent],
})
export class PopupComponent {
    gameStatus = inject(TicTacToe).gameStatus;
}