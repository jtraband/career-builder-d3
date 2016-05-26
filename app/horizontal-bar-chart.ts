import { DataSet, DataRow, DataColumn  } from './data-set';
import { HBarChartOptions, ChartMargin, ChartTitle, XAxis } from './interfaces';

declare var d3: any;



export class HorizontalBarChart {

    draw(dataSet: DataSet, options: HBarChartOptions) {

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

        let dataRows = dataSet.dataRows;

        let max = d3.max(dataRows, (dr: DataRow) => {
            return dr.values[0];
        });

        let xScale = d3.scale.linear()
            .domain([0, max])
            .range([0, width]);

        let yScale = d3.scale.ordinal()
            .domain(dataRows.map((dr: DataRow) => dr.values[0]))
            .rangeRoundBands([0, height]);

        svg.selectAll('rect')
            .data(dataRows)
            .enter()
            .append('rect')
            .attr('x', (d: any) => {
                return 0;
            })
            .attr('y', (dr: DataRow, i: number) => {
                // return i * (height / dataset.length);
                return yScale(dr.values[0]) + 5;
            })
            .attr('width', (dr: DataRow) => {
                return xScale(dr.values[0]);
            })
            // .attr('height', height / dataset.length - barPadding)
            .attr('height', yScale.rangeBand() - 10)
            .attr('fill', (d: any) => 'lightgreen');

        // in band labels    
        svg.selectAll('text')
            .data(dataRows)
            .enter()
            .append('text')
            .text((dr: DataRow) => dr.label)
            .attr('x', (d: any) => {
                return 5; // margin from the left side of the current bar.
            })
            .attr('y', (dr: DataRow, i: number) => {
                // return i * (height / dataset.length) + barPadding + 11;
                return yScale(dr.values[0]) + (yScale.rangeBand() / 2) + 5;
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
            .orient('left');
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
