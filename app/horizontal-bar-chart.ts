import { DataSet  } from './data-set';
import { ChartMargin, ChartTitle, XAxis } from './interfaces';

declare var d3: any;

export interface HBarChartOptions {
    width: number;
    height: number;
    selector?: string | HTMLElement;
    title?: ChartTitle;
    xAxis?: XAxis;
    margin?: ChartMargin;
    // labelsLocation?: string; // in-bar; in-margin 
}

export class HorizontalBarChart {

    draw(data: DataSet, options: HBarChartOptions) {

        let margin = options.margin;

        let width = options.width - margin.left - margin.right;
        let height = options.height - margin.top - margin.bottom;

        // define svg as a G element that translates the origin to the top-left corner of the chart area.
        let svg = d3.select(options.selector)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        let dataItems = data.transformToDataItems();
        let max = d3.max(dataItems, (d: any) => {
            return d.value;
        });

        let xScale = d3.scale.linear()
            .domain([0, max])
            .range([0, width]);

        let yScale = d3.scale.ordinal()
            .domain(dataItems.map((d: any) => d.value))
            .rangeRoundBands([0, height]);

        svg.selectAll('rect')
            .data(dataItems)
            .enter()
            .append('rect')
            .attr('x', (d: number) => {
                return 0;
            })
            .attr('y', (d: any, i: number) => {
                // return i * (height / dataset.length);
                return yScale(d.value) + 5;
            })
            .attr('width', (d: any) => {
                return xScale(d.value);
            })
            // .attr('height', height / dataset.length - barPadding)
            .attr('height', yScale.rangeBand() - 10)
            .attr('fill', (d: any) => 'lightgreen');

        // in band labels    
        svg.selectAll('text')
            .data(dataItems)
            .enter()
            .append('text')
            .text((d: any) => d.label)
            .attr('x', (d: any) => {
                return 5; // margin from the left side of the current bar.
            })
            .attr('y', (d: any, i: number) => {
                // return i * (height / dataset.length) + barPadding + 11;
                return yScale(d.value) + (yScale.rangeBand() / 2) + 5;
            })
            .attr('font-size', '11px')
            .attr('fill', 'black')
            .attr('text-anchor', 'left')
            .attr('text-anchor', 'center');

        let xAxisOptions: XAxis = _.extend({ ticks: 5 }, options.xAxis || {});
        let xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(xAxisOptions.ticks);
        svg.append('g')
            .attr('class', 'axis')  // for css
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        let yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            // .ticks(5);
        svg.append('g')
            .attr('class', 'axis')
            .call(yAxis);

        if (options.title) {
            let titleOptions  = <ChartTitle> _.extend({ fontSize: '20px', textDecoration: 'bold' }, options.title || {});
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', 0 - (margin.top / 2))
                .attr('text-anchor', 'middle')
                .style('font-size', titleOptions.fontSize)
                .style('text-decoration', titleOptions.textDecoration)
                .text(titleOptions.text);
        }
    }
}
