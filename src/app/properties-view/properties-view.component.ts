import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IModelItem} from "yfiles";

@Component({
  selector: 'properties-view',
  templateUrl: './properties-view.component.html',
  styleUrls: ['./properties-view.component.css']
})
export class PropertiesViewComponent {
  @Input() task!: IModelItem;
  @Output() editClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteClicked: EventEmitter<any> = new EventEmitter<any>();
}
