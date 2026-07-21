import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html'
})
export class Login {

  user = {
    username: '',
    password: ''
  };

  loading = false;
  errorMessage = '';
  showPassword = false;
  rememberMe = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.user.username || !this.user.password) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.auth.login(this.user)
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.auth.saveToken(res.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.status === 401
            ? 'Incorrect username or password.'
            : 'Something went wrong. Please try again.';
        }
      });
  }
}