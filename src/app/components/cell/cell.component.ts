import { Component, inject, input, output } from "@angular/core";
import { CellValue } from "../../interface/cellValue";
import { TicTacToe } from "../../logic/tictactoe";

@Component({
    selector: "cell",
    templateUrl: "./cell.component.html",
    styleUrls: ["./cell.component.css"],
})


export class CellComponent {
    private ticTacToe = inject(TicTacToe);

    value = input.required<CellValue>();
    row = input.required<number>();
    col = input.required<number>();

    onClick() {
        this.ticTacToe.handleCellClick(this.row(), this.col());
    }

    get emptyCell(): boolean {
        return this.value() === 'empty';
    }
}