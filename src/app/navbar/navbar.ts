import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3 mb-4 shadow-sm">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold" routerLink="/">Task System</a>

        <div class="d-flex align-items-center">
          <!-- Show Logout button only when logged in -->
          <ng-container *ngIf="authService.isLoggedInSignal()">
            <span class="text-light me-3 small">Logged In</span>
            <button class="btn btn-outline-light btn-sm" (click)="logout()">
              Logout
            </button>
          </ng-container>

          <!-- Show Login/Register links when logged out -->
          <ng-container *ngIf="!authService.isLoggedInSignal()">
            <a routerLink="/login" class="btn btn-outline-light btn-sm me-2">Login</a>
            <a routerLink="/register" class="btn btn-primary btn-sm">Register</a>
          </ng-container>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);

  logout(): void {
    if (confirm('Are you sure you want to log out?')) {
      this.authService.logout();
    }
  }
}