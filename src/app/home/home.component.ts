import { Component, effect, inject, signal } from '@angular/core';
import { ModalComponent } from '../shared/ui/modal.component';
import { Checklist } from '../shared/interfaces/checklist';
import { FormModalComponent } from '../shared/ui/form-modal.component';
import { FormBuilder } from '@angular/forms';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ChecklistListComponent } from './ui/checklist-list/checklist-list.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ModalComponent, FormModalComponent, ChecklistListComponent],
  template: `
  <h1> Todos </h1>
  <button (click)="checkListBeingEditted.set({})">Add new Todo Check List</button>
    <app-modal [isOpen]="!!checkListBeingEditted()">
  <ng-template >
  <app-form-modal [formgroup]="checkListForm" 
  [title]="checkListBeingEditted()?.title? checkListBeingEditted()!.title! : 'Add Checklist'"
  (close)="checkListBeingEditted.set(null)" 
  (save)="checklistService.add$.next(checkListForm.getRawValue())"
  > 
</app-form-modal>
  </ng-template>
      
  </app-modal>

  
<app-checklist-list [checklists]="checklistService.checklists() " > 
</app-checklist-list> 

  `,
  styles: ``
})
export default class HomeComponent {
  checklistService=inject(ChecklistService)
  checkListBeingEditted= signal <Partial<Checklist> | null> (null);
  formBuilder=inject(FormBuilder)
  checkListForm=this.formBuilder.nonNullable.group({
    title: ['']
  })
  constructor () {
    effect (()=>{
            const checklist=this.checkListBeingEditted()
            if(!checklist){
              this.checkListForm.reset()
            }
    })
  }
}
