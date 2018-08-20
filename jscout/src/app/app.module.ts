import { BrowserModule }                from '@angular/platform-browser';
import { ReactiveFormsModule }          from '@angular/forms';
import { NgModule }                     from '@angular/core';

import { AppComponent }                 from './app.component';
import { RunFormComponent }         from './run-form/run-form.component';
import { FormQuestionComponent } from './form-question/form-question.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';



@NgModule({
  imports: [ BrowserModule, ReactiveFormsModule, BrowserAnimationsModule ],
  declarations: [ AppComponent, RunFormComponent, FormQuestionComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor() {
  }
}
