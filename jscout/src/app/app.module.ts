import { BrowserModule }                from '@angular/platform-browser';
import { ReactiveFormsModule }          from '@angular/forms';
import { NgModule }                     from '@angular/core';

import { AppComponent }                 from './app.component';
import { RunFormComponent }         from './run-form/run-form.component';
import { FormQuestionComponent } from './form-question/form-question.component';

// Material elements
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


@NgModule({
  imports: [ BrowserModule, ReactiveFormsModule, BrowserAnimationsModule, MatToolbarModule, MatMenuModule, MatButtonModule, MatIconModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  declarations: [ AppComponent, RunFormComponent, FormQuestionComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor() {
  }
}
