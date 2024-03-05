import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AddChecklist, Checklist,} from '../interfaces/checklist';
import { Subject, } from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop'
import { StorageService } from './storage.service';

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

  // state
  private state= signal<ChecklistsState>({checklists: [] , loaded: false, error: null})

  //selector
  checklists=computed(() => this.state().checklists);
  loaded=computed(()=>this.state().loaded)

  //sources
  add$=new Subject<AddChecklist>()
  checklistLoaded$=this.storageService.loadChecklists()

  constructor() { 
      //reducers 
      this.add$.pipe(takeUntilDestroyed()).subscribe(
        (checklist)=> this.state.update((state)=> (
          {...state,
            checklists: [...state.checklists, this.addIdToChecklist(checklist) ]
          }
        ))
      )
     
      this.checklistLoaded$.pipe(takeUntilDestroyed()).subscribe(
      { next :  (checklists)=> this.state.update(state=> (
          {
            ...state,
            checklists,
            loaded: true
          }
        )),
        error: (err)=> this.state.update(state=> (
          {
            ...state,
            error: err
          }
        ))
      
      }
        )

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