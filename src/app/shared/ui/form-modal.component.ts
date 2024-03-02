
import { KeyValuePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe],
  template: `
    <h1>{{title}} </h1>
    <button (click)="close.emit()">Close</button>
    <form [formGroup]="formgroup" (ngSubmit)="save.emit(); close.emit()">
       @for(control of formgroup.controls | keyvalue  ; track control.key )  {
                  <label for="control.key"> {{control.key}}</label>
                  <input [id]="control.key" [formControlName]="control.key" type="text">
                  
       }
       <button type="submit"> Save</button>
     </form>
  `,
  styles: ``
})
export class FormModalComponent {
@Input({required: true}) formgroup! : FormGroup
@Input({required: true}) title!: string
@Output() close=new EventEmitter<void> ()
@Output() save=new EventEmitter<void> ()
}
