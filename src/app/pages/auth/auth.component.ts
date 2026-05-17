import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2 class="zen-title">{{ isLogin ? 'Bejelentkezés' : 'Regisztráció' }}</h2>
        <p class="subtitle">FitLife - Találd meg a belső egyensúlyod</p>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <input type="email" [(ngModel)]="email" name="email" placeholder="Email cím" required>
          </div>
          <div class="form-group">
            <input type="password" [(ngModel)]="password" name="password" placeholder="Jelszó" required>
          </div>

          <p class="error-msg" *ngIf="error">{{ error }}</p>

          <button type="submit" class="auth-btn">
            {{ isLogin ? 'Belépés' : 'Fiók létrehozása' }}
          </button>
        </form>

        <div class="toggle-mode">
          <button (click)="isLogin = !isLogin" class="link-btn">
            {{ isLogin ? 'Még nincs fiókod? Regisztrálj!' : 'Már van fiókod? Jelentkezz be!' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/forest-bg.jpg');
      background-size: cover; background-position: center;
    }
    .auth-card {
      background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px);
      padding: 40px; border-radius: 20px; width: 100%; max-width: 400px;
      text-align: center; border: 1px solid rgba(255, 255, 255, 0.2); color: white;
    }
    .zen-title { font-weight: 300; text-transform: uppercase; letter-spacing: 3px; color: #D4AF37; margin-bottom: 5px; }
    .subtitle { font-size: 0.9rem; opacity: 0.8; margin-bottom: 30px; }
    .form-group { margin-bottom: 15px; }
    input {
      width: 100%; padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.3);
      background: rgba(0,0,0,0.2); color: white; box-sizing: border-box;
    }
    .auth-btn {
      width: 100%; padding: 12px; border-radius: 10px; border: none;
      background: #D4AF37; color: black; font-weight: bold; cursor: pointer;
      margin-top: 10px; transition: 0.3s;
    }
    .auth-btn:hover { background: #b8952e; }
    .error-msg { color: #ff6b6b; font-size: 0.85rem; margin-bottom: 10px; }
    .link-btn { background: none; border: none; color: #D4AF37; cursor: pointer; margin-top: 20px; font-size: 0.85rem; }
  `]
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLogin = true;
  email = '';
  password = '';
  error = '';

  async onSubmit() {
    this.error = '';
    try {
      if (this.isLogin) {
        await this.authService.login(this.email, this.password);
      } else {
        await this.authService.register(this.email, this.password);
      }
      this.router.navigate(['/dashboard']); // Sikeres belépés után irány a főoldal
    } catch (err: any) {
      this.error = 'Hiba történt: Ellenőrizd az adataidat!';
      console.error(err);
    }
  }
}