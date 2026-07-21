import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { UnauthorizedComponent } from './core/auth/unauthorized/unauthorized.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrateur'] }
  },
  {
    path: 'formations',
    loadChildren: () => import('./modules/formations/formations.module').then(m => m.FormationsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'examens',
    loadChildren: () => import('./modules/examens/examens.module').then(m => m.ExamensModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'inscriptions',
    loadChildren: () => import('./modules/inscriptions/inscriptions.module').then(m => m.InscriptionsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'presences',
    loadChildren: () => import('./modules/presences/presences.module').then(m => m.PresencesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'resultats',
    loadChildren: () => import('./modules/resultats/resultats.module').then(m => m.ResultatsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'attestations',
    loadChildren: () => import('./modules/attestations/attestations.module').then(m => m.AttestationsModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }