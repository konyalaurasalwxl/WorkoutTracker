import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-zen" 
         [attr.aria-label]="title + ': ' + value"
         (click)="onCardClick()"
         [class.interactive]="isInteractive">
      
      <h3>{{ title }}</h3>
      <p class="stat-value">{{ value }}</p>
      <div class="divider"></div>
      <p class="stat-label">{{ label }}</p>
      
      <span class="tap-hint" *ngIf="isInteractive">+</span>
    </div>
  `,
  styles: [`
    .card-zen { 
      background: var(--color-surface); 
      backdrop-filter: blur(12px);
      padding: 30px 20px; 
      border-radius: var(--radius-lg); 
      border: 1px solid rgba(212, 175, 55, 0.15);
      width: 100%;
      box-sizing: border-box; 
      box-shadow: var(--shadow-main);
      transition: all 0.5s cubic-bezier(0.2, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
    }
    
  
    .interactive { cursor: pointer; }

    .card-zen:hover {
      transform: translateY(-10px) scale(1.01); 
      background: var(--color-surface-hover); 
      border-color: var(--color-primary); 
      box-shadow: var(--shadow-hover);
    }

    /* Aktív állapot (kattintáskor) */
    .card-zen:active {
      transform: translateY(-5px) scale(0.98);
      transition: all 0.1s;
    }
    
    .card-zen h3 { 
      margin-top: 0; 
      color: var(--color-text-main); 
      font-size: 0.7rem; 
      text-transform: uppercase;
      letter-spacing: 2px;
      opacity: 0.6;
    }
    
    .stat-value { 
      color: var(--color-primary);
      font-size: 2.2rem; 
      font-weight: 300; 
      margin: 10px 0;
      font-family: 'Times New Roman', serif;
    }

    .divider {
      height: 1px;
      width: 30px;
      background: var(--color-primary);
      margin: 15px 0;
      opacity: 0.3;
    }
    
    .stat-label { 
      color: var(--color-text-main); 
      opacity: 0.4; 
      font-size: 0.65rem; 
      letter-spacing: 1px;
      text-transform: lowercase;
    }

    .tap-hint {
      position: absolute;
      top: 15px;
      right: 15px;
      color: var(--color-primary);
      font-size: 1.2rem;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .card-zen:hover .tap-hint {
      opacity: 0.5;
    }
  `]
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() label = '';
  @Input() isInteractive = true; 


  @Output() cardAction = new EventEmitter<void>();

  onCardClick() {
    if (this.isInteractive) {
      this.cardAction.emit();
    }
  }
}