import { Component, inject, input, signal } from "@angular/core";
import { CellComponent } from "../cell/cell.component";
import { TicTacToe } from "../../logic/tictactoe";

@Component({
    selector: "grid",
    imports: [CellComponent],
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.css"],
    host: {
        '[style.--grid-columns]': 'gridTemplateColumns',
        '[style.--game-size]': 'gameSize'
    }
})
export class GridComponent {
    grid = inject(TicTacToe).grid;
    gameVictoryDetails = inject(TicTacToe).gameVictoryDetails;
    gameSize = inject(TicTacToe).gameSize;

    // Generate row and column arrays to iterate over in the template
    get rowIndices(): number[] {
        return Array.from({ length: this.grid().length }, (_, i) => i);
    }

    get colIndices(): number[] {
        return Array.from({ length: this.grid().length }, (_, i) => i);
    }

    get barPositions(): number[] {
        // Return percentages for all internal grid lines (not borders)
        return Array.from({ length: this.gameSize - 1 }, (_, i) =>
            ((i + 1) / this.gameSize) * 100
        );
    }

    // For CSS
    get gridTemplateColumns() {
        return `repeat(${this.grid().length}, 1fr)`;
    }
}