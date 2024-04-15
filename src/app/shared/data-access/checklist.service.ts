import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AddChecklist, Checklist, EditChecklist,} from '../interfaces/checklist';
import { EMPTY, Subject, catchError, map, merge, } from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop'
import { StorageService } from './storage.service';
import { ChecklistItemService } from '../../checklist-detail/data-access/checklist-item.service';
import {connect} from 'ngxtension/connect'

export interface ChecklistsState {
  checklists: Checklist[],
  loaded: boolean,
  error: string | null
}

@Injectable({
  providedIn: 'root'
})

export class ChecklistService {
  //storage service (local storage)
  storageService=inject(StorageService)
  checklistItemService=inject(ChecklistItemService)

  // state
  private state= signal<ChecklistsState>({checklists: [] , loaded: false, error: null})

  //selector
  checklists=computed(() => this.state().checklists);
  loaded=computed(()=>this.state().loaded)

  //sources
      add$=new Subject<AddChecklist>()
      checklistLoaded$=this.storageService.loadChecklists().pipe
                                        (catchError((err)=>{ this.error$.next(err); 
                                                            return EMPTY;}
                                                          )
                                        );
      //crud sources
      edit$=new Subject<EditChecklist>()
      //shared source that is from checklistitemServices
      remove$=this.checklistItemService.checklistRemoved$
      error$=new Subject<string>()
  constructor() { 
    
    
    const nextstate$=merge(
      this.error$.pipe(map((error)=>({error}))),
      this.checklistLoaded$.pipe(map((checklists)=>({checklists,loaded:true})))
      )

      connect(this.state)
      .with(nextstate$)
      .with(this.add$, (state, checklist)=>({ checklists: [...state.checklists, this.addIdToChecklist(checklist) ]}))
      .with(this.remove$,
        (state,checklistId)=>({checklists: state.checklists.filter(checklist=>checklist.id!==checklistId)}))
        .with(this.edit$,
          (state,update)=>({checklists: state.checklists
            .map(checklist=> 
              checklist.id===update.id? {...checklist, title: update.data.title} : checklist)
                        })
                      )
     
       //reducers 
         // this.add$.pipe(takeUntilDestroyed()).subscribe(
         //   (checklist)=> this.state.update((state)=> (
         //     {...state,
         //       checklists: [...state.checklists, this.addIdToChecklist(checklist) ]
         //     }
         //   ))
         // )

      // this.checklistLoaded$.pipe(takeUntilDestroyed()).subscribe(
      // { next :  (checklists)=> this.state.update(state=> (
        //     {
      //       ...state,
      //       checklists,
      //       loaded: true
      //     }
      //   )),
      //   error: (err)=> this.state.update(state=> (
      //     {
      //       ...state,
      //       error: err
      //     }
      //   ))
      
      // }
      //   )

      // this.remove$.pipe(takeUntilDestroyed()).subscribe(checklistId=>this.state.update(
      //   state=>({...state, checklists: state.checklists.filter(checklist=>checklist.id!==checklistId) })
      // ))  
     
      
      //    this.edit$.pipe(takeUntilDestroyed()).subscribe(update=> this.state.update(state=> 
      //                               ({...state, checklists: state.checklists.map(checklist=> checklist.id===update.id? {...checklist, title: update.data.title} : checklist
      //                               )})                
      //                               ))

     

     // ***** EFFECTS
        effect(()=> {
          if(this.loaded()){
            this.storageService.saveChecklists(this.checklists())
          }
        })
  }

  private addIdToChecklist<Checklist>(checklist: AddChecklist){
   return {
    ...checklist,
    id: this.generateSlug(checklist.title),
    
   }

  }
  private generateSlug(title: string){
    let slug=title.toLowerCase().replace('/\s+/g', '-')

    const matchingSlugs=this.checklists().find((checklist)=> checklist.title===title)


    if(matchingSlugs){
      slug=slug+ Date.now().toString()
    }
    return slug
  }

}