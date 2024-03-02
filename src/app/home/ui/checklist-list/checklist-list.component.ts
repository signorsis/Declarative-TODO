import { Component, Input } from '@angular/core';
import { Checklist } from '../../../shared/interfaces/checklist';

@Component({
  selector: 'app-checklist-list',
  standalone: true,
  imports: [],
  template: `
    <ul>

      @for ( checklist of checklists; track checklist.id) {
        <li>{{checklist.title}}</li>
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

}
