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

export class Foo {

}