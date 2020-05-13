import {Component, ElementRef, ViewChild} from '@angular/core'
import {
  AdjacentNodesGraphBuilder,
  Arrow,
  CreateEdgeInputMode,
  EdgeEventArgs, GraphComponent,
  GraphEditorInputMode,
  HierarchicLayout,
  IEdge, ILayoutAlgorithm,
  INode,
  LayoutMode,
  LayoutOrientation,
  NodeDropInputMode,
  NodeEventArgs,
  PolylineEdgeStyle,
  Rect, Size,
  TemplateNodeStyle
} from 'yfiles'
import TaskNodeCandidateProvider from "./taskNodeCandidateProvider";
import {WebClientServiceService} from "../web-client-service.service";
import {ExportConstants} from "../exportConstants";

@Component({
  selector: 'graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.css']
})
export class GraphComponentComponent {
  @ViewChild('graphComponentRef', { static: false }) graphComponentRef!: ElementRef;
  graphComponent!: GraphComponent;


  constructor(
      private webClientService: WebClientServiceService
  ) {
  }

  public createNodeEdgeStyle(style: string) : PolylineEdgeStyle {
    switch (style) {
      default:
        return new PolylineEdgeStyle({
          stroke: ExportConstants.defaultStroke,
          smoothingLength: ExportConstants.defaultSmoothingLength,
          targetArrow: new Arrow({
            fill: ExportConstants.defaultTargetArrowFill,
            cropLength: ExportConstants.defaultTargetArrowCropLength,
            stroke: ExportConstants.defaultTargetArrowStroke,
            scale: ExportConstants.defaultTargetArrowScale,
            type: ExportConstants.defaultTargetArrowType
          })
        });
      case "if":
        return new PolylineEdgeStyle({
          stroke: ExportConstants.ifStroke,
          smoothingLength: ExportConstants.ifSmoothingLength,
          sourceArrow: new Arrow({
            fill: ExportConstants.ifSourceArrowFill,
            cropLength: ExportConstants.ifSourceArrowCropLength,
            stroke: ExportConstants.ifSourceArrowStroke,
            scale: ExportConstants.ifSourceArrowScale,
            type: ExportConstants.ifSourceArrowType
          }),
          targetArrow: new Arrow({
            fill: ExportConstants.ifTargetArrowFill,
            cropLength: ExportConstants.ifTargetArrowCropLength,
            stroke: ExportConstants.ifTargetArrowStroke,
            scale: ExportConstants.ifTargetArrowScale,
            type: ExportConstants.ifTargetArrowType
          })
        });
    }
  }

  public changeStyle() : void {
    this.graphComponent.graph.edges.forEach((edge: IEdge) => {
      let processNodeEdgeStyle = this.createNodeEdgeStyle(ExportConstants.processNodeEdgeStyleName);
      let ifNodeEdgeStyle = this.createNodeEdgeStyle(ExportConstants.ifNodeEdgeStyleName);
      if (edge.sourceNode != null && edge.sourceNode.tag.style == ExportConstants.ifNodeStyle)
        this.graphComponent.graph.setStyle(edge, ifNodeEdgeStyle);
      else {
        this.graphComponent.graph.setStyle(edge, processNodeEdgeStyle);
      }
    });
    this.graphComponent.graph.nodes.forEach((node:INode) => {
      this.graphComponent.graph.addPortAt(node, node.layout.center);
      let style = new TemplateNodeStyle(node.tag.style);
      this.graphComponent.graph.setStyle(node, style);
      let rect = (node.tag.style == ExportConstants.ifNodeStyle) ? new Rect(0, 0, ExportConstants.ifNodeWidth, ExportConstants.ifNodeHeight)
          : new Rect(0, 0, ExportConstants.processNodeWidth, ExportConstants.processNodeHeight);
      this.graphComponent.graph.setNodeLayout(node, rect);
      node.tag.wrappedName = (node.tag.name.length > ExportConstants.nameLengthLimit)
          ? node.tag.name.substr(0, ExportConstants.nameLengthLimit) + '...' : node.tag.name;
      node.tag.wrappedDescription = (node.tag.description.length > ExportConstants.descriptiomLengthLimit)
          ? node.tag.description.substr(0, ExportConstants.descriptiomLengthLimit) + '...' : node.tag.description;
    });
    this.graphComponent.morphLayout(this.createLayout(false)).then();
  }

  public run(json: JSON) : void {
    // @ts-ignore
    this.graphComponent.graph.decorator.nodeDecorator.portCandidateProviderDecorator.setFactory((node) => {
      if (node != null) {
        switch (node.tag.style) {
          case "processNode": {
            return new TaskNodeCandidateProvider(node, 2, 1);
          }
          case "ifNode": {
            return new TaskNodeCandidateProvider(node, 1, 2);
          }
          case "startNode": {
            return new TaskNodeCandidateProvider(node, 0, 10);
          }
          case "endNode": {
            return new TaskNodeCandidateProvider(node, 10, 0);
          }
          default:
            return null;
        }
      }
    });
    this.graphComponent.inputMode = this.createInputMode();
    this.buildGraph(json);
    this.graphComponent.morphLayout(this.createLayout(false)).then();
  }

