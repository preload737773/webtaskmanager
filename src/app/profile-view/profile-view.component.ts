import { Component, OnInit } from '@angular/core';
import {WebLoginService} from "../web-login.service";

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  constructor(
      private webLoginService: WebLoginService
  ) { }

  ngOnInit() {
  }

  public logout() {
    this.webLoginService.deleteCookie();
  }

}
