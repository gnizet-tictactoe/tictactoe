import { Component, inject } from "@angular/core";
import { TicTacToe } from "../../logic/tictactoe";

@Component({
    selector: "score",
    templateUrl: "./score.component.html",
    styleUrls: ["./score.component.css"],
})
export class ScoreComponent {
    gameScore = inject(TicTacToe).gameScore;
    label: any;
}