import { Component,  computed,  effect, inject, signal } from '@angular/core';
import { HeaderComponent } from './ui/checklist-header.component';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ChecklistItem } from '../shared/interfaces/checklist-item';
import { FormBuilder } from '@angular/forms';
import { ModalComponent } from '../shared/ui/modal.component';
import { FormModalComponent } from '../shared/ui/form-modal.component';
import { ChecklistItemService } from './data-access/checklist-item.service';
import { ChecklistItemListComponent } from './ui/checklistItem-list.component';

@Component({
  selector: 'app-checklist-detail',
  standalone: true,
  imports: [HeaderComponent, ModalComponent, FormModalComponent, ChecklistItemListComponent],
  template: `
   @if (checklist(); as checklist) {
    <app-header [checklist]="checklist" 
                 (addItem)="checklistItemBeingEdited.set({})"
                (resetChecklist)="checklistItemService.reset$.next($event)"
    
    />
    <app-modal [isOpen]="!!checklistItemBeingEdited()">
      <ng-template >
        <app-form-modal [formgroup]="checklistItemForm" 
                     title="Create Item"
                     (save)="checklistItemService.add$
                     .next({item: checklistItemForm.getRawValue(),
                            checklistId: checklist?.id!})"
                            (close)="checklistItemBeingEdited.set(null)"
        ></app-form-modal>
      </ng-template>
      
    </app-modal>
     <app-checklistItem-list [checklistItems]="checklistItems() "
       (toggle)="checklistItemService.toggle$.next($event)"
     ></app-checklistItem-list>
   }
   


  `,
  styles: ``
})
export default class ChecklistDetailComponent {
     checklistService=inject(ChecklistService)
     checklistItemService=inject(ChecklistItemService)
     route=inject(ActivatedRoute)
     formBuilder=inject(FormBuilder)

     checklistItemForm=this.formBuilder.nonNullable.group({
      title:['']
     })
     
     checklistItemBeingEdited=signal<Partial<ChecklistItem> | null>(null)
     params=toSignal(this.route.paramMap)
     
     checklist=computed(()=> 
     this.checklistService.checklists().find((checklist)=> checklist.id===this.params()?.get('id'))
     )
     
     checklistItems=this.checklistItemService.checklistItems
     constructor () {
      effect(()=>{
        const checklistItem=this.checklistItemBeingEdited()
        if(!checklistItem)
        {
          this.checklistItemForm.reset()
        }
      })
     }
}
