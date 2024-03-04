import { Component, EventEmitter, Input, Output} from '@angular/core';
import { ChecklistItem } from '../../shared/interfaces/checklist-item';

import { RemoveChecklist } from '../../shared/interfaces/checklist';

@Component({
    standalone: true,
    selector: 'app-checklistItem-list',
    template: `
    <section>

        <ul>
            
            @for (listItem of checklistItems; track listItem.id) {
                
                <li> <div>
                    @if(listItem.checked)
                { <span>✅</span>
                         
                }   {{listItem.title}}</div>
            
            <div>
                <button (click)="toggle.emit(listItem.id)">Toggle</button>
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
    `
})

export class ChecklistItemListComponent  {
     @Input({required: true}) checklistItems!: ChecklistItem[]
     @Output() toggle=new EventEmitter<RemoveChecklist>()
     
    constructor() { }

}