import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";
import {AppComponent} from "./app-wtm/app.component";
import {APP_BASE_HREF} from "@angular/common";
import {LoginComponent} from "./login/login.component";
import {StartComponent} from "./start/start.component";
import {ProfileViewComponent} from "./profile-view/profile-view.component";
import {AppGuardGuard} from "./app-guard.guard";
import {ErrorComponent} from "./error/error.component";
import {RegistrationComponent} from "./registration/registration.component";

const routes: Routes = [
  { path: 'app', component: AppComponent, canActivate: [AppGuardGuard] },
  { path: 'login', component:  LoginComponent},
  { path: 'profile', component:  ProfileViewComponent},
  { path: 'register', component:  RegistrationComponent},
  { path: '', component:  StartComponent},
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(
      routes,
      {
        preloadingStrategy: PreloadAllModules
      })],
  exports: [RouterModule],
  providers: [{provide: APP_BASE_HREF, useValue: '/'}]
})
export class AppRoutingModule { }
