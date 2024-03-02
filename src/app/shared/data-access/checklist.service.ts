import { Injectable, computed, signal } from '@angular/core';
import { AddChecklist, Checklist } from '../interfaces/checklist';
import { Subject,  } from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop'

export interface ChecklistsState {
  checklists: Checklist[]
}

@Injectable({
  providedIn: 'root'
})

export class ChecklistService {
  
  // state
  private state= signal<ChecklistsState>({checklists: []})

  //selector
  checklists=computed(() => this.state().checklists);

  //sources
  add$=new Subject<AddChecklist>()
  constructor() { 
      //reducers 
      this.add$.pipe(takeUntilDestroyed()).subscribe(
        (checklist)=> this.state.update((state)=> (
          {...state,
            checklists: [...state.checklists, this.addIdToChecklist(checklist) ]
          }
        ))
      )
  }

  private addIdToChecklist<Checklist>(checklist: AddChecklist){
   return {
    ...checklist,
    id: this.generateSlug(checklist.title)
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