import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AppComponent} from "./app-wtm/app.component";
import {APP_BASE_HREF} from "@angular/common";
import {LoginComponent} from "./login/login.component";
import {StartComponent} from "./start/start.component";
import {ProfileViewComponent} from "./profile-view/profile-view.component";

const routes: Routes = [
  { path: 'app', component: AppComponent },
  { path: 'login', component:  LoginComponent},
  { path: 'profile', component:  ProfileViewComponent},
  { path: '', component:  StartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{provide: APP_BASE_HREF, useValue: '/'}]
})
export class AppRoutingModule { }
