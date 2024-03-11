import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist, RemoveChecklist } from '../../shared/interfaces/checklist';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
  <header>

    <a routerLink="/home"> Back</a>
    <h1> {{checklist.title}}</h1>
    <div>

      <button (click)="addItem.emit()"> Add Item</button>
      <button (click)="resetChecklist.emit(checklist.id)"> Reset </button>
    </div>
</header>
  `,
  styles:  [
    `
      button {
        margin-left: 1rem;
      }
    `,
  ],
})
export class HeaderComponent {
@Input({required: true}) checklist!:Checklist 
@Output() addItem=new EventEmitter<void>()
@Output() resetChecklist=new EventEmitter<RemoveChecklist>()
}
