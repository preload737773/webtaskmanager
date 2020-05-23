import { Component, OnInit } from '@angular/core';
import {WebLoginService} from "../web-login.service";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  constructor(
      private webLoginService: WebLoginService
  ) {  }

  ngOnInit() {
    let button = document.getElementById("app-loader-btn") as HTMLAnchorElement;
    button.href = (this.webLoginService.checkLogin()) ? "/app" : "login";
  }

}
