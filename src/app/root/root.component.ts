import { Component, OnInit } from '@angular/core';
import {WebLoginService} from "../web-login.service";

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit {

  constructor(
      private webLoginService: WebLoginService
  ) {
    if (webLoginService.checkLogin()) {
      webLoginService.setLoginInformation();
    }
    else
      webLoginService.deleteCookie();
  }

  public checkLogin() : boolean {
    return this.webLoginService.checkLogin();
  }

  ngOnInit() {
  }

}
