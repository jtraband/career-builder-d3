import { DataSet, DataRow  } from './data-set';
import { VBarChartOptions, XYChartSettings } from './interfaces';
import { D3Fns  } from './d3-fns';

declare var d3: any;

// handles groups as well
export class VerticalBarChart {

    draw(dataSet: DataSet, options: VBarChartOptions) {

        let dataRows = dataSet.dataRows;

        let settings = new XYChartSettings(options);
        let widthInner = settings.widthInner;
        let heightInner = settings.heightInner;

        let svg = D3Fns.initializeSvg(settings);
        let maxValue = D3Fns.getMaxValue(dataRows);
        let colorScale = D3Fns.getColorScale(settings.colors);
        let groupNames = dataSet.createGroups();

        let x0Scale = d3.scale.ordinal()
            .domain(dataRows.map((dr: DataRow) => dr.label))
            // TODO: make the '.1' part of options
            .rangeRoundBands([0, widthInner], .1);

        let x1Scale = d3.scale.ordinal()
            .domain(groupNames)
            .rangeRoundBands([0, x0Scale.rangeBand()]);

        let yScale = d3.scale.linear()
            .domain([0, maxValue])
            .range([heightInner, 0]);

        let xAxis = d3.svg.axis()
            .scale(x0Scale)
            .orient('bottom');

        let xAxisOptions = settings.xAxis;
        if (xAxisOptions.visible) {
            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + heightInner + ')')
                .call(xAxis)
                .selectAll('.tick text')
                .call(D3Fns.wrap, x0Scale.rangeBand());
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
            .style('fill', (d: any) => colorScale(d.name));

        D3Fns.drawLegend(svg, settings, groupNames);

        D3Fns.drawTitle(svg, settings);
    }




}
