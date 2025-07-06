import { Component, inject } from "@angular/core";
import { Theme } from "../../logic/theme";

@Component({
    selector: "theme-toggle-switch",
    templateUrl: "./theme-toggle-switch.component.html",
    styleUrls: ["./theme-toggle-switch.component.css"],
})
export class ThemeToggleSwitchComponent {
    themeService = inject(Theme);
    theme = this.themeService.getTheme;

    toggle() {
        const next = this.theme() === 'light' ? 'dark' : 'light';
        this.themeService.setTheme(next);
    }
}