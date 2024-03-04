import { Injectable, computed, signal } from '@angular/core';
import { AddChecklistItem, ChecklistItem } from '../../shared/interfaces/checklist-item';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


export interface ChecklistItemState {
  checklistItems: ChecklistItem[]
}
@Injectable({
  providedIn: 'root'
})
export class ChecklistItemService {
 // state
   private state=signal<ChecklistItemState>({checklistItems: []})

 //selector
 checklistItems=computed(()=> this.state().checklistItems)

  //  observer or source
   add$=new Subject<AddChecklistItem>()

  
  constructor() { 
    //reducer
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklistItem)=>
    this.state.update((state)=> ( {
      ...state, 
      checklistItems: [
        ...state.checklistItems,
        {
          ...checklistItem.item,
          id: Date.now().toString(),
          checklist_id: checklistItem.checklistId,
          checked: false
        }
      ]
    
    }) )
    )
  }
}
