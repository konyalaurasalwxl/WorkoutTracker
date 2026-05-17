import { Component, OnInit, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; 
import { PlanItemComponent } from './plan-item/plan-item';
import { DataService } from '../../services/data';
import { WorkoutPlan } from '../../models/fitlife.models';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, PlanItemComponent, FormsModule],
  template: `
    <div class="plans-container">
      <h2 class="zen-title">{{ isEditing ? 'Terv módosítása ✨' : 'Új út indítása 🌱' }}</h2>
      
      <form class="add-form" #planForm="ngForm" (ngSubmit)="onSubmit(planForm)" novalidate>
        <div class="input-wrapper">
          <input 
            type="text" 
            name="title" 
            [(ngModel)]="newPlanTitle" 
            #titleModel="ngModel"
            required 
            minlength="3"
            placeholder="Terv megnevezése..." 
            class="zen-input"
            [class.invalid-input]="titleModel.invalid && (titleModel.dirty || titleModel.touched)">
          
          <div class="error-msg" *ngIf="titleModel.invalid && (titleModel.dirty || titleModel.touched)">
            <small *ngIf="titleModel.errors?.['required']">A név kitöltése kötelező!</small>
            <small *ngIf="titleModel.errors?.['minlength']">Legalább 3 karakter szükséges!</small>
          </div>
        </div>

        <div class="button-group">
          <button type="submit" [disabled]="planForm.invalid" class="submit-btn">
            {{ isEditing ? 'Mentés' : 'Hozzáadás' }}
          </button>
          <button type="button" *ngIf="isEditing" (click)="cancelEdit(planForm)" class="cancel-btn">Mégse</button>
        </div>
      </form>

      <hr class="divider">

      <div class="plans-list">
        <app-plan-item 
          *ngFor="let plan of workoutPlans"
          [title]="plan.name" 
          [duration]="'30 perc'"
          (edit)="onEdit(plan)"
          (delete)="onDelete(plan.id, plan.name)">
        </app-plan-item>
        
        <p *ngIf="workoutPlans.length === 0" class="empty-state">Még nincsenek rögzített edzésterveid.</p>
      </div>
    </div>
  `,
  styles: [`
    .plans-container { padding: 20px; max-width: 800px; margin: 0 auto; color: white; }
    .zen-title { font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; }
    .add-form { display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px; }
    .input-wrapper { display: flex; flex-direction: column; flex: 1; }
    .zen-input { padding: 12px; border-radius: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: white; transition: 0.3s; }
    .invalid-input { border-color: #ff4d4d !important; background: rgba(255, 77, 77, 0.05); }
    .error-msg { color: #ff4d4d; font-size: 0.75rem; margin-top: 5px; margin-left: 5px; }
    .button-group { display: flex; gap: 10px; }
    .submit-btn { background: #D4AF37; border: none; padding: 12px 25px; border-radius: 12px; cursor: pointer; font-weight: bold; }
    .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .cancel-btn { background: rgba(255,255,255,0.1); border: none; color: white; padding: 0 15px; border-radius: 12px; cursor: pointer; }
    .divider { border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0; }
    .empty-state { text-align: center; opacity: 0.5; font-style: italic; margin-top: 40px; }
  `]
})
export class PlansComponent implements OnInit {
  workoutPlans: WorkoutPlan[] = [];
  newPlanTitle: string = '';
  isEditing = false;
  currentPlanId: string | null = null;
  private dataService = inject(DataService);

  ngOnInit() {
    this.dataService.plans$.subscribe(plans => this.workoutPlans = plans);
  }

  onEdit(plan: WorkoutPlan) {
    this.isEditing = true;
    this.currentPlanId = plan.id;
    this.newPlanTitle = plan.name;
  }

  onDelete(id: string, title: string) {
    if (confirm(`Biztosan törlöd a(z) "${title}" tervet?`)) {
      this.dataService.deletePlan(id);
    }
  }

  cancelEdit(form: NgForm) {
    this.isEditing = false;
    this.currentPlanId = null;
    this.newPlanTitle = '';
    form.resetForm();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.isEditing && this.currentPlanId) {
        this.dataService.updatePlan({
          id: this.currentPlanId,
          userId: '', // A DataService most már automatikusan kitölti az Auth-ból!
          name: this.newPlanTitle,
          exercises: []
        });
      } else {
        this.dataService.addPlan({
          id: '',
          userId: '',
          name: this.newPlanTitle,
          exercises: []
        });
      }
      this.cancelEdit(form);
    }
  }
}