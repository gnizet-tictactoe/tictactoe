import { Component, inject, signal } from '@angular/core';
import { GridComponent } from './components/grid/grid.component';
import { TicTacToe } from './logic/tictactoe';
import { ThemeToggleSwitchComponent } from "./components/theme-toggle-switch/theme-toggle-switch.component";
import { Theme } from './logic/theme';
import { PopupComponent } from "./components/popup/popup.component";

@Component({
  selector: 'app-root',
  imports: [GridComponent, ThemeToggleSwitchComponent, PopupComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  ticTacToe = inject(TicTacToe);
  theme = inject(Theme);

  constructor() {
    // Initialize the game grid when the app starts
    this.ticTacToe.initGrid();

    // Set theme to light if not set in localStorage already
    this.theme.setTheme(localStorage.getItem('theme') as 'light' | 'dark' || 'light');
  }
}
