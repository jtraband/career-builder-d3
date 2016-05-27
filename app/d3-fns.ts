import { ChartTitle, ChartOptions } from './interfaces';
import { DataSet, DataRow } from './data-set';

declare var d3: any;

export class ChartSettings implements ChartOptions {
    // want to distinguish from global innerWidth and innerHeight vars.
    widthInner: number;
    heightInner: number;
    colorScale: any;
    constructor(public options: ChartOptions) {
        let margin = options.margin;
        this.widthInner = options.width - margin.left - margin.right;
        this.heightInner = options.height - margin.top - margin.bottom;

        if (options.colors) {
           this.colorScale = d3.scale.ordinal()
                .range(options.colors);
        } else {
            this.colorScale = d3.scale.category10();
        }
    }

    public get selector() { return this.options.selector; }
    public get title() { return this.options.title; }
    public get margin() { return this.options.margin; }
    public get height() { return this.options.height; }
    public get width() { return this.options.width; }
    public get colors() { return this.options.colors; }
}

export class D3Fns {

    static initializeSvg(settings: ChartSettings) {
        d3.select(settings.selector).selectAll('*').remove();

        // define svg as a G element that translates the origin to the top-left corner of the chart area.
        let svg = d3.select(settings.selector)
            .append('svg')
            .attr('width', settings.width)
            .attr('height', settings.height)
            .append('g')
            .attr('transform', 'translate(' + settings.margin.left + ',' + settings.margin.top + ')');
        return svg;
    }

    static drawTitle(svg: any, settings: ChartSettings ) {
           if (!settings.title) {
               return;
           }
           let titleOptions = <ChartTitle>_.extend({ fontSize: '20px', textDecoration: 'bold' }, settings.title || {});
            svg.append('text')
                .attr('x', settings.widthInner / 2)
                .attr('y', 0 - (settings.margin.top / 2))
                .attr('text-anchor', 'middle')
                .style('font-size', titleOptions.fontSize)
                .style('text-decoration', titleOptions.textDecoration)
                .text(titleOptions.text);
    }

    static getMaxValue(dataRows: DataRow[]) {
        return d3.max(dataRows, (dr: DataRow) => {
            return d3.max(dr.values, (v: any) => v);
        });

    }
}