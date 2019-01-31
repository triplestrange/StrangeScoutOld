import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RunFormComponent } from './run-form/run-form.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
	{ path: '', component: HomeComponent, data: { state: 'home' } },
	{ path: 'scout', component: RunFormComponent, data: { state: 'run-form' } }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
