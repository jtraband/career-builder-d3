import { DataSet, DataRow, DataColumn  } from './data-set';
import { VBarChartOptions, ChartTitle } from './interfaces';

declare var d3: any;


export class VerticalGroupedBarChart {

    draw(dataSet: DataSet, options: VBarChartOptions) {

        let dataRows = dataSet.dataRows;

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


        let x0 = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        let x1 = d3.scale.ordinal();

        let y = d3.scale.linear()
            .range([height, 0]);

        let color = d3.scale.ordinal()
            .range(['#98abc5', '#8a89a6', '#d0743c']);

        let xAxis = d3.svg.axis()
            .scale(x0)
            .orient('bottom');

        let groupNames = dataSet.getGroupNames();

        dataRows.forEach((dr: DataRow) => {
            (<any>dr).groups = groupNames.map((name, ix) => { return { name: name, value: dr.values[ix] }; });
        });

        x0.domain(dataRows.map((dr: DataRow) => dr.label));
        x1.domain(groupNames).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(dataRows, (dr: any) => {
            return d3.max(dr.groups, (group: any) => group.value);
        })]);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        let band = svg.selectAll('.band')
            .data(dataRows)
            .enter().append('g')
            .attr('class', 'band')
            .attr('transform', (dr: DataRow) => 'translate(' + x0(dr.label) + ',0)');

        band.selectAll('rect')
            .data((d: any) => d.groups)
            .enter().append('rect')
            .attr('width', x1.rangeBand())
            .attr('x', (d: any) => x1(d.name))
            .attr('y', (d: any) => y(d.value))
            .attr('height', (d: any) => height - y(d.value))
            .style('fill', (d: any) => color(d.name));

        let legend = svg.selectAll('.legend')
            .data(groupNames)
            .enter().append('g')
            .attr('class', 'legend')
            .attr('transform', (d: any, i: number) => 'translate(0,' + i * 20 + ')');
        legend.append('rect')
            .attr('x', width - 18)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', color);

        legend.append('text')
            .attr('x', width - 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text((d: any) => d);

        if (options.title) {
            let titleOptions = <ChartTitle>_.extend({ fontSize: '20px', textDecoration: 'bold' }, options.title || {});
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
