import { Component, computed, inject } from '@angular/core';
import { HeaderComponent } from './ui/header.component';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChecklistService } from '../shared/data-access/checklist.service';

@Component({
  selector: 'app-checklist-detail',
  standalone: true,
  imports: [HeaderComponent],
  template: `
   @if (checklist(); as checklist) {
    <app-header [checklist]="checklist"/>
   }
   hi


  `,
  styles: ``
})
export default class ChecklistDetailComponent {
     checklistService=inject(ChecklistService)
     route=inject(ActivatedRoute)

     params=toSignal(this.route.paramMap)

     checklist=computed(()=> this.checklistService.checklists().find((checklist)=> checklist.id===this.params()?.get('id'))
     )
}
