import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'

import { AppComponent } from './app-wtm/app.component'
import { GraphComponentComponent } from './graph-component/graph-component.component'
import { PropertiesViewComponent } from './properties-view/properties-view.component';
import { DragAndDropPanelComponent } from './drag-and-drop-panel/drag-and-drop-panel.component';
import { ModalComponent } from './modal/modal.component'
import {WebClientServiceService} from "./web-client-service.service";
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { RootComponent } from './root/root.component';
import { StartComponent } from './start/start.component';
import {WebLoginService} from "./web-login.service";
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { ErrorComponent } from './error/error.component';
import { RegistrationComponent } from './registration/registration.component';

@NgModule({
  entryComponents: [RootComponent],
  declarations: [AppComponent, GraphComponentComponent, PropertiesViewComponent, DragAndDropPanelComponent, ModalComponent, LoginComponent, RootComponent, StartComponent, ProfileViewComponent, ErrorComponent, RegistrationComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [WebClientServiceService, WebLoginService],
  bootstrap: [RootComponent]
})
export class AppModule {}
