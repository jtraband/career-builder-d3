import { DataSet, DataRow, DataColumn  } from './data-set';
import { HBarChartOptions, BarChartSettings, ChartLegend, ChartSettings  } from './interfaces';
import { D3Fns  } from './d3-fns';

declare var d3: any;

// handles groups as well
export class HorizontalBarChart  {

    draw(dataSet: DataSet, options: HBarChartOptions) {

        let dataRows = dataSet.dataRows;

        let settings = new BarChartSettings(options);
        let widthInner = settings.widthInner;
        let heightInner = settings.heightInner;

        let svg = D3Fns.initializeSvg(settings);
        let maxValue = D3Fns.getMaxValue(dataRows);
        let colorScale = D3Fns.getColorScale(settings.colors);

        let groupNames = dataSet.createGroups();


        let xScale = d3.scale.linear()
            .range([0, widthInner])
            .domain([0, maxValue]);

        let y0Scale = d3.scale.ordinal()
            .rangeRoundBands([0, heightInner], .2)
            .domain(dataRows.map((dr: DataRow) => dr.label));

        let y1Scale = d3.scale.ordinal()
            .domain(groupNames).rangeRoundBands([0, y0Scale.rangeBand()]);

        let xAxisOptions = settings.xAxis;
        if (xAxisOptions.visible) {
            let xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .ticks(xAxisOptions.ticks);
            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + heightInner + ')')
                .call(xAxis);
        }

        let yAxisOptions = settings.yAxis;
        if (yAxisOptions.visible) {
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
            .style('fill', (group: any) => colorScale(group.name));

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
                // TODO: allow setting text style for in-band text
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
                // .attr('transform', (d: any, i: number) => 'translate(0,' + (heightInner - settings.margin.bottom - (i * 20)) + ')');
                .attr('transform', (d: any, i: number) => 'translate(0,' + this.getLocationOffset(settings, i) + ')');
            legend.append('rect')
                .attr('x', widthInner - 18)
                .attr('width', 18)
                .attr('height', 18)
                .style('fill', colorScale);
            let tmp = legend.append('text')
                .attr('x', widthInner - 24)
                .attr('y', 9)
                .attr('dy', '.35em')
                .style('text-anchor', 'end')
                .text((d: any) => d);
            if (settings.legend.textStyle.fontSize) {
                tmp.attr('font-size', settings.legend.textStyle.fontSize);
            }
        }


        D3Fns.drawTitle(svg, settings);

    }

    getLocationOffset(settings: ChartSettings, i: number) {
        let location = settings.legend.location;
        if (location === 'top-right') {
            return i * 20;
        } else if (location === 'bottom-right') {
            return settings.heightInner - settings.margin.bottom - (i * 20);
        } else {
            return i * 20;
        }
    }

}
