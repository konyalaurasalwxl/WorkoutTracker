import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="plan-card" [class.active]="isStarted">
      <div class="plan-info">
        <div class="plan-icon">{{ isStarted ? '🧘' : '🌱' }}</div>
        <div class="plan-text">
          <h4>{{ title }}</h4>
          <p>{{ duration }}</p>
        </div>
      </div>

      <div class="plan-actions">
        <button class="icon-btn" (click)="edit.emit()">✏️</button>
        <button class="icon-btn" (click)="delete.emit()">🗑️</button>
        
        <button 
          class="zen-button" 
          [class.started]="isStarted" 
          (click)="isStarted = !isStarted">
          {{ isStarted ? 'Folyamatban' : 'Kezdés' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .plan-card {
      background: rgba(30, 45, 30, 0.6);
      backdrop-filter: blur(12px);
      padding: 15px 25px;
      border-radius: 24px;
      border: 1px solid rgba(212, 175, 55, 0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      transition: all 0.3s ease;
    }
    .plan-card.active { border-color: #D4AF37; background: rgba(44, 62, 44, 0.8); }
    .plan-info { display: flex; align-items: center; gap: 15px; }
    .plan-text h4 { color: white; margin: 0; font-size: 1rem; }
    .plan-text p { color: #D4AF37; margin: 0; font-size: 0.75rem; }
    .plan-actions { display: flex; gap: 10px; align-items: center; }
    .icon-btn { background: none; border: none; cursor: pointer; font-size: 1.1rem; padding: 5px; }
    .zen-button {
      background: transparent;
      border: 1px solid #D4AF37;
      color: #D4AF37;
      padding: 8px 15px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.7rem;
    }
    .zen-button.started { background: #D4AF37; color: #2C3E2C; }
  `]
})
export class PlanItemComponent {
  @Input() title: string = '';
  @Input() duration: string = '';

  // Események definiálása
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  isStarted = false;
}