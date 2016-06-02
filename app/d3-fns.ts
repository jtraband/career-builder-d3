import { ChartSettings, TextStyle, DEFAULTS } from './interfaces';
import { DataRow } from './data-set';

declare var d3: any;



export class D3Fns {

    static initializeSvg(settings: ChartSettings) {
        d3.select(settings.selector).selectAll('*').remove();

        // define svg as a G element that translates the origin to the top-left corner of the chart area.
        let svg = d3.select(settings.selector)
            .append('svg')
            .attr('width', settings.width)
            .attr('height', settings.height)
            .append('g')
            .attr('transform', 'translate(' + settings.margin.left + ',' + settings.margin.top + ')');
        return svg;
    }

    static getColorScale(colors: any[]) {
        if (colors) {
            return d3.scale.ordinal()
                .range(colors);
        } else {
            return d3.scale.category10();
        }
    }

    static drawTitle(svg: any, settings: ChartSettings) {
        if (!settings.title) {
            return;
        }
        let textStyle = <TextStyle>_.defaults(settings.title.textStyle || {}, DEFAULTS.textStyleTitle);
        svg.append('text')
            .attr('x', settings.widthInner / 2)
            .attr('y', 0 - (settings.margin.top / 2))
            .attr('text-anchor', 'middle')
            .style('font-size', textStyle.fontSize)
            .style('text-decoration', textStyle.textDecoration)
            .text(settings.title.text);
    }

    static drawLegend(svg: any, settings: ChartSettings, groupNames: string[]) {
        // don't bother with legends if only one group
        if (groupNames.length <= 1) {
            return;
        }
        let colorScale = D3Fns.getColorScale(settings.colors);

        let legend = svg.selectAll('.legend')
            .data(groupNames)
            .enter().append('g')
            .attr('class', 'legend')
            .attr('transform', D3Fns.legendTransform(settings, groupNames));
        legend.append('rect')
            .attr('width', settings.legendRectSize)
            .attr('height', settings.legendRectSize)
            .style('fill', colorScale);
        let tmp = legend.append('text')
            // -6 is separator between legend color and legend name.
            .attr('x', -6)
            .attr('y', settings.legendRectSize / 2)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text((d: any) => d);
        if (settings.legend.textStyle.fontSize) {
            tmp.attr('font-size', settings.legend.textStyle.fontSize);
        }

    }

    static legendTransform(settings: ChartSettings, groupNames: string[]) {
        return (d: any, i: number) => {
            let x: number;
            let y: number;
            let location = settings.legend.location;
            if (location === 'top-right') {
                x = settings.widthInner - settings.legendRectSize;
                y = i * 20;
            } else if (location === 'bottom-right') {
                x = settings.widthInner - settings.legendRectSize;
                y = settings.heightInner - settings.margin.top - ((groupNames.length - (i + 1)) * 20);
            } else if (location === 'above') {
                x = settings.margin.left + (settings.widthInner / groupNames.length) * i;
                y = 0 - settings.margin.top / 2;
            } else if (location === 'below') {
                x = settings.margin.left + (settings.widthInner / groupNames.length) * i;
                y = settings.heightInner + settings.margin.top;
            }
            return `translate(${x}, ${y})`;
        };

    }


    static getMaxValue(dataRows: DataRow[]) {
        return d3.max(dataRows, (dr: DataRow) => {
            return d3.max(dr.values, (v: any) => v);
        });
    }

    static getMinValue(dataRows: DataRow[]) {
        return d3.min(dataRows, (dr: DataRow) => {
            return d3.min(dr.values, (v: any) => v);
        });
    }

    // from https://bl.ocks.org/mbostock/7555321 
    static wrap(textItems: any, width: number) {
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