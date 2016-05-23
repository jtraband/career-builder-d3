// /// <reference path='../typings/browser.d.ts' />
// /// <reference path='../typings/browser/definitions/d3/index.d.ts'/>;

import { Component, ElementRef } from '@angular/core';

declare var d3: any;
// import * as d3 from 'd3';
// import * as d3 from 'd3/d3';
// import * as d3 from 'd3/index';


@Component({
    selector: 'my-app',
    template: `
        <h1>D3 Test</h1>
        <svg class='chart' ></svg>
        `
})
export class AppComponent {

    elementRef: ElementRef;

    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef;
    }


    ngAfterViewInit() {
        d3.select(this.elementRef.nativeElement).select('h1').style('background-color', 'yellow');
        this.drawChart();
    }

    drawChart() {
        // Width and height
        let w = 500;
        let h = 100;

        let dataset = [5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
            11, 12, 15, 20, 18, 17, 16, 18, 23, 25];
        let barPadding = 1;

        // Create SVG element
        let svg = d3.select('body')
            .append('svg')
            .attr('width', w)
            .attr('height', h);

        svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('x', function (d, i) {
                return i * (w / dataset.length);
            })
            .attr('y', function (d) {
                return h - d * 4;  //Height minus data value
            })
            .attr('width', w / dataset.length - barPadding)
            .attr('height', function (d) {
                return d * 4;
            })
            .attr('fill', function (d) {
                return 'rgb(0, 0, ' + (d * 10) + ')';
            });

        svg.selectAll('text')
            .data(dataset)
            .enter()
            .append('text')
            .text(function (d) {
                return d;
            })
            .attr('x', function (d, i) {
                return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
            })
            .attr('y', function (d) {
                return h - (d * 4) + 14; // 14 is space for number
            })
            .attr('font-family', 'sans-serif')
            .attr('font-size', '11px')
            .attr('fill', 'white')
            .attr('text-anchor', 'middle');

    }

    drawChart2() {
        var scale = {
            y: d3.scale.linear()
        };

        var totalWidth = 500;
        var totalHeight = 200;

        scale.y.domain([0, 100]);
        scale.y.range([totalHeight, 0]);

        var ages = [30, 22, 33, 45];
        var barWidth = 20;

        var chart = d3.select('.chart')
            .attr({
                'width': totalWidth,
                'height': totalHeight
            });

        var bars = chart
            .selectAll('g')
            .data(ages)
            .enter()
            .append('g');

        bars.append('rect')
            .attr({
                'x': function (d, i) {
                    return i * barWidth;
                },
                'y': scale.y,
                'height': function (d) {
                    return totalHeight - scale.y(d);
                },
                'width': barWidth - 1
            });
    }
}
