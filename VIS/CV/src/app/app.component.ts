import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Admin';
    menuVisible = false;

    toggleMenu() {
        this.menuVisible = !this.menuVisible;
    }
}
