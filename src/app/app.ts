import { Component, inject } from '@angular/core';
import { GridComponent } from './components/grid/grid.component';
import { TicTacToe } from './logic/tictactoe';
import { PawnSelectionComponent } from './components/pawn-selection/pawn-selection.component';
import { GameResultComponent } from "./components/game-result/game-result.component";
import { PlayGameButtonComponent } from './components/play-game-button/play-game-button';
import { ScoreComponent } from "./components/score/score.component";

@Component({
  selector: 'app-root',
  imports: [GridComponent, PawnSelectionComponent, GameResultComponent, PlayGameButtonComponent, ScoreComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  ticTacToe = inject(TicTacToe);

  constructor() {
    // Initialize the game grid when the app starts
    this.ticTacToe.initGame();
  }
}
