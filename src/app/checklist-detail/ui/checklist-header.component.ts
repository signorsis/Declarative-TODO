import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist, RemoveChecklist } from '../../shared/interfaces/checklist';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
  <header>

    <a routerLink="/home"> back</a>
    <h1> {{checklist.title}}</h1>
    <button (click)="addItem.emit()"> Add Item</button>
     <button (click)="resetChecklist.emit(checklist.id)"> Reset Checklist</button>
</header>
  `,
  styles: ``
})
export class HeaderComponent {
@Input({required: true}) checklist!:Checklist 
@Output() addItem=new EventEmitter<void>()
@Output() resetChecklist=new EventEmitter<RemoveChecklist>()
}
