import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" *ngIf="authService.user$ | async as user">
      <div class="logo" routerLink="/dashboard">Fit<span>Life</span></div>
      
      <div class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active">Irányítópult</a>
        <a routerLink="/plans" routerLinkActive="active">Edzéstervek</a>
        <a routerLink="/settings" routerLinkActive="active">Gyakorlatok</a>
        
        <div class="user-section">
          <a routerLink="/profile" routerLinkActive="active" class="profile-link">
            Profil
          </a>
          <span class="premium-badge" *ngIf="user.email === 'admin@fitlife.hu' || user.email === 'konya.laura5@gmail.com'">
            Premium
          </span>
        </div>

        <button class="logout-icon" (click)="logout()" title="Kijelentkezés">X</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 15px 30px; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(15px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1); position: sticky; top: 0; z-index: 1000;
    }
    .logo { font-size: 1.5rem; font-weight: 300; letter-spacing: 2px; color: white; cursor: pointer; }
    .logo span { color: #D4AF37; font-weight: bold; }
    
    .nav-links { display: flex; gap: 20px; align-items: center; }
    a { color: rgba(255, 255, 255, 0.7); text-decoration: none; font-size: 0.9rem; transition: 0.3s; }
    a:hover, .active { color: #D4AF37; }
    
    .profile-link { background: rgba(212, 175, 55, 0.1); padding: 5px 15px; border-radius: 20px; border: 1px solid #D4AF37; }
    .premium-badge {
      background: linear-gradient(45deg, #D4AF37, #f9f295);
      color: #1a2a1a;
      font-size: 0.85rem;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 4px;
      letter-spacing: 1px;
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
    }
    .logout-icon { background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 1.2rem; margin-left: 10px; }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  async logout() {
    await (this.authService as any).logout();
    this.router.navigate(['/auth']);
  }
}