import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './services/tutorial/check-tutorial.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tutorial',
    pathMatch: 'full'
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./tutorial/tutorial.module').then(m => m.TutorialPageModule),
    canLoad: [CheckTutorial]
  },
  {
    path: 'signin',
    loadChildren: () => import('./login/signin/signin.module').then(m => m.SigninPageModule)
  },
  {
    path: 'home-cliente',
    loadChildren: () => import('./pages/home/home-cliente/home-cliente.module').then( m => m.HomeClientePageModule)
  },
  {
    path: 'HomeInvitadoPage',
    loadChildren: () => import('./pages/home/home-invitado/home-invitado.module').then( m => m.HomeInvitadoPageModule)
  },
  {
    path: 'HomeInvitadoStep2Page',
    loadChildren: () => import('./pages/home/home-invitado-step-dos/home-invitado-step-dos.module').then( m => m.HomeInvitadoStepDosPageModule)
  },
  {
    path: 'error-root',
    loadComponent: () => import('./pages/error-root/error-root.page').then(m => m.ErrorRootPage),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
