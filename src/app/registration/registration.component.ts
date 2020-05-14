import { Component, OnInit } from '@angular/core';
import {WebLoginService} from "../web-login.service";
import {WebRegistrationService} from "../web-registration.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  public isLoggedIn: boolean = false;
  constructor(
      private webLoginService: WebLoginService,
      private webRegistrationService: WebRegistrationService
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.webLoginService.checkLogin();
  }

  public onSubmit() {
    let usernameForm = document.getElementById("emailForm") as HTMLInputElement;
    let passwordForm = document.getElementById("passwordForm") as HTMLInputElement;
    if (usernameForm && passwordForm) {
      this.webRegistrationService.register(usernameForm.value, passwordForm.value).then((response) => {
        response.text().then((text) => {
          alert(text);
          location.reload();
        });
      });
    }
  }

}
