import { ChartTitle, ChartSettings } from './interfaces';
import { DataSet, DataRow } from './data-set';

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

    static drawTitle(svg: any, settings: ChartSettings ) {
           if (!settings.title) {
               return;
           }
           let titleOptions = <ChartTitle>_.extend({ fontSize: '20px', textDecoration: 'bold' }, settings.title || {});
            svg.append('text')
                .attr('x', settings.widthInner / 2)
                .attr('y', 0 - (settings.margin.top / 2))
                .attr('text-anchor', 'middle')
                .style('font-size', titleOptions.fontSize)
                .style('text-decoration', titleOptions.textDecoration)
                .text(titleOptions.text);
    }

    static getMaxValue(dataRows: DataRow[]) {
        return d3.max(dataRows, (dr: DataRow) => {
            return d3.max(dr.values, (v: any) => v);
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