import {AfterViewInit, ApplicationRef, Component, ComponentFactoryResolver, Injector, ViewChild} from '@angular/core';
import 'yfiles/view-layout-bridge.js';
import {
    FreeNodePortLocationModel,
    GraphComponent, IEdge, IModelItem,
    TemplateNodeStyle
} from "yfiles";
import {GraphComponentComponent} from "./graph-component/graph-component.component";
import {WebClientServiceService} from "./web-client-service.service";
import {ExportConstants} from "./exportConstants";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild(GraphComponentComponent, { static: false })
  private gcComponent!: GraphComponentComponent;
  public currentTask?: IModelItem;
  public isSidebarOpened: boolean;
  private webClientService: WebClientServiceService;

  constructor(
    private _injector: Injector,
    private _resolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef
  ) {
    this.isSidebarOpened = false;
    this.webClientService = _injector.get(WebClientServiceService);
  }

  private initialize(json: JSON) : void {
      this.gcComponent.graphComponent = new GraphComponent(this.gcComponent.graphComponentRef.nativeElement);
      this.gcComponent.graphComponent.graph.nodeDefaults.style = new TemplateNodeStyle(ExportConstants.processNodeStyle);
      this.gcComponent.graphComponent.graph.nodeDefaults.ports.autoCleanUp = false;
      this.gcComponent.graphComponent.graph.nodeDefaults.ports.locationParameter = FreeNodePortLocationModel.NODE_CENTER_ANCHORED;
      this.gcComponent.graphComponent.selection.addItemSelectionChangedListener((sender, evt) => {
          if (evt.itemSelected) {
              this.currentTask = evt.item;
              this.openSidebar();
          }
          else {
              this.closeSidebar();
          }
      });
      this.gcComponent.run(json);
  }

  ngAfterViewInit() : void {
      let getDataResponse = this.webClientService.getDataJson();
      getDataResponse.then((response) => {
          response.json().then(json => {
              this.initialize(json);
          })
      },(reason) => {
          console.log(reason);
      });
  }

  addTask() : void {
      if (this.gcComponent.graphComponent.currentItem != null) {
          let tag = JSON.parse(this.gcComponent.graphComponent.currentItem.tag);
          tag.name = $('#addNameForm').val();
          tag.description = $('#addDescriptionForm').val();
          tag.notificationDate = $('#addNotificationDateForm').val();
          tag.importance = $('#addImportanceForm').val();
          let addTaskResponse = this.webClientService.addTask(tag);
          if (addTaskResponse) {
              addTaskResponse.then(() => {
                  $('#modalCenter').modal("hide");
                  let node = this.gcComponent.graphComponent.graph.createNode();
                  node.tag = tag;
                  node.tag.wrappedName = (node.tag.name.length > ExportConstants.nameLengthLimit)
                      ? node.tag.name.substr(0, ExportConstants.nameLengthLimit) + '...' : node.tag.name;
                  node.tag.wrappedDescription = (node.tag.description.length > ExportConstants.descriptiomLengthLimit)
                      ? node.tag.description.substr(0, ExportConstants.descriptiomLengthLimit) + '...' : node.tag.description;
                  this.gcComponent.graphComponent.graph.addPortAt(node, node.layout.center);
                  this.gcComponent.graphComponent.graph.setStyle(node, new TemplateNodeStyle(node.tag.style));
                  this.gcComponent.graphComponent.morphLayout(this.gcComponent.createLayout(true)).then();
              });
          }
          this.gcComponent.graphComponent.graph.remove(this.gcComponent.graphComponent.currentItem);
      }
  }

  editTask() : void {
      let nodeInfo = this.gcComponent.graphComponent.selection.selectedNodes.last();
      let name: HTMLInputElement = document.getElementById('nameInput') as HTMLInputElement;
      let description: HTMLInputElement = document.getElementById('descriptionInput') as HTMLInputElement;
      let date: HTMLInputElement = document.getElementById('dateInput') as HTMLInputElement;
      let importance: HTMLInputElement = document.getElementById('importanceInput') as HTMLInputElement;
      let editTaskResponse = this.webClientService.editTask(nodeInfo.tag, name, description, date, importance);
      if (editTaskResponse) {
          editTaskResponse.then(() => {
                nodeInfo.tag.name = name.value;
                nodeInfo.tag.description = description.value;
                nodeInfo.tag.notificationDate = date.value;
                nodeInfo.tag.importance = importance.value;
                let a = new TemplateNodeStyle(nodeInfo.tag.style);
                nodeInfo.tag.wrappedName = (nodeInfo.tag.name.length > ExportConstants.nameLengthLimit)
                      ? nodeInfo.tag.name.substr(0, ExportConstants.nameLengthLimit) + '...' : nodeInfo.tag.name;
                nodeInfo.tag.wrappedDescription = (nodeInfo.tag.description.length > ExportConstants.descriptiomLengthLimit)
                      ? nodeInfo.tag.description.substr(0, ExportConstants.descriptiomLengthLimit) + '...' : nodeInfo.tag.description;
                this.gcComponent.graphComponent.graph.setStyle(nodeInfo, new TemplateNodeStyle(nodeInfo.tag.style));
                this.gcComponent.graphComponent.morphLayout(this.gcComponent.createLayout(true)).then();
          },
              (reject) => {
                console.log(reject);
              });
      }
  }

  deleteItem() : void {
      if (this.gcComponent.graphComponent.selection.selectedEdges.size > 0) {
          let edge: IEdge = this.gcComponent.graphComponent.selection.selectedEdges.last();
          let deleteEdgeResponse = this.webClientService.deleteEdge(edge);
          if (deleteEdgeResponse) {
              deleteEdgeResponse.then(() => {
                  this.gcComponent.graphComponent.graph.remove(edge);
              });
          }
      }
      else if (this.gcComponent.graphComponent.selection.selectedNodes.size > 0) {
          let item = this.gcComponent.graphComponent.selection.selectedNodes.last();
          let deleteNodeResponse = this.webClientService.deleteTask(item.tag);
          if (deleteNodeResponse) {
              deleteNodeResponse.then(() => {
                  this.gcComponent.graphComponent.graph.remove(item);
              });
          }
      }
      this.gcComponent.graphComponent.morphLayout(this.gcComponent.createLayout(true)).then();
  }

  public openSidebar() : void {
    this.isSidebarOpened = true;
  }

  public closeSidebar() : void {
    this.isSidebarOpened = false;
  }
}
