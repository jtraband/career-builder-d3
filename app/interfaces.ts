export interface ChartOptions {
    width: number;
    height: number;
    selector?: string | HTMLElement;
    title?: ChartTitle;
    margin?: ChartMargin;
    colors?: any[];
}

export interface HBarChartOptions extends ChartOptions {
    xAxis?: XAxis;
    yAxis?: YAxis;
}

export interface VBarChartOptions extends ChartOptions {
    xAxis?: XAxis;
    yAxis?: YAxis;
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
    hidden?: boolean;
}

export interface XAxis extends ChartAxis {

}

export interface YAxis extends ChartAxis {

}

// can't seem to export a Module with only interfaces.
export class Foo {

}