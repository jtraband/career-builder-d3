import { DataSet, DataRow, DataColumn  } from './data-set';
import { VBarChartOptions, ChartTitle, YAxis } from './interfaces';

declare var d3: any;

// handles groups as well
export class VerticalBarChart {

    draw(dataSet: DataSet, options: VBarChartOptions) {

        let dataRows = dataSet.dataRows;

        let margin = options.margin;

        let width = options.width - margin.left - margin.right;
        let height = options.height - margin.top - margin.bottom;

        d3.select(options.selector).selectAll('*').remove();

        // define svg as a G element that translates the origin to the top-left corner of the chart area.
        let svg = d3.select(options.selector)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        let colorScale: any;
        if (options.colors) {
           colorScale = d3.scale.ordinal()
                .range(options.colors);
        } else {
            colorScale = d3.scale.category10();
        }

        let groupNames = dataSet.getGroupNames();

        dataRows.forEach((dr: DataRow) => {
            (<any>dr).groups = groupNames.map((name, ix) => { return { name: name, value: dr.values[ix] }; });
        });

        let maxValue = d3.max(dataRows, (dr: any) => {
            return d3.max(dr.groups, (group: any) => group.value);
        });

        let x0Scale = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1)
            .domain(dataRows.map((dr: DataRow) => dr.label));

        let x1Scale = d3.scale.ordinal()
            .domain(groupNames)
            .rangeRoundBands([0, x0Scale.rangeBand()]);

        let yScale = d3.scale.linear()
            .range([height, 0])
            .domain([0, maxValue]);

        let xAxis = d3.svg.axis()
            .scale(x0Scale)
            .orient('bottom');

        let yAxisOptions = <YAxis>_.extend({ ticks: 5 }, options.yAxis || {});
        let yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .ticks(yAxisOptions.ticks);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
            .selectAll('.tick text')
            .call(this.wrap, x0Scale.rangeBand());

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

        let band = svg.selectAll('.band')
            .data(dataRows)
            .enter().append('g')
            .attr('class', 'band')
            .attr('transform', (dr: DataRow) => 'translate(' + x0Scale(dr.label) + ',0)');

        band.selectAll('rect')
            .data((d: any) => d.groups)
            .enter().append('rect')
            .attr('width', x1Scale.rangeBand())
            .attr('x', (d: any) => x1Scale(d.name))
            .attr('y', (d: any) => yScale(d.value))
            .attr('height', (d: any) => height - yScale(d.value))
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
        textItems.each(function () {
            let text = d3.select(this);
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
