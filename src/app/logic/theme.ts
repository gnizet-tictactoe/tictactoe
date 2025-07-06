import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class Theme {
    private theme = signal<'light' | 'dark'>('light');

    setTheme(newTheme: 'light' | 'dark') {
        this.theme.set(newTheme);
        document.documentElement.setAttribute('theme', newTheme);
        localStorage.setItem('theme', newTheme); // Persist theme selection
    }

    getTheme = this.theme.asReadonly();
}