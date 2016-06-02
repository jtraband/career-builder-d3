export interface ChartOptions {
    width: number;
    height: number;
    selector?: string | HTMLElement;
    title?: ChartTitle;
    margin?: ChartMargin;
    colors?: any[];
    legend?: ChartLegend;
}


export interface XYChartOptions extends ChartOptions {
    xAxis?: XAxis;
    yAxis?: YAxis;
}

export interface HBarChartOptions extends XYChartOptions {

}

export interface VBarChartOptions extends XYChartOptions {

}

export interface LineChartOptions extends XYChartOptions {

}

export interface ChartMargin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface ChartTitle {
    text: string;
    textStyle?: TextStyle;
}


// not yet implemented
export interface ChartLegend {
    visible?: boolean;
    textStyle?: TextStyle;
    // above, below not yet implemented
    location?: 'above' | 'below' | 'top-right' | 'bottom-right';
}

export interface ChartAxis {
    ticks?: number;
    visible?: boolean;
    // TODO: not yet implemented
    label?: string;
}


export interface XAxis extends ChartAxis {

}

export interface YAxis extends ChartAxis {

}

export class DEFAULTS {
    private static axis: ChartAxis = {
        ticks: 5,
        visible: true
    };

    public static xAxis: XAxis = DEFAULTS.axis;

    public static yAxis: XAxis = DEFAULTS.axis;

    public static legend: ChartLegend = { visible: true, textStyle: {}, location: 'top-right' };

    public static textStyleTitle: TextStyle = { fontSize: '20px', textDecoration: 'bold' };
}

export interface TextStyle {
    fontName?: string;
    fontSize?: string;
    textDecoration?: string;
}

export class ChartSettings {
    // want to distinguish from global innerWidth and innerHeight vars.
    widthInner: number;
    heightInner: number;
    legend: ChartLegend;

    constructor(public options: ChartOptions) {
        let margin = options.margin;
        this.widthInner = options.width - margin.left - margin.right;
        this.heightInner = options.height - margin.top - margin.bottom;
        this.legend = _.defaults(options.legend || {}, DEFAULTS.legend);
    }

    public get selector() { return this.options.selector; }
    public get title() { return this.options.title; }
    public get margin() { return this.options.margin; }
    public get height() { return this.options.height; }
    public get width() { return this.options.width; }
    public get colors() { return this.options.colors; }


}

export class XYChartSettings extends ChartSettings {
    xAxis: XAxis;
    yAxis: YAxis;
    constructor(public options: XYChartOptions) {
        super(options);
        this.xAxis = <XAxis>_.defaults( options.xAxis || {}, DEFAULTS.xAxis);
        this.yAxis = <YAxis>_.defaults( options.yAxis || {}, DEFAULTS.yAxis);
    }

}
