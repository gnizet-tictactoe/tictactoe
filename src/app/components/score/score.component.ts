import { Component, computed, effect, inject, signal } from "@angular/core";
import { TicTacToe } from "../../logic/tictactoe";

@Component({
    selector: "score",
    templateUrl: "./score.component.html",
    styleUrls: ["./score.component.css"],
})
export class ScoreComponent {
    ticTacToe = inject(TicTacToe);
    gameScore = this.ticTacToe.gameScore

    // Convert the gameScore signal to an array of objects for HTML rendering
    scoreEntries = computed(() =>
        Object.entries(this.gameScore()).map(([key, value]) => ({ key, value }))
    );

    // Animation state for each score entry
    animating = signal<{ [key: string]: boolean }>({
        "Human": false,
        "Draws": false,
        "Computer": false
    });

    constructor() {
        effect(() => {

            // Listen for changes in the score
            const changedKey = this.ticTacToe.scoreChanged();
            if (changedKey) {

                // If a score change is detected, update the animating state of the corresponding result (human,draws or computer)
                this.animating.update(anim => ({ ...anim, [changedKey]: true }));

                // The animation takes the incremented score and brings it from the bottom of the current score
                // Since the score is incremented instantly in the tictactoe logic, we virtually decrement it here
                // In order for the animation to work correctly
                const entry = this.scoreEntries().find(entry => entry.key === changedKey);
                if (entry) {
                    entry.value--;
                }
            }
        });
    }


    onAnimationEnd(key: string) {

        // After the animation has completed, we need to restore the score to its correct value
        // i.e. increment it by 1
        const entry = this.scoreEntries().find(entry => entry.key === key);
        if (entry) {
            entry.value += 1;
        }

        // Reset the animating state for the corresponding result
        this.animating.update(anim => ({ ...anim, [key]: false }));
    }
}