import { Component, inject } from "@angular/core";
import { TicTacToe } from "../../logic/tictactoe";
import { PawnType } from "../../interface/pawnType";

@Component({
    selector: "pawn-selection",
    templateUrl: "./pawn-selection.component.html",
    styleUrls: ["./pawn-selection.component.css"],
})
export class PawnSelectionComponent {
    ticTacToe = inject(TicTacToe);

    pawnChoices = this.ticTacToe.pawnChoices;
    onPawnTypeClicked(pawn: string) {
        this.ticTacToe.selectPawnType(pawn as PawnType);
    }
}