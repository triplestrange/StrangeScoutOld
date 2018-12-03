import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RunFormComponent } from './run-form/run-form.component';
import { HomeComponent } from './home/home.component';
import { CacheManagementComponent } from './cache-management/cache-management.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'scout', component: RunFormComponent },
	{ path: 'cache', component: CacheManagementComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
