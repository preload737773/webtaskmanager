import {Component, Injector, OnInit} from '@angular/core';
import {WebLoginService} from "./web-login.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private webLoginService: WebLoginService;
  public isLoggedIn: boolean;

  constructor(
      private _injector: Injector
  ) {
    this.webLoginService = _injector.get(WebLoginService);
    this.isLoggedIn = this.webLoginService.checkLogin();
  }

  ngOnInit() {
  }

  public onSubmit() : void {
    this.webLoginService.login();
  }

}
