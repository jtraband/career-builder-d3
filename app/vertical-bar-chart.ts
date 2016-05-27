import { DataSet, DataRow, DataColumn  } from './data-set';
import { VBarChartOptions, ChartTitle, XAxis, YAxis } from './interfaces';
import { D3Fns, ChartSettings } from './d3-fns';

declare var d3: any;

// handles groups as well
export class VerticalBarChart {

    draw(dataSet: DataSet, options: VBarChartOptions) {

        let dataRows = dataSet.dataRows;

        let settings = new ChartSettings(options);
        let widthInner = settings.widthInner;
        let heightInner = settings.heightInner;

        let svg = D3Fns.initializeSvg(settings);
        let maxValue = D3Fns.getMaxValue(dataRows);
        let groupNames = dataSet.createGroups();

        let x0Scale = d3.scale.ordinal()
            .rangeRoundBands([0, widthInner], .1)
            .domain(dataRows.map((dr: DataRow) => dr.label));

        let x1Scale = d3.scale.ordinal()
            .domain(groupNames)
            .rangeRoundBands([0, x0Scale.rangeBand()]);

        let yScale = d3.scale.linear()
            .range([heightInner, 0])
            .domain([0, maxValue]);

        let xAxis = d3.svg.axis()
            .scale(x0Scale)
            .orient('bottom');

        let xAxisOptions = <XAxis>_.extend({}, options.xAxis || {});
        if (!xAxisOptions.hidden) {
            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + heightInner + ')')
                .call(xAxis)
                .selectAll('.tick text')
                .call(this.wrap, x0Scale.rangeBand());
        }

        let yAxisOptions = <YAxis>_.extend({ ticks: 5 }, options.yAxis || {});
        if (!yAxisOptions.hidden) {
            let yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .ticks(yAxisOptions.ticks);
            svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis);
        }

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
            .attr('height', (d: any) => heightInner - yScale(d.value))
            .style('fill', (d: any) => settings.colorScale(d.name));

        // don't bother with legends if only one group
        if (groupNames.length > 1) {
            let legend = svg.selectAll('.legend')
                .data(groupNames)
                .enter().append('g')
                .attr('class', 'legend')
                .attr('transform', (d: any, i: number) => 'translate(0,' + i * 20 + ')');
            legend.append('rect')
                .attr('x', widthInner - 18)
                .attr('width', 18)
                .attr('height', 18)
                .style('fill', settings.colorScale);
            legend.append('text')
                .attr('x', widthInner - 24)
                .attr('y', 9)
                .attr('dy', '.35em')
                .style('text-anchor', 'end')
                .text((d: any) => d);
        }

        D3Fns.drawTitle(svg, settings);
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
