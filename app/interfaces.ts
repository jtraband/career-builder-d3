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
}

export interface VBarChartOptions extends ChartOptions {
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

export interface ChartLegend {
    location: string;
}

export interface XAxis {
    ticks?: number;
}

export interface YAxis {
    ticks: number;
}

// can't seem to export a Module with only interfaces.
export class Foo {

}