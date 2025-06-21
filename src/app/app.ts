import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>folder</mat-icon>
      <span style="margin-left: 8px;">Vault Explorer</span>
    </mat-toolbar>
    
    <main style="padding: 16px;">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  title = 'vault-explorer';
}