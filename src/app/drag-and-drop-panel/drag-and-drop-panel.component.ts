import { Component, OnInit } from '@angular/core';
import {DragAndDropConfig} from "./drag-and-drop-config";

@Component({
  selector: 'app-drag-and-drop-panel',
  templateUrl: './drag-and-drop-panel.component.html',
  styleUrls: ['./drag-and-drop-panel.component.css']
})
export class DragAndDropPanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let config: DragAndDropConfig = new DragAndDropConfig();
    config.initializeDnDPanel();
  }

}
