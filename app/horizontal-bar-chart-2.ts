import { DataSet, DataRow, DataColumn  } from './data-set';
import { HBarChartOptions, ChartTitle, XAxis, YAxis } from './interfaces';

declare var d3: any;

// handles groups as well
export class HorizontalBarChart2 {

    draw(dataSet: DataSet, options: HBarChartOptions) {

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

        let y0Scale = d3.scale.ordinal()
            .rangeRoundBands([height, 0], .1);

        let y1Scale = d3.scale.ordinal();

        let xScale = d3.scale.linear()
            .range([0, width]);

        let colorScale = d3.scale.ordinal()
            .range(['#98abc5', '#8a89a6', '#d0743c']);

        let groupNames = dataSet.getGroupNames();

        dataRows.forEach((dr: DataRow) => {
            (<any>dr).groups = groupNames.map((name, ix) => { return { name: name, value: dr.values[ix] }; });
        });

        y0Scale.domain(dataRows.map((dr: DataRow) => dr.label));
        y1Scale.domain(groupNames).rangeRoundBands([0, y0Scale.rangeBand()]);
        xScale.domain([0, d3.max(dataRows, (dr: any) => {
            return d3.max(dr.groups, (group: any) => group.value);
        })]);

        let yAxis = d3.svg.axis()
            .scale(y0Scale)
            .orient('left');

        let xAxisOptions = <XAxis>_.extend({ ticks: 5 }, options.xAxis || {});
        let xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(xAxisOptions.ticks);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            // .selectAll('.tick text')
            // .call(this.wrap, y0Scale.rangeBand());

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        let band = svg.selectAll('.band')
            .data(dataRows)
            .enter().append('g')
            .attr('class', 'band')
            .attr('transform', (dr: DataRow) => 'translate(0,' + y0Scale(dr.label) + ')');

        band.selectAll('rect')
            .data((d: any) => d.groups)
            .enter().append('rect')
            .attr('height', y1Scale.rangeBand())
            .attr('y', (d: any) => y1Scale(d.name))
            .attr('x', (d: any) => 0)
            .attr('width', (d: any) => xScale(d.value))
            .style('fill', (d: any) => colorScale(d.name));

        // don't bother with legends if only one group
        if (groupNames.length > 1) {
            let legend = svg.selectAll('.legend')
                .data(groupNames)
                .enter().append('g')
                .attr('class', 'legend')
                .attr('transform', (d: any, i: number) => 'translate(0,' + i * 20 + ')');
            legend.append('rect')
                .attr('x', width - 18)
                .attr('width', 18)
                .attr('height', 18)
                .style('fill', colorScale);
            legend.append('text')
                .attr('x', width - 24)
                .attr('y', 9)
                .attr('dy', '.35em')
                .style('text-anchor', 'end')
                .text((d: any) => d);
        }

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

    // from https://bl.ocks.org/mbostock/7555321 
    wrap(textItems: any, width: number) {
        textItems.each(function() {
            let  text = d3.select(this);
            let words = text.text().split(/\s+/).reverse();
            let word: string;
            let line: string[] = [];
            let lineNumber = 0;
            let lineHeight = 1.1; // ems
            let y = text.attr('y');
            let dy = parseFloat(text.attr('dy'));
            let tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em');
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(' '));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [word];
                    tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
                }
            }
        });
    }


}
