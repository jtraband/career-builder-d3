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
        let xPadding = 30;
        let yPadding = 20;

        let xScale = d3.scale.linear()
            .domain([0, 20])
            .range([xPadding, w - xPadding]);

        let maxY = d3.max(dataset, function (d) {
            return d;
        });
        let yScale = d3.scale.linear()
            .domain([0, maxY])
            .range([yPadding, h - yPadding]);


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
                return i * ( w  / dataset.length);
            })
            .attr('y', function (d) {
                return h - (yScale(d) + yPadding);  //Height minus data value
            })
            // .attr('width', w / dataset.length - barPadding)
            .attr('width', (w - xPadding) / dataset.length - barPadding)
            .attr('height', function (d) {
                return yScale(d) - yPadding;
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
                return h - yScale(d) + 14; // 14 is space for number
            })
            .attr('font-family', 'sans-serif')
            .attr('font-size', '11px')
            .attr('fill', 'white')
            .attr('text-anchor', 'middle');


        let xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(5);
        svg.append('g')
            .attr('class', 'axis')  // for css
            .attr('transform', 'translate(0,' + (h - xPadding) + ')')
            // .attr('transform', 'translate(0,' + h + ')')
            .call(xAxis);

        let yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .ticks(5);
        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + yPadding + ',0)')
            .call(yAxis);


    }
}