  private createAdjacentNodesGraphBuilder(json: any) : AdjacentNodesGraphBuilder {
    const angBuilder = new AdjacentNodesGraphBuilder(this.graphComponent.graph);
    angBuilder.nodesSource = json.tasks;
    angBuilder.nodeIdBinding = "id";
    angBuilder.predecessorsBinding = "predecessors";
    angBuilder.successorsBinding = "successors";
    angBuilder.addNodeUpdatedListener(() => {
      angBuilder.updateGraph();
    });
    return angBuilder;
  }

  public createLayout(isIncremental: boolean) : ILayoutAlgorithm {
    let layout = new HierarchicLayout();
    let minimumSegmentLength = 50;
    layout.layoutMode = (isIncremental) ? LayoutMode.INCREMENTAL : LayoutMode.FROM_SCRATCH;
    layout.considerNodeLabels = true;
    if (layout.edgeLayoutDescriptor != null) {
      layout.orthogonalRouting = true;
      layout.layoutOrientation = LayoutOrientation.TOP_TO_BOTTOM;
      layout.edgeLayoutDescriptor.minimumFirstSegmentLength = minimumSegmentLength;
      layout.minimumLayerDistance = 10;
      layout.edgeLayoutDescriptor.minimumLength = 10;
      layout.edgeLayoutDescriptor.minimumDistance = 10;
      layout.edgeToEdgeDistance = 27;
      layout.edgeLayoutDescriptor.minimumLastSegmentLength = minimumSegmentLength;
      layout.edgeLayoutDescriptor.sourcePortOptimization = false;
      layout.edgeLayoutDescriptor.targetPortOptimization = false;
      layout.automaticEdgeGrouping = false;
    }
    return layout;
  }

  private buildGraph(json: JSON) : void {
    this.graphComponent.graph.nodeDefaults.size = new Size(ExportConstants.processNodeWidth, ExportConstants.processNodeHeight);
    const builder = this.createAdjacentNodesGraphBuilder(json);
    this.graphComponent.graph = builder.buildGraph();
    this.graphComponent.fitGraphBounds();
    const hl = this.createLayout(false);
    this.changeStyle();
    this.graphComponent.morphLayout(hl, '1s').then();
  }

  public createInputMode() : GraphEditorInputMode {
    let gin = new GraphEditorInputMode();
    gin.createEdgeInputMode = new CreateEdgeInputMode();
    gin.createEdgeInputMode.cancelGestureOnInvalidTarget = true;
    gin.createEdgeInputMode.showTargetHighlight = true;
    gin.createEdgeInputMode.enabled = true;
    gin.createEdgeInputMode.allowCreateBend = false;
    gin.enabled = true;
    gin.allowEditLabel = false;
    gin.allowCreateNode = false;
    gin.allowAdjustGroupNodeSize = false;
    gin.allowAddLabel = false;
    gin.allowClearSelection = true;
    gin.allowCreateEdge = true;
    gin.allowCreateBend = false;
    gin.createBendInputMode.enabled = false;
    gin.allowClipboardOperations = false;
    gin.moveInputMode.enabled = true;
    gin.nodeDropInputMode = new NodeDropInputMode();
    gin.nodeDropInputMode.enabled = true;
    gin.nodeDropInputMode.showPreview = false;
    gin.nodeDropInputMode.addItemCreatedListener(() => {
      let modal = $('#modalCenter');
      if (modal != null && this.graphComponent.currentItem != null) {
        modal.modal({backdrop: "static"});
        modal.modal("show");
      }
    });
    gin.createEdgeInputMode.addEdgeCreatedListener((sender, e) => {
      this.webClientService.addEdge(e.sourcePortOwner.tag, e.targetPortOwner.tag).then(() => {
        let style = (e.sourcePortOwner.tag.style == ExportConstants.ifNodeStyle) ? this.createNodeEdgeStyle(ExportConstants.ifNodeEdgeStyleName) : this.createNodeEdgeStyle(ExportConstants.processNodeEdgeStyleName);
        this.graphComponent.graph.setStyle(e.item, style);
        this.graphComponent.morphLayout(this.createLayout(true)).then();
      });
    });
    gin.addDeletedItemListener((sender, e) => {
      if (e instanceof EdgeEventArgs) {
        this.webClientService.deleteEdge(e.item);
      }
      else if (e instanceof NodeEventArgs) {
        this.webClientService.deleteTask(e.item.tag);
      }
    });
    gin.createEdgeInputMode.useHitItemsCandidatesOnly = true;
    return gin;
  }
}
