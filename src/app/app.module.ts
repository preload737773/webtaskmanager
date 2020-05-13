import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component'
import { GraphComponentComponent } from './graph-component/graph-component.component'
import { PropertiesViewComponent } from './properties-view/properties-view.component';
import { DragAndDropPanelComponent } from './drag-and-drop-panel/drag-and-drop-panel.component';
import { ModalComponent } from './modal/modal.component'
import {WebClientServiceService} from "./web-client-service.service";

@NgModule({
  entryComponents: [AppComponent],
  declarations: [AppComponent, GraphComponentComponent, PropertiesViewComponent, DragAndDropPanelComponent, ModalComponent],
  imports: [BrowserModule, FormsModule],
  providers: [WebClientServiceService],
  bootstrap: [AppComponent]
})
export class AppModule {}
