// Core imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';

// Service Worker
import { ServiceWorkerModule } from '@angular/service-worker';

// Cookies
import { CookieService } from 'ngx-cookie-service';

// Toasts
import { ToastrModule } from 'ngx-toastr';

// Components
import { AppComponent } from './app.component';
import { RunFormComponent } from './run-form/run-form.component';

// Material elements
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
	declarations: [
		AppComponent,
		RunFormComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		MatToolbarModule,
		MatMenuModule,
		MatButtonModule,
		MatIconModule,
		ToastrModule.forRoot(),
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
	],
	providers: [ CookieService ],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
