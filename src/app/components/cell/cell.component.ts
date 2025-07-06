import { Component, inject, input, output } from "@angular/core";
import { CellValue } from "../../interface/cellValue";
import { TicTacToe } from "../../logic/tictactoe";

@Component({
    selector: "cell",
    templateUrl: "./cell.component.html",
    styleUrls: ["./cell.component.css"],
    host: {
        '[style.--game-size]': 'gameSize'
    }
})


export class CellComponent {
    private ticTacToe = inject(TicTacToe);
    gameSize = this.ticTacToe.gameSize;

    value = input.required<CellValue>();
    row = input.required<number>();
    col = input.required<number>();

    get emptyCell(): boolean {
        return this.value() === 'empty';
    }

    onClick() {
        if (this.emptyCell) {
            this.ticTacToe.handleCellClick(this.row(), this.col());
        }
    }
}