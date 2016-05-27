import { DataSet, DataRow, DataColumn  } from './data-set';
import { HBarChartOptions, ChartTitle, XAxis, YAxis  } from './interfaces';
import { D3Fns, ChartSettings } from './d3-fns';

declare var d3: any;

// handles groups as well
export class HorizontalBarChart  {

    draw(dataSet: DataSet, options: HBarChartOptions) {

        let dataRows = dataSet.dataRows;

        let settings = new ChartSettings(options);
        let widthInner = settings.widthInner;
        let heightInner = settings.heightInner;

        let svg = D3Fns.initializeSvg(settings);
        let maxValue = D3Fns.getMaxValue(dataRows);
        // let maxValue = d3.max(dataRows, (dr: any) => {
        //     return d3.max(dr.groups, (group: any) => group.value);
        // });

        let groupNames = dataSet.createGroups();


        let xScale = d3.scale.linear()
            .range([0, widthInner])
            .domain([0, maxValue]);

        let y0Scale = d3.scale.ordinal()
            .rangeRoundBands([0, heightInner], .2)
            .domain(dataRows.map((dr: DataRow) => dr.label));

        let y1Scale = d3.scale.ordinal()
            .domain(groupNames).rangeRoundBands([0, y0Scale.rangeBand()]);

        let xAxisOptions = <XAxis>_.extend({ ticks: 5 }, options.xAxis || {});
        if (!xAxisOptions.hidden) {
            let xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .ticks(xAxisOptions.ticks);
            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + heightInner + ')')
                .call(xAxis);
        }

        let yAxisOptions = <YAxis>_.extend({  }, options.yAxis || {});
        if (!yAxisOptions.hidden) {
        let yAxisScale: any;
            if (groupNames.length === 1) {
                // Use the values themselves as the labels on the yAxis
                yAxisScale = d3.scale.ordinal()
                    .domain(dataRows.map((dr: DataRow) => dr.values[0]))
                    .rangeRoundBands([0, heightInner]);
            } else {
                yAxisScale = y0Scale;
            }

            let yAxis = d3.svg.axis()
                    .scale(yAxisScale)
                    .orient('left');
            svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis)
            // .selectAll('.tick text')
            // .call(this.wrap, y0Scale.rangeBand());
        }

        let band = svg.selectAll('.band')
            .data(dataRows)
            .enter().append('g')
            .attr('class', 'band')
            .attr('transform', (dr: DataRow) => 'translate(0,' + y0Scale(dr.label) + ')');

        band.selectAll('rect')
            .data((dr: any) => dr.groups)
            .enter().append('rect')
            .attr('x', (group: any) => 0)
            .attr('y', (group: any) => y1Scale(group.name))
            .attr('width', (group: any) => xScale(group.value))
            .attr('height', y1Scale.rangeBand())
            .style('fill', (group: any) => settings.colorScale(group.name));

        if (groupNames.length === 1) {
            // in band labels - only if a single group
            band.selectAll('text')
                .data((dr: any) => [dr])
                .enter().append('text')
                .text((dr: any) => dr.label)
                .attr('x', (d: any) => {
                    return 5; // margin from the left side of the current bar.
                })
                .attr('y', (dr: any) => {
                    // 5 below is approx half of 11px font-size;
                     return (y0Scale.rangeBand() / 2) + 5;
                })
                .attr('font-size', '11px')
                .attr('fill', 'black')
                .attr('text-anchor', 'left')
                .attr('text-anchor', 'center');
        }

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
