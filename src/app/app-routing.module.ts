import { FardashboardComponent } from './core/component/fardashboard/fardashboard.component';
import { MainboardComponent } from './core/component/mainboard/mainboard.component';
import { LoginComponent } from './core/component/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path:'fardashboard', component:FardashboardComponent },
  { path:'maindashboard', component:MainboardComponent },
  { path:'login', component:LoginComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    useHash: true,
    anchorScrolling: "enabled",
    onSameUrlNavigation: 'reload',
    scrollPositionRestoration: "enabled",
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
