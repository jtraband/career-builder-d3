import { DataSet, DataRow, DataColumn  } from './data-set';
import { LineChartOptions, BarChartSettings } from './interfaces';
import { D3Fns  } from './d3-fns';

declare var d3: any;


export class LineChart {

    draw(dataSet: DataSet, options: LineChartOptions) {

        let dataRows = dataSet.dataRows;

        let settings = new BarChartSettings(options);
        let widthInner = settings.widthInner;
        let heightInner = settings.heightInner;

        let svg = D3Fns.initializeSvg(settings);
        let maxValue = D3Fns.getMaxValue(dataRows);
        let colorScale = D3Fns.getColorScale(settings.colors);
        let groupNames = dataSet.createGroups();

        let xScale = d3.scale.ordinal()
            .rangePoints([0, widthInner])
            .domain(dataRows.map((dr: DataRow) => dr.label));
             // x.domain(d3.extent(data, function(d) { return d.date; }));


        let yScale = d3.scale.linear()
            .range([heightInner, 0])
            .domain([0, maxValue]);

        let xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');

        let xAxisOptions = settings.xAxis;
        if (xAxisOptions.visible) {
            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + heightInner + ')')
                .call(xAxis)
                .selectAll('.tick text')
                .call(D3Fns.wrap, xScale.rangeBand());
        }

        let yAxisOptions = settings.yAxis;
        if (yAxisOptions.visible) {
            let yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .ticks(yAxisOptions.ticks);
            svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis);
        }

        let lineDefs = dataSet.dataColumns.slice(1).map((dc, ix) => {
            let colIx = ix;
            return {
                name: dc.name,
                values: dataRows.map(dr => {
                    return {
                        name: dr.label,
                        value: dr.values[colIx]
                    };
                })
            };
        });


        let line = d3.svg.line()
            .interpolate('linear')
            .x(function(d: any) { return xScale(d.name); })
            .y(function(d: any) { return yScale(d.value); });

        let lineDef = svg.selectAll('.line-def')
            .data(lineDefs)
            .enter().append('g')
            .attr('class', 'line-def');

        lineDef.append('path')
            .attr('class', 'line')
            .attr('d', (d: any) =>  { return line(d.values); })
            .style('stroke', (d: any) => { return colorScale(d.name); })
            .attr('fill', 'none');


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
                .style('fill', colorScale);
            legend.append('text')
                .attr('x', widthInner - 24)
                .attr('y', 9)
                .attr('dy', '.35em')
                .style('text-anchor', 'end')
                .text((d: any) => d);
        }

        D3Fns.drawTitle(svg, settings);
    }




}
