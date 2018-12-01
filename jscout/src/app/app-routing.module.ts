import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RunFormComponent } from './run-form/run-form.component';

const routes: Routes = [
	{ path: 'scout', component: RunFormComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
