
import { KeyValuePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe],
  template: `
    <header>

      <h1>{{title}} </h1>
      <button (click)="close.emit()">Close</button>
    </header>
    <section>

      <form [formGroup]="formgroup" (ngSubmit)="save.emit(); close.emit()">
        @for(control of formgroup.controls | keyvalue  ; track control.key )  {
          <div>
            
            <label for="control.key"> {{control.key}}</label>
            <input [id]="control.key" [formControlName]="control.key" type="text">
          </div>
        }
        <button type="submit"> Save</button>
      </form>
    </section>
  `,
  styles: [
    `
      form {
        padding: 1rem;
      }

      div {
        display: flex;
        flex-direction: column;
      }
        label {
          margin-bottom: 1rem;
          font-weight: bold;
        }

        input {
          font-size: 1.5rem;
          padding: 10px;
        }
      

      section button {
        margin-top: 1rem;
        width: 100%;
      }
    `
  ]
})
export class FormModalComponent {
@Input({required: true}) formgroup! : FormGroup
@Input({required: true}) title!: string
@Output() close=new EventEmitter<void> ()
@Output() save=new EventEmitter<void> ()
}
