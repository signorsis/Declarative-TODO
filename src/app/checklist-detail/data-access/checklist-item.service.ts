import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AddChecklistItem, ChecklistItem, RemoveChecklistItem } from '../../shared/interfaces/checklist-item';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from '../../shared/data-access/storage.service';


export interface ChecklistItemState {
  checklistItems: ChecklistItem[],
  loaded: boolean,
  error: string | null
}
@Injectable({
  providedIn: 'root'
})
export class ChecklistItemService {
  // storage service using local storage
   storageService=inject(StorageService)

  
 // state
   private state=signal<ChecklistItemState>({checklistItems: [], loaded: false, error: null})

 //selectors
 checklistItems=computed(()=> this.state().checklistItems)
 loaded=computed(()=>this.state().loaded)
 
 //  observer or source
   add$=new Subject<AddChecklistItem>()
   toggle$=new Subject<RemoveChecklistItem>()
   reset$=new Subject<RemoveChecklistItem>()
   //crude sources
   delete$=new Subject<RemoveChecklistItem>()

   // source from local storage supplied using storageService
   loadChecklistItems$=this.storageService.loadChecklistItems()
   



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
   
    this.toggle$.pipe(takeUntilDestroyed()).subscribe((checklistItemId)=>{

                                      this.state.update(state=>(
                                        {
                                          ...state,
                                          checklistItems: state.checklistItems.map(item=>
                                              item.id=== checklistItemId? 
                                              {...item, checked:!item.checked} : item
                                            )
                                        }
                                      ))
    })                                   
    
    this.reset$.pipe(takeUntilDestroyed()).subscribe((checklist_id)=> 
                                                      this.state.update((state)=>(
                                                        {
                                                          ...state,
                                                          checklistItems: state.checklistItems.
                                                          map((listItem)=>
                                                          (   checklist_id===listItem.checklist_id ?{
                                                            ...listItem,
                                                            checked: false
                                                          }  : listItem )
                                                          )
                                                        }

                                                      )) 
                                                      )
  
   this.loadChecklistItems$.pipe(takeUntilDestroyed()).subscribe({
    next: (checklistItems)=>(
      this.state.update(state=>({
        ...state,
        checklistItems: checklistItems,
        loaded: true,

      }))
    ),


    error: (err)=> this.state.update(state=> ({...state, error: err}))
   })
   this.delete$.pipe(takeUntilDestroyed()).subscribe((checklistItemId)=>this.state.update(
                                                  state=>({
                                                    ...state,
                                                    checklistItems: state.checklistItems.filter(listItems=>
                                                      listItems.id!==checklistItemId
                                                      )
                                                  })
                                            ))
   //effect
   effect(()=>{
    if(this.loaded())
    {
      this.storageService.saveChecklistItems(this.checklistItems())
    }
   })


 }
}
