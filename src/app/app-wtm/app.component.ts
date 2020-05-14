import {AfterViewInit, ApplicationRef, Component, ComponentFactoryResolver, Injector, ViewChild} from '@angular/core';
import 'yfiles/view-layout-bridge.js';
import {
    FreeNodePortLocationModel,
    GraphComponent, IEdge, IModelItem, INode, Rect,
    TemplateNodeStyle
} from "yfiles";
import {GraphComponentComponent} from "../graph-component/graph-component.component";
import {WebClientServiceService} from "../web-client-service.service";
import {ExportConstants} from "../exportConstants";
import moment from "moment";
import {WebLoginService} from "../web-login.service";

@Component({
  selector: 'app-wtm',
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
    _injector.get(WebLoginService).setLoginInformation();
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
      setInterval(() => {
          this.gcComponent.graphComponent.graph.nodes.forEach((node: INode) => {
              let now = moment();
              let notificationDate = moment(node.tag.notificationDate);
              if (notificationDate.isSameOrBefore(now) && node.tag.style == ExportConstants.processNodeStyle && node.tag.importance != "expired") {
                  this.showCustomToast("Web Task Manager", `The ${node.tag.name} task is expired!`);
                  node.tag.importance = "expired";
                  this.webClientService.editTask(node.tag);
                  this.gcComponent.graphComponent.graph.setStyle(node, new TemplateNodeStyle(node.tag.style));
                  this.gcComponent.graphComponent.morphLayout(this.gcComponent.createLayout(true)).then();
              }
          })
      }, 15000);
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
                  let rect = (node.tag.style == ExportConstants.ifNodeStyle) ? new Rect(0, 0, ExportConstants.ifNodeWidth, ExportConstants.ifNodeHeight)
                      : new Rect(0, 0, ExportConstants.processNodeWidth, ExportConstants.processNodeHeight);
                  this.gcComponent.graphComponent.graph.setNodeLayout(node, rect);
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
      nodeInfo.tag.name = name.value;
      nodeInfo.tag.description = description.value;
      nodeInfo.tag.notificationDate = date.value;
      nodeInfo.tag.importance = importance.value;
      let editTaskResponse = this.webClientService.editTask(nodeInfo.tag);
      if (editTaskResponse) {
          editTaskResponse.then(() => {
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

    public showCustomToast(header: string, body: string) : void {
        let toast = $('.toast');
        toast.show();
        $('#toastHeader').text(header);
        toast.children('.toast-body').text(body);
        toast.toast({delay: 10000});
        toast.toast('show');
    }
}
