// Core imports
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';

// Service worker
import { ServiceWorkerModule } from '@angular/service-worker';

// Cookies
import { CookieService } from 'ngx-cookie-service';

// Components
import { AppComponent } from './app.component';
import { RunFormComponent } from './run-form/run-form.component';
import { FormQuestionComponent } from './form-question/form-question.component';

// Material elements
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  imports: [ BrowserModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule, MatToolbarModule, MatMenuModule, MatButtonModule, MatIconModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  declarations: [ AppComponent, RunFormComponent, FormQuestionComponent ],
  providers: [ CookieService ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor() {
  }
}
