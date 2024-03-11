import { Component, effect, inject, signal } from '@angular/core';
import { ModalComponent } from '../shared/ui/modal.component';
import { Checklist } from '../shared/interfaces/checklist';
import { FormModalComponent } from '../shared/ui/form-modal.component';
import { FormBuilder } from '@angular/forms';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ChecklistListComponent } from './ui/checklist-list/checklist-list.component';
import { ChecklistItemService } from '../checklist-detail/data-access/checklist-item.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ModalComponent, FormModalComponent, ChecklistListComponent],
  template: `
  <h1> Todos </h1>
  <button (click)="checklistBeingEdited.set({})">Add new Todo Check List</button>
    <app-modal [isOpen]="!!checklistBeingEdited()">
  <ng-template >
  <app-form-modal [formgroup]="checklistForm" 
  [title]="checklistBeingEdited()?.title? checklistBeingEdited()!.title! : 'Add Checklist'"
  (close)="checklistBeingEdited.set(null)" 
  (save)="checklistBeingEdited()?.id?
          checklistService.edit$.next( {id:checklistBeingEdited()!.id!, data: checklistForm.getRawValue()}) 
          : checklistService.add$.next(checklistForm.getRawValue())"
  > 
</app-form-modal>
  </ng-template>
      
  </app-modal>

  
<app-checklist-list [checklists]="checklistService.checklists()" 
                    (edit)="checklistBeingEdited.set($event)"
                    (remove)="checklistItemService.checklistRemoved$.next($event)"            
> 
</app-checklist-list> 

  `,
  styles: ``
})
export default class HomeComponent {
  checklistService=inject(ChecklistService)
  checklistItemService=inject(ChecklistItemService)
  checklistBeingEdited= signal <Partial<Checklist> | null> (null);
  formBuilder=inject(FormBuilder)
  checklistForm=this.formBuilder.nonNullable.group({
    title: ['']
  })
  constructor () {
    effect(() => {
      const checklist = this.checklistBeingEdited();

      if (!checklist) {
        this.checklistForm.reset();
      } else {
        this.checklistForm.patchValue({
          title: checklist.title,
        });
      }
    });
  }
}
