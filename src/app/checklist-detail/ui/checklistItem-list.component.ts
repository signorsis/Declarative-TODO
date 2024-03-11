import { Component, EventEmitter, Input, Output} from '@angular/core';
import { ChecklistItem, EditChecklistItem } from '../../shared/interfaces/checklist-item';

import { RemoveChecklist } from '../../shared/interfaces/checklist';

@Component({
    standalone: true,
    selector: 'app-checklistItem-list',
    template: `
    <section>

        <ul>
            
            @for (listItem of checklistItems; track listItem.id) {
                
                <li> 
                    <div>
                    @if(listItem.checked)
                { <span>✅</span>
                         
                }   {{listItem.title}} 
                    </div>
                    <div>
                        <button (click)="toggle.emit(listItem.id)">Toggle</button>
                        <button (click)="edit.emit(listItem)"> Edit</button>
                       <button (click)="delete.emit(listItem.id)"> Remove </button>
                   
            </div>
            </li>    
            }

            @empty {
                <div>
                     <h2>Add an item</h2>
                     <p>Click the add button to add your first item to this quicklist</p>
                </div>
            }

        </ul>
        
    </section>
    `,
    styles :  [
        `
          ul {
            padding: 0;
            margin: 0;
          }
          li {
            font-size: 1.5em;
            display: flex;
            justify-content: space-between;
            background: var(--color-light);
            list-style-type: none;
            margin-bottom: 1rem;
            padding: 1rem;
    
            button {
              margin-left: 1rem;
            }
          }
        `,
      ]
})

export class ChecklistItemListComponent  {
     @Input({required: true}) checklistItems!: ChecklistItem[]
     @Output() toggle=new EventEmitter<RemoveChecklist>()
     @Output() delete=new EventEmitter<RemoveChecklist>()
     @Output() edit=new EventEmitter<ChecklistItem>()
     
    constructor() { }

}