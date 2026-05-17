import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatCardComponent } from './stat-card/stat-card';


interface DailyEntry {
  id: number;
  activity: string;
  duration: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent, FormsModule], 
  template: `
    <div class="dashboard-container">
      <header>
        <h2 class="zen-title">Mélyülj el a fejlődésben 🌱</h2>
        <p class="subtitle">A te csendes edzésnaplód</p>
      </header>
      
      <div class="stats-grid">
        <app-stat-card 
          class="card-wrapper" 
          title="Napi cél" 
          [value]="goalPercent + '%'" 
          label="kattints a cél emeléséhez"
          (cardAction)="increaseGoal()">
        </app-stat-card>

        <app-stat-card 
          class="card-wrapper" 
          title="Aktív percek" 
          [value]="totalMinutes.toString()" 
          label="gyors +10 perc"
          (cardAction)="addQuickMinutes()">
        </app-stat-card>

        <app-stat-card 
          class="card-wrapper" 
          title="Energia" 
          [value]="(totalMinutes * 7).toString()" 
          label="becsült kcal"
          [isInteractive]="false">
        </app-stat-card>
      </div>
      <div class="ai-box" style="margin-top: 20px; padding: 15px; border-radius: 12px; background: rgba(212, 175, 55, 0.1); border: 1px solid #D4AF37;">
  <h4 style="color: #D4AF37; margin-top: 0;">✨ Zen AI Asszisztens</h4>
  <p style="font-style: italic; color: #eee; margin-bottom: 0;">{{ aiAdvice }}</p>
</div>

      <section class="journal-section">
        <h3 class="section-title">Mai tevékenységek rögzítése</h3>
        
        <form class="entry-form" #logForm="ngForm" (ngSubmit)="addEntry(logForm)">
          <input type="text" name="activity" [(ngModel)]="newActivity" required placeholder="Mit sportoltál?" class="zen-input">
          <input type="number" name="duration" [(ngModel)]="newDuration" required min="1" placeholder="Perc" class="zen-input short">
          <button type="submit" [disabled]="logForm.invalid" class="add-btn">Rögzítés</button>
        </form>

        <div class="entry-list">
          <div *ngFor="let entry of dailyEntries" class="entry-item">
            <span class="entry-info">✨ <strong>{{entry.activity}}</strong> - {{entry.duration}} perc</span>
            <button class="delete-small" (click)="deleteEntry(entry.id)">×</button>
          </div>
          <p *ngIf="dailyEntries.length === 0" class="empty-msg">Még nincs rögzített mozgás mára.</p>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-container { animation: fadeIn 1.5s ease-out; padding: 20px; color: white; }
    .zen-title { color: var(--color-text-main); font-size: 1.4rem; font-weight: 300; letter-spacing: 3px; text-transform: uppercase; margin: 0; }
    .subtitle { color: var(--color-primary); font-style: italic; font-size: 0.8rem; margin-bottom: 40px; opacity: 0.8; }
    .stats-grid { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 40px; }
    .card-wrapper { flex: 1; min-width: 200px; }
    .journal-section { background: rgba(255,255,255,0.05); padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); }
    .section-title { font-weight: 300; letter-spacing: 1px; margin-bottom: 20px; color: var(--color-primary); }
    .entry-form { display: flex; gap: 10px; margin-bottom: 25px; }
    .zen-input { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 10px; border-radius: 8px; flex: 2; }
    .zen-input.short { flex: 0.5; }
    .add-btn { background: var(--color-primary); color: black; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; }
    .entry-list { display: flex; flex-direction: column; gap: 10px; }
    .entry-item { display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 12px 20px; border-radius: 12px; }
    .delete-small { background: none; border: 1px solid #ff4d4d; color: #ff4d4d; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; }
  `]
})
export class DashboardComponent implements OnInit {
  dailyEntries: DailyEntry[] = [
    { id: 1, activity: 'Reggeli Jóga', duration: 20 },
    { id: 2, activity: 'Séta az erdőben', duration: 30 }
  ];

  newActivity: string = '';
  newDuration?: number;
  totalMinutes = 0;
  goalPercent = 0;
  targetMinutes = 60; 

  aiAdvice: string = "Elemezem az edzési adataidat...";
  ngOnInit() {
  setTimeout(() => {
    const advices = [
      "AI Tipp: A reggeli edzéseid hatékonyabbak. Próbálj holnap 8 előtt kezdeni!",
      "Elemzés: A 'Reggeli Jóga' tervedet már 3-szor teljesítetted. Emeld a szintet!",
      "AI Javaslat: Ma pihenőnapot javaslok az izmaid regenerálódásához."
    ];
    this.aiAdvice = advices[Math.floor(Math.random() * advices.length)];
  }, 1000);
}

  calculateStats() {
    this.totalMinutes = this.dailyEntries.reduce((sum, entry) => sum + entry.duration, 0);
    this.goalPercent = Math.min(Math.round((this.totalMinutes / this.targetMinutes) * 100), 100);
  }


  addQuickMinutes() {
    const quickEntry: DailyEntry = {
      id: Date.now(),
      activity: 'Gyors mozgás',
      duration: 10
    };
    this.dailyEntries.push(quickEntry);
    this.calculateStats();
  }

  increaseGoal() {
    this.targetMinutes += 15;
    if (this.targetMinutes > 180) this.targetMinutes = 30; 
    this.calculateStats();
    alert(`Új napi cél beállítva: ${this.targetMinutes} perc`);
  }

  addEntry(form: any) {
    if (form.valid) {
      const entry: DailyEntry = {
        id: Date.now(),
        activity: this.newActivity,
        duration: this.newDuration!
      };
      this.dailyEntries.push(entry);
      this.calculateStats();
      this.newActivity = '';
      this.newDuration = undefined;
      form.resetForm();
    }
  }

  deleteEntry(id: number) {
    if (confirm('Törlöd ezt a bejegyzést?')) {
      this.dailyEntries = this.dailyEntries.filter(e => e.id !== id);
      this.calculateStats();
    }
  }
  
}
