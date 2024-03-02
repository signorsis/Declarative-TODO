import { RemoveChecklist } from "./checklist"

export interface ChecklistItem {
    id: string,
    title: string,
    checked: boolean,
    checklist_id: string
}

export type AddChecklistItem= {item: Omit <ChecklistItem, 'id' | 'checked' | 'checklist_id'> ,
                                checklistId: RemoveChecklist 
                                }
export type EditChecklistItem={ 
                                id: ChecklistItem['id'],
                                data: AddChecklistItem['item']
                                 }

export type RemoveChecklistItem=ChecklistItem['id']
