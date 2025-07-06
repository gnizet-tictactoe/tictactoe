import { Component, inject, signal } from '@angular/core';
import { GridComponent } from './components/grid/grid.component';
import { TicTacToe } from './logic/tictactoe';
import { PawnSelectionComponent } from './components/pawn-selection/pawn-selection.component';
import { GameResultComponent } from "./components/game-result/game-result.component";
import { PlayGameButtonComponent } from './components/play-game-button/play-game-button';
import { ScoreComponent } from "./components/score/score.component";
import { ThemeToggleSwitchComponent } from "./components/theme-toggle-switch/theme-toggle-switch.component";
import { Theme } from './logic/theme';

@Component({
  selector: 'app-root',
  imports: [GridComponent, PawnSelectionComponent, GameResultComponent, PlayGameButtonComponent, ScoreComponent, ThemeToggleSwitchComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  ticTacToe = inject(TicTacToe);
  theme = inject(Theme);

  showPopup = this.ticTacToe.showPopup;

  constructor() {
    // Initialize the game grid when the app starts
    this.ticTacToe.initGame();

    // Set theme to light if not set in localStorage already
    this.theme.setTheme(localStorage.getItem('theme') as 'light' | 'dark' || 'light');
  }
}
