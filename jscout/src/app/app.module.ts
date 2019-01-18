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
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
// Material Form elements
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';

// Components
import { AppComponent } from './app.component';
import { RunFormComponent } from './run-form/run-form.component';
import { HomeComponent } from './home/home.component';
import { CacheManagementComponent } from './cache-management/cache-management.component';
import { DataComponent } from './data/data.component';
import { CounterDirective } from './counter.directive';
import { BeginMatchDialogComponent } from './begin-match-dialog/begin-match-dialog.component';
import { ElementEventDialogComponent } from './element-event-dialog/element-event-dialog.component';
import { EndMatchDialogComponent } from './end-match-dialog/end-match-dialog.component';

@NgModule({
	declarations: [
		AppComponent,
		RunFormComponent,
		HomeComponent,
		CacheManagementComponent,
		DataComponent,
		CounterDirective,
		BeginMatchDialogComponent,
		ElementEventDialogComponent,
		EndMatchDialogComponent
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
		MatSliderModule,
		MatIconModule,
		MatCardModule,
		MatInputModule,
		MatCheckboxModule,
		MatSelectModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatDialogModule,
		ToastrModule.forRoot(),
		ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
	],
	providers: [ CookieService ],
	bootstrap: [ AppComponent ],
	entryComponents: [BeginMatchDialogComponent, EndMatchDialogComponent, ElementEventDialogComponent]
})
export class AppModule { }
