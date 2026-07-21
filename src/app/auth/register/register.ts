import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html'
})
export class Register {

  user = {
    username: '',
    email: '',
    password: ''
  };

  confirmPassword = '';
  loading = false;
  errorMessage = '';
  showPassword = false;
  success = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  register() {
    if (!this.user.username || !this.user.email || !this.user.password) {
      return;
    }

    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.auth.register(this.user).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = true;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || err.error || 'Registration failed. Please try again.';
      }
    });
  }
}