// Core imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';

// service worker
import { ServiceWorkerModule } from '@angular/service-worker';

// Cookies
import { CookieService } from 'ngx-cookie-service';

// Toasts
import { ToastrModule } from 'ngx-toastr';

// Material elements
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
// Material Form elements
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';

// Components
import { AppComponent } from './app.component';
import { RunFormComponent } from './run-form/run-form.component';
import { FormBlockComponent } from './form-block/form-block.component';
import { HomeComponent } from './home/home.component';
import { CacheManagementComponent } from './cache-management/cache-management.component';
import { DataComponent } from './data/data.component';

@NgModule({
	declarations: [
		AppComponent,
		RunFormComponent,
		FormBlockComponent,
		HomeComponent,
		CacheManagementComponent,
		DataComponent
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
		MatCardModule,
		MatInputModule,
		MatCheckboxModule,
		MatSelectModule,
		ToastrModule.forRoot(),
		ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
	],
	providers: [ CookieService ],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
