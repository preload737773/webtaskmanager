import {
    DragDropEffects,
    NodeDropInputMode,
    SimpleNode,
    Rect,
    TemplateNodeStyle
} from "yfiles";
import {DragAndDropPanel} from "./dndPanel";
import {ExportConstants} from "../exportConstants";

export class DragAndDropConfig {
    private passiveSupported: boolean = true;

    initializeDnDPanel() {
        // initialize panel for yFiles drag and drop
        const dragAndDropPanel = new DragAndDropPanel(document.getElementById('drag-and-drop-panel')!, this.passiveSupported);
        // Set the callback that starts the actual drag and drop operation
        dragAndDropPanel.beginDragCallback = (element: any, data: any) => {
            const dragPreview = element.cloneNode(true);
            dragPreview.style.margin = '0';
            let dragSource;
                dragSource = NodeDropInputMode.startDrag(
                    element,
                    data,
                    DragDropEffects.ALL,
                    true,
                    dragPreview
                )

            // let the GraphComponent handle the preview rendering if possible
            if (dragSource) {
                dragSource.addQueryContinueDragListener((src, args) => {
                    if (args.dropTarget === null) {
                        $(dragPreview).removeClass('hidden');
                        //removeClass(dragPreview, 'hidden');
                    } else {
                        //addClass(dragPreview, 'hidden');
                        $(dragPreview).addClass('hidden');
                    }
                })
            }
        }

        dragAndDropPanel.maxItemWidth = ExportConstants.maxItemWidth;
        dragAndDropPanel.populatePanel(this.createDnDPanelItems());
    }

    createDnDPanelItems() : any[] {
        const itemContainer = [];

        const startNodeStyle = new SimpleNode();
        startNodeStyle.layout = new Rect(0, 0, ExportConstants.startNodeWidth, ExportConstants.startNodeHeight);
        startNodeStyle.style = new TemplateNodeStyle(ExportConstants.startNodeStyle);
        startNodeStyle.tag = JSON.stringify({
            name: "New",
            description: "Node",
            importance: "lightgreen",
            style: ExportConstants.startNodeStyle
        });
        itemContainer.push({ element: startNodeStyle, tooltip: 'Start Node \n A start for new beginnings. 0 inputs, 10 outputs' });

        const processNodeStyle = new SimpleNode();
        processNodeStyle.layout = new Rect(0, 0, ExportConstants.processNodeWidth, ExportConstants.processNodeHeight);
        processNodeStyle.style = new TemplateNodeStyle(ExportConstants.processNodeStyle);
        processNodeStyle.tag = JSON.stringify({
            name: "New",
            description: "Node",
            importance: "lightgreen",
            style: ExportConstants.processNodeStyle
        });
        itemContainer.push({ element: processNodeStyle, tooltip: 'Process Node \n Main node type for tasks, 2 inputs, 1 output' });

        const ifNodeStyle = new SimpleNode();
        ifNodeStyle.layout = new Rect(50, 0, ExportConstants.ifNodeWidth, ExportConstants.ifNodeHeight);
        ifNodeStyle.style = new TemplateNodeStyle(ExportConstants.ifNodeStyle);
        ifNodeStyle.tag = JSON.stringify({
            name: "New",
            description: "Node",
            importance: "lightgreen",
            style: ExportConstants.ifNodeStyle
        });
        itemContainer.push({ element: ifNodeStyle, tooltip: 'If Node \n A node with 1 input and 2 outputs' });

        const endNodeStyle = new SimpleNode();
        endNodeStyle.layout = new Rect(0, 0, ExportConstants.endNodeWidth, ExportConstants.endNodeHeight);
        endNodeStyle.style = new TemplateNodeStyle(ExportConstants.endNodeStyle);
        endNodeStyle.tag = JSON.stringify({
            name: "New",
            description: "Node",
            importance: "lightgreen",
            style: ExportConstants.endNodeStyle
        });
        itemContainer.push({ element: endNodeStyle, tooltip: 'End Node \n The end of the model. 10 inputs, 0 outputs' });

        return itemContainer;
    }
}