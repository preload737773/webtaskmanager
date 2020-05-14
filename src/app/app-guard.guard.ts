import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {WebLoginService} from "./web-login.service";

@Injectable({
  providedIn: 'root'
})
export class AppGuardGuard implements CanActivate {
  private webLoginService: WebLoginService = new WebLoginService();
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.webLoginService.checkLogin();
  }
  
}
