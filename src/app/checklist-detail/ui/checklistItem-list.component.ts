import { Component, Input} from '@angular/core';
import { ChecklistItem } from '../../shared/interfaces/checklist-item';

@Component({
    standalone: true,
    selector: 'app-checklistItem-list',
    template: `
    <section>

        <ul>
            
            @for (listItem of checklistItems; track listItem.id) {
                
                <li> <div>{{listItem.title}}</div></li>    
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
    constructor() { }

}