export interface ChartOptions {
    width: number;
    height: number;
    selector?: string | HTMLElement;
    title?: ChartTitle;
    margin?: ChartMargin;
    colors?: any[];
    // calculated
}


export interface BarChartOptions extends ChartOptions {
    xAxis?: XAxis;
    yAxis?: YAxis;
}

export interface HBarChartOptions extends BarChartOptions {

}

export interface VBarChartOptions extends BarChartOptions {

}

export interface ChartMargin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface ChartTitle {
    text: string;
    fontSize?: string;
    textDecoration?: string;
}

// not yet implemented
export interface ChartLegend {
    location: string;
}

export interface ChartAxis {
    ticks?: number;
    visible?: boolean;
}


export interface XAxis extends ChartAxis {

}

export interface YAxis extends ChartAxis {

}

export class DEFAULTS {
    private static AXIS: ChartAxis = {
        ticks: 5,
        visible: true
    };

    public static XAXIS: XAxis = DEFAULTS.AXIS;

    public static YAXIS: XAxis = DEFAULTS.AXIS;
}

export class ChartSettings {
    // want to distinguish from global innerWidth and innerHeight vars.
    widthInner: number;
    heightInner: number;


    constructor(public options: ChartOptions) {
        let margin = options.margin;
        this.widthInner = options.width - margin.left - margin.right;
        this.heightInner = options.height - margin.top - margin.bottom;
    }

    public get selector() { return this.options.selector; }
    public get title() { return this.options.title; }
    public get margin() { return this.options.margin; }
    public get height() { return this.options.height; }
    public get width() { return this.options.width; }
    public get colors() { return this.options.colors; }

}

export class BarChartSettings extends ChartSettings {
    constructor(public options: BarChartOptions) {
        super(options);
        options.xAxis = <XAxis>_.defaults( options.xAxis || {}, DEFAULTS.XAXIS);
        options.yAxis = <YAxis>_.defaults( options.yAxis || {}, DEFAULTS.YAXIS);
    }

    public get xAxis() { return this.options.xAxis; }
    public get yAxis() { return this.options.yAxis; }
}


// can't seem to export a Module with only interfaces.
export class Foo {

}
