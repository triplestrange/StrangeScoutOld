import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatchFormComponent } from './match-form/match-form.component';
import { PitFormComponent } from './pit-form/pit-form.component';

const appRoutes: Routes = [
  {
    path: 'match',
    component: MatchFormComponent
  },
  {
    path: 'pit',
    component: PitFormComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
