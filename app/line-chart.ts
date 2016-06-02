import { DataSet, DataRow, DataColumn  } from './data-set';
import { LineChartOptions, XYChartSettings } from './interfaces';
import { D3Fns  } from './d3-fns';

declare var d3: any;


export class LineChart {

    draw(dataSet: DataSet, options: LineChartOptions) {

        let dataRows = dataSet.dataRows;

        let settings = new XYChartSettings(options);
        let widthInner = settings.widthInner;
        let heightInner = settings.heightInner;

        let svg = D3Fns.initializeSvg(settings);
        let maxValue = D3Fns.getMaxValue(dataRows);
        let colorScale = D3Fns.getColorScale(settings.colors);
        let groupNames = dataSet.createGroups();

        let xScale = d3.scale.ordinal()
            .domain(dataRows.map((dr: DataRow) => dr.label))
            .rangePoints([0, widthInner]);

        let yScale = d3.scale.linear()
            .domain([0, maxValue])
            .range([heightInner, 0]);

        let xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');

        let xAxisOptions = settings.xAxis;
        if (xAxisOptions.visible) {
            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + heightInner + ')')
                .call(xAxis)
                .selectAll('.tick text');
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
            return {
                name: dc.name,
                values: dataRows.map(dr => {
                    return {
                        name: dr.label,
                        value: dr.values[ix]
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


        D3Fns.drawLegend(svg, settings, groupNames);

        D3Fns.drawTitle(svg, settings);
    }




}
