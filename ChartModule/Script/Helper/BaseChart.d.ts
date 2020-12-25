export declare abstract class BaseChart {
    initObj: any;
    mCanvas: HTMLCanvasElement;
    mBgCanvas: HTMLCanvasElement;
    cWidth: number;
    cHeight: number;
    mContext: CanvasRenderingContext2D;
    mBgContext: CanvasRenderingContext2D;
    mBgColor: string;
    mChartBgColor: string;
    mFontType: string;
    mFontSize: number;
    mUseClientHeight: boolean;
    mClientRect: any;
    static Text_Chche: any;
    static Axis_Default: number[];
    constructor(initObj: any);
    getParamValue(aValue: any, def: any): any;
    measureSize: () => void;
    repaint(delay?: number, callback?: Function | null): void;
    abstract drawMain(): void;
    drawBgToContext(mouseEvent?: MyMouseEvent): void;
    drawFrontContext: (mouseEvent?: MyMouseEvent | undefined) => void;
    MeasureText(text: string, bold: string, font: string, size: number): TextObj;
    drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius?: number, fill?: boolean, stroke?: boolean, lineWidth?: number): void;
    dashedLineTo(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, pattern: number, lineColor: string): void;
    clearLineTo(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, lineColor?: string, lineWidth?: number): void;
    drawRectEx(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string, lineWidth?: number): void;
    fillRectEx(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string): void;
    drawString(ctx: CanvasRenderingContext2D, txt: string, x: number, y: number, size: number, font?: string, color?: string, align?: any, base?: any): number;
    drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color?: string): void;
    getPrettyAxis(dMin: number, dMax: number, aDiv?: number): number[];
    log10(val: number): number;
    mouseMove: (evt: MouseEvent) => void;
    mouseDown: (evt: MouseEvent) => void;
    mouseOut: (evt: MouseEvent) => void;
    mouseHandle: (evt: MouseEvent) => void;
    getMousePos: (evt: MouseEvent) => {
        x: number;
        y: number;
    };
    hexToRgb: (hex: string) => {
        r: number;
        g: number;
        b: number;
    } | {
        r?: undefined;
        g?: undefined;
        b?: undefined;
    };
    addComma: (x: any) => any;
}
export declare class TextObj {
    Width: number;
    Height: number;
    constructor(Width: number, Height: number);
}
export declare class MyMouseEvent {
    XPos: number;
    YPos: number;
    EventType: string;
    constructor(XPos: number, YPos: number, EventType: string);
}
