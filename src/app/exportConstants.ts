import {ArrowType, Fill, Stroke} from "yfiles";

export class ExportConstants {
    //dndPanel
    public static readonly maxItemWidth = 100;
    //SVG Node Style Constraints
    public static readonly startNodeWidth = 175;
    public static readonly startNodeHeight = 50;

    public static readonly processNodeWidth = 175;
    public static readonly processNodeHeight = 50;

    public static readonly ifNodeWidth = 140;
    public static readonly ifNodeHeight = 140;

    public static readonly endNodeWidth = 175;
    public static readonly endNodeHeight = 50;
    //SVG Node Style Labels
    public static readonly processNodeStyle = 'processNode';
    public static readonly ifNodeStyle = 'ifNode';
    public static readonly startNodeStyle = 'startNode';
    public static readonly endNodeStyle = 'endNode';
    public static readonly nameLengthLimit = 18;
    public static readonly descriptiomLengthLimit = 18;
    // Edge Style Labels
    public static readonly processNodeEdgeStyleName = 'process';
    public static readonly ifNodeEdgeStyleName = 'if';
    // Default Edge Style Params
    public static readonly defaultSmoothingLength = 27;
    public static readonly defaultStroke = Stroke.BLUE_VIOLET;
    public static readonly defaultTargetArrowFill = Fill.BLUE_VIOLET;
    public static readonly defaultTargetArrowStroke = Stroke.BLUE_VIOLET;
    public static readonly defaultTargetArrowScale = 2;
    public static readonly defaultTargetArrowType = ArrowType.TRIANGLE;
    public static readonly defaultTargetArrowCropLength = 3;
    // If Edge Style Params
    public static readonly ifSmoothingLength = 27;
    public static readonly ifStroke = '#ff6699';
    public static readonly ifTargetArrowFill = '#ff6699';
    public static readonly ifTargetArrowStroke = new Stroke('#ff6699');
    public static readonly ifTargetArrowScale = 2;
    public static readonly ifTargetArrowType = ArrowType.TRIANGLE;
    public static readonly ifTargetArrowCropLength = 2;
    public static readonly ifSourceArrowFill = Fill.WHITE;
    public static readonly ifSourceArrowStroke = new Stroke('#ff6699');
    public static readonly ifSourceArrowScale = 1;
    public static readonly ifSourceArrowType = ArrowType.CIRCLE;
    public static readonly ifSourceArrowCropLength = 0;
}