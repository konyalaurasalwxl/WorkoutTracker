import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data';
import { Exercise, ExerciseType } from '../../models/fitlife.models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="settings-container">
      <h2 class="zen-title">{{ isEditing ? 'Gyakorlat módosítása' : 'Gyakorlatok kezelése 🏋️' }}</h2>
      
      <div *ngIf="statusMessage" class="status-toast" [ngClass]="statusType">
        {{ statusMessage }}
      </div>

      <p class="stats-text">Összesen: {{ totalCount() }} gyakorlat mentve</p>

      <form class="exercise-form" [formGroup]="exForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <input type="text" formControlName="name" placeholder="Gyakorlat neve">
          <small *ngIf="exForm.get('name')?.invalid && exForm.get('name')?.touched" style="color: #ff4d4d;">
            A név kötelező (min. 3 karakter)!
          </small>
        </div>

        <div class="form-group">
          <select formControlName="type">
            <option value="weight">Súlyzós</option>
            <option value="yoga">Jóga</option>
            <option value="warmup">Bemelegítés</option>
          </select>
        </div>

        <div class="form-group">
          <textarea formControlName="description" placeholder="Rövid leírás..."></textarea>
        </div>

        <div class="button-group">
          <button type="submit" [disabled]="exForm.invalid">
            {{ isEditing ? 'Mentés' : 'Gyakorlat hozzáadása' }}
          </button>
          <button type="button" class="cancel-btn" *ngIf="isEditing" (click)="cancelEdit()">Mégse</button>
        </div>
      </form>

      <hr class="divider">

      <div class="list-header">
        <h3 class="zen-title">Saját gyakorlatok</h3>
          <div class="list-controls">
            <button class="sort-btn" (click)="toggleSort()">
              Név szerint {{ sortOrder() === 'asc' ? '↓' : '↑' }}
            </button>
            <input type="text" class="search-bar" placeholder="Keresés..." 
           [value]="searchFilter()" (input)="onSearchInput($event)">
          </div>
      </div>

      <div class="exercise-list">
        <div *ngIf="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Gyakorlatok szinkronizálása a felhővel...</p>
        </div>

        <div *ngIf="errorMessage" class="error-state">
          <p>⚠️ {{ errorMessage }}</p>
          <button (click)="retryLoad()">Újrapróbálás</button>
        </div>

        <div *ngIf="!isLoading && !errorMessage">
          <div *ngFor="let ex of filteredExercises()" class="exercise-item">
            <div class="info">
              <span class="badge" [ngClass]="ex.type">{{ ex.type }}</span>
              <strong>{{ ex.name }}</strong>
              <p>{{ ex.description }}</p>
            </div>
            <div class="actions">
              <button class="edit-btn" (click)="onEdit(ex)">✏️</button>
              <button class="delete-btn" (click)="ex.id && onDelete(ex.id, ex.name)">🗑️</button>
            </div>
          </div>
          
          <div *ngIf="filteredExercises().length === 0" class="empty-state">
            <p>Nincs találat a keresési feltételekre.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container { padding: 20px; color: white; animation: fadeIn 1s ease-in; position: relative; }
    .zen-title { font-weight: 300; text-transform: uppercase; letter-spacing: 2px; color: #D4AF37; }
    .stats-text { color: #aaa; font-size: 0.9rem; margin-bottom: 15px; }
    .exercise-form { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 30px; display: grid; gap: 10px; }
    input, select, textarea { 
      width: 100%; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);
      background: rgba(0,0,0,0.3); color: white; box-sizing: border-box;
    }
    .search-bar { width: 200px; padding: 8px; font-size: 0.8rem; }
    .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .list-controls { display: flex; gap: 10px; align-items: center; }
      .sort-btn { 
      background: rgba(212, 175, 55, 0.2); border: 1px solid #D4AF37; 
      color: #D4AF37; padding: 5px 10px; border-radius: 4px; cursor: pointer;
      font-size: 0.8rem;
    }
.sort-btn:hover { background: #D4AF37; color: black; }
    .exercise-item { 
      background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 10px;
      display: flex; justify-content: space-between; align-items: center; border-left: 4px solid #D4AF37;
    }
    .badge { font-size: 0.6rem; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; margin-right: 10px; }
    .weight { background: #ff4d4d; }
    .yoga { background: #4dff88; color: black; }
    .warmup { background: #4da6ff; }
    .edit-btn, .delete-btn { background: none; border: none; cursor: pointer; font-size: 1.2rem; }
    button[type="submit"] { background: #D4AF37; color: black; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; }
    button[disabled] { opacity: 0.5; cursor: not-allowed; }
    .cancel-btn { background: #444; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; }
    
    .loading-state { text-align: center; padding: 30px; opacity: 0.7; }
    .spinner { 
      border: 4px solid rgba(212, 175, 55, 0.1); border-left-color: #D4AF37; 
      border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; 
      margin: 0 auto 10px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .error-state { background: rgba(255, 77, 77, 0.1); border: 1px solid #ff4d4d; padding: 15px; border-radius: 8px; text-align: center; }
    .error-state button { background: #ff4d4d; color: white; border: none; padding: 5px 15px; border-radius: 4px; margin-top: 10px; cursor: pointer; }
    
    .status-toast { 
      position: fixed; top: 20px; right: 20px; padding: 15px 25px; border-radius: 8px; 
      z-index: 1000; animation: slideIn 0.3s ease;
    }
    .status-toast.success { background: #4dff88; color: black; }
    .status-toast.error { background: #ff4d4d; color: white; }
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
    
    .empty-state { text-align: center; padding: 20px; opacity: 0.5; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class SettingsComponent implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  sortOrder = signal<'asc' | 'desc'>('asc');
  // Állapotok
  exercises = signal<Exercise[]>([]);
  searchFilter = signal('');
  isEditing = false;
  editingId: string | null = null;
  
  // Aszinkron állapotjelzők
  isLoading = true;
  errorMessage: string | null = null;
  statusMessage: string | null = null;
  statusType: 'success' | 'error' = 'success';
  private debounceTimer: any;

  exForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    type: new FormControl('weight', Validators.required),
    description: new FormControl('')
  });

  filteredExercises = computed(() => {
    let result = this.exercises().filter(ex => 
      ex.name.toLowerCase().includes(this.searchFilter().toLowerCase())
    );
    return result.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (this.sortOrder() === 'asc') return nameA < nameB ? -1 : 1;
      return nameA > nameB ? -1 : 1;
    });
  });
  toggleSort() {
    this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
  }

  totalCount = computed(() => this.exercises().length);

  ngOnInit() {
    this.loadData();

    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchFilter.set(params['search']);
      }
    });
  }

  loadData() {
    this.isLoading = true;
    this.errorMessage = null;
    this.dataService.exercises$.subscribe({
      next: (data) => {
        this.exercises.set(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = "Nem sikerült betölteni az adatokat.";
        this.isLoading = false;
        this.showToast("Hálózati hiba!", "error");
      }
    });
  }

  retryLoad() {
    this.loadData();
  }

  // 2.5.5 Debounce megvalósítása
  onSearchInput(event: any) {
    const value = event.target.value;
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.updateSearch(value);
    }, 400);
  }

  updateSearch(value: string) {
    this.searchFilter.set(value);
    this.router.navigate([], { 
      queryParams: { search: value || null }, 
      queryParamsHandling: 'merge' 
    });
  }

  async onSubmit() {
    if (this.exForm.invalid) return;
    const formValue = this.exForm.value;
    
    try {
      if (this.isEditing && this.editingId) {
        await this.dataService.updateExercise({ ...formValue, id: this.editingId } as Exercise);
        this.showToast("Sikeres módosítás! ✨");
      } else {
        await this.dataService.addExercise({ ...formValue, userId: 'u1' } as Exercise);
        this.showToast("Gyakorlat hozzáadva! 🏋️");
      }
      this.cancelEdit();
    } catch (error) {
      this.showToast("Sikertelen mentés!", "error");
    }
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.statusMessage = message;
    this.statusType = type;
    setTimeout(() => this.statusMessage = null, 3000);
  }

  onEdit(ex: Exercise) {
    this.isEditing = true;
    this.editingId = ex.id || null;
    this.exForm.patchValue({
      name: ex.name,
      type: ex.type,
      description: ex.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingId = null;
    this.exForm.reset({ type: 'weight' });
  }

  async onDelete(id: string, name: string) {
    if (confirm(`Biztosan törlöd a(z) ${name} gyakorlatot?`)) {
      try {
        await this.dataService.deleteExercise(id);
        this.showToast("Gyakorlat törölve.");
      } catch (e) {
        this.showToast("Törlés sikertelen!", "error");
      }
    }
  }
}