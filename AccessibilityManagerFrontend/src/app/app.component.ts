import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AccessibilityManagerFrontend';

  constructor(private router: Router) {}

  isWebsiteListPage(): boolean {
    return this.router.url === '/websites'; 
  }
}
