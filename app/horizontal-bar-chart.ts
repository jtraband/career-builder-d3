import { DataSet, DataRow  } from './data-set';
import { HBarChartOptions, HBarChartSettings   } from './interfaces';
import { D3Fns  } from './d3-fns';

declare var d3: any;

// handles groups as well
export class HorizontalBarChart {

    draw(dataSet: DataSet, options: HBarChartOptions) {

        let dataRows = dataSet.dataRows;

        let settings = new HBarChartSettings(options);
        let widthInner = settings.widthInner;
        let heightInner = settings.heightInner;

        let svg = D3Fns.initializeSvg(settings);
        let barToolTip = (settings.barToolTip)
            ? d3.tip().attr('class', 'd3-tip').html(settings.barToolTip)
            : null;

        if (barToolTip) {
            Array.prototype.forEach.call(document.querySelectorAll('.d3-tip'), (t: any) => t.parentNode.removeChild(t));
            svg.call(barToolTip);
        }

        let maxValue = D3Fns.getMaxValue(dataRows);
        let colorScale = D3Fns.getColorScale(settings.colors);

        let groupNames = dataSet.createGroups();

        let xScale = d3.scale.linear()
            .domain([0, maxValue])
            .range([0, widthInner]);

        let y0Scale = d3.scale.ordinal()
            .domain(dataRows.map((dr: DataRow) => dr.label))
            .rangeRoundBands([0, heightInner], .2);

        let y1Scale = d3.scale.ordinal()
            .domain(groupNames)
            .rangeRoundBands([0, y0Scale.rangeBand()]);

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
                .call(yAxis);
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

        if ( settings.barEvents ) {
            let rects = band.selectAll('rect');
            _.forIn(settings.barEvents, (action: any, eventName: string) => {
                rects.on(eventName, action);
            });
        }
        if (barToolTip) {
           let rects = band.selectAll('rect');
            rects
                .on('mouseover', barToolTip.show)
                .on('mouseleave', barToolTip.hide);
        }


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
                // .attr('font-size', '11px')
                // .attr('fill', 'black')
                .attr('font-size', settings.inBar.textStyle.fontSize)
                .attr('fill', settings.inBar.color)
                .attr('text-anchor', 'left')
                .attr('text-anchor', 'center');
        }

        D3Fns.drawLegend(svg, settings, groupNames);

        D3Fns.drawTitle(svg, settings);

    }

}
