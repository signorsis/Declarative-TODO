import { Injectable, inject,PLATFORM_ID ,InjectionToken} from '@angular/core';
import { of } from 'rxjs';
import { Checklist } from '../interfaces/checklist';
import { ChecklistItem } from '../interfaces/checklist-item';


export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'window local storage object',
  {
    providedIn: 'root',
    factory: () => {
      return inject(PLATFORM_ID) === 'browser'
        ? window.localStorage
        : ({} as Storage);
    },
  }
);
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storage=inject(LOCAL_STORAGE)
 
  // loads checklists from storage
  loadChecklists()
  {
    const checklists=this.storage.getItem('checklists')
    return of(checklists? (JSON.parse(checklists) as Checklist[]): []) 
  }
  // loads checklistItems from storage
  loadChecklistItems()
  {
    const checklistItems=this.storage.getItem('checklistItems')
    return of(checklistItems? (JSON.parse(checklistItems) as ChecklistItem[] ) : [])
  }
  // set checklists in local storage

  saveChecklists(checklists : Checklist[])
  {
    this.storage.setItem('checklists', JSON.stringify(checklists))
  }
  // set checklistItems in local storage
  saveChecklistItems(checklistItems : ChecklistItem[])
  {
    this.storage.setItem('checklistItems', JSON.stringify(checklistItems))
  }
}
