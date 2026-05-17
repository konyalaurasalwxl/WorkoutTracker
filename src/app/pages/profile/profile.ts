import { Component, inject, OnInit } from '@angular/core'; // inject és OnInit hozzáadva
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // ÚJ IMPORT
import { Router } from '@angular/router'; // ÚJ IMPORT

interface Milestone {
  id: number;
  text: string;
  completed: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <div class="avatar">{{ user.name.charAt(0).toUpperCase() }}</div>
        <h2 class="zen-title">{{ user.name }}</h2>
        <p class="email">{{ user.email }}</p>
        <button class="logout-btn-small" (click)="logout()">Kijelentkezés</button>
      </div>

      <div class="content-grid">
        <div class="profile-card">
          <h3>Személyes adatok</h3>
          <div class="form-group">
            <label>Név</label>
            <input type="text" [(ngModel)]="user.name" class="zen-input">
          </div>
          <div class="form-group">
            <label>E-mail cím</label>
            <input type="text" [value]="user.email" class="zen-input" disabled>
          </div>
          <div class="form-group">
            <label>Napi cél (perc)</label>
            <input type="number" [(ngModel)]="user.dailyGoal" class="zen-input">
          </div>
          <button class="save-btn" (click)="saveProfile()">Profil mentése</button>
        </div>

        <div class="milestone-card">
          <h3>Célkitűzéseid 🏹</h3>
          <div class="add-milestone">
            <input type="text" [(ngModel)]="newMilestone" placeholder="Új cél (pl. 10km futás)" class="zen-input">
            <button (click)="addMilestone()" [disabled]="!newMilestone" class="add-small">+</button>
          </div>

          <div class="milestone-list">
            <div *ngFor="let m of milestones" class="milestone-item">
              <div class="m-content">
                <input type="checkbox" [(ngModel)]="m.completed">
                <span [class.done]="m.completed">{{ m.text }}</span>
              </div>
              <button class="delete-link" (click)="deleteMilestone(m.id)">törlés</button>
            </div>
            <p *ngIf="milestones.length === 0" class="empty">Még nincsenek céljaid.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container { padding: 40px 20px; animation: fadeIn 1s ease-out; }
    .profile-header { text-align: center; margin-bottom: 40px; }
    .avatar { width: 80px; height: 80px; background: #D4AF37; color: black; 
              border-radius: 50%; display: flex; align-items: center; justify-content: center; 
              font-size: 2rem; font-weight: bold; margin: 0 auto 15px; box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
    .email { opacity: 0.6; margin-bottom: 15px; }
    
    /* Kijelentkezés gomb stílusa */
    .logout-btn-small { 
      background: none; border: 1px solid #ff4d4d; color: #ff4d4d; 
      padding: 5px 15px; border-radius: 20px; cursor: pointer; transition: 0.3s;
    }
    .logout-btn-small:hover { background: #ff4d4d; color: white; }

    .content-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 900px; margin: 0 auto; }
    .profile-card, .milestone-card { 
      background: rgba(30, 45, 30, 0.7); backdrop-filter: blur(10px);
      padding: 30px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); 
    }
    h3 { color: #D4AF37; font-weight: 300; margin-top: 0; margin-bottom: 20px; letter-spacing: 1px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; color: rgba(255,255,255,0.5); margin-bottom: 8px; font-size: 0.75rem; text-transform: uppercase; }
    .zen-input { width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); 
                border-radius: 12px; color: white; box-sizing: border-box; transition: 0.3s; }
    .save-btn { width: 100%; padding: 14px; background: #D4AF37; color: black; border: none; 
                border-radius: 12px; cursor: pointer; font-weight: bold; margin-top: 10px; }
    .add-small { background: #D4AF37; border: none; border-radius: 8px; width: 45px; cursor: pointer; font-weight: bold; }
    .milestone-item { display: flex; justify-content: space-between; align-items: center; 
                      background: rgba(255,255,255,0.03); padding: 10px 15px; border-radius: 12px; }
    .done { text-decoration: line-through; opacity: 0.5; }
    .delete-link { background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 0.7rem; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = {
    name: 'Vándor',
    email: '',
    dailyGoal: 60
  };

  milestones: Milestone[] = [
    { id: 1, text: 'Heti 3 jógaedzés', completed: true },
    { id: 2, text: 'Napi 10 perc meditáció', completed: false }
  ];

  newMilestone: string = '';

  ngOnInit() {
    // Betöltjük a valódi e-mail címet a Firebase-ből
    this.authService.user$.subscribe(fbUser => {
      if (fbUser) {
        this.user.email = fbUser.email || '';
        this.user.name = fbUser.displayName || fbUser.email?.split('@')[0] || 'Vándor';
      }
    });
  }

  async logout() {
    if (confirm('Biztosan ki szeretnél jelentkezni?')) {
      await this.authService.logout();
      this.router.navigate(['/auth']);
    }
  }

  saveProfile() {
    alert(`Rendben, ${this.user.name}! Az adataidat frissítettük.`);
  }

  addMilestone() {
    if (this.newMilestone.trim()) {
      this.milestones.push({ id: Date.now(), text: this.newMilestone, completed: false });
      this.newMilestone = '';
    }
  }

  deleteMilestone(id: number) {
    this.milestones = this.milestones.filter(m => m.id !== id);
  }
}