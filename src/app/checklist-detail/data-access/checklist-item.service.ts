import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AddChecklistItem, ChecklistItem, EditChecklistItem, RemoveChecklistItem } from '../../shared/interfaces/checklist-item';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from '../../shared/data-access/storage.service';
import { RemoveChecklist } from '../../shared/interfaces/checklist';


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

   //crud sources
   remove$=new Subject<RemoveChecklistItem>()
   edit$=new Subject<EditChecklistItem>()

   //shared source for checklist service and checklistitems service
   checklistRemoved$=new Subject<RemoveChecklist>()

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
   this.remove$.pipe(takeUntilDestroyed()).subscribe((checklistItemId)=>this.state.update(
                                                  state=>({
                                                    ...state,
                                                    checklistItems: state.checklistItems.filter(listItems=>
                                                      listItems.id!==checklistItemId
                                                      )
                                                  })
                                            ))
    this.edit$.pipe(takeUntilDestroyed()).subscribe( (update)=>this.state.update(
                                                state=>({...state, checklistItems: state.checklistItems.map(
                                                  item=>( item.id===update.id? { ...item, title: update.data.title} : item)
                                                )})
    ) )
   
    this.checklistRemoved$.pipe(takeUntilDestroyed()).subscribe( (checklistId)=> this.state.update(
      state=> ( {...state, checklistItems: state.checklistItems.filter(item=> item.checklist_id!==checklistId)})
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
