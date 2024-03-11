import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Checklist, EditChecklist, RemoveChecklist } from '../../../shared/interfaces/checklist';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checklist-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <ul>

      @for ( checklist of checklists; track checklist.id) {
       <li> <a routerLink='/checklist/{{checklist.id}}'  >{{checklist.title}}</a>
          <div> 
            <button (click)="edit.emit(checklist)"> Edit </button>
            <button (click)="remove.emit(checklist.id)"> Remove </button>
          </div>
      </li>
      }
      @empty {
        <p> Create your first checklist , click Add new checklist</p>
      }
    </ul>
  `,
  styles: ``
})
export class ChecklistListComponent {

 @Input({required: true}) checklists!: Checklist[] 
 @Output() remove=new EventEmitter<RemoveChecklist>()
 @Output() edit=new EventEmitter<Checklist>()

}
