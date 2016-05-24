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
        this.barChart1();
        this.barChart2();
    }


    barChart1() {
        let margin = { top: 10, right: 10, bottom: 20, left: 30 };

        let width = 500 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        // define svg as a G element that translates the origin to the top-left corner of the chart area.
        let svg = d3.select('body').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        let dataset = [5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
            11, 12, 15, 20, 18, 17, 16, 18, 23, 25];
        let max = d3.max(dataset, (d: any) => {
            return d;
        });

        let barPadding = 1;

        let xScale = d3.scale.linear()
            .domain([0, max])
            .range([0, width]);

        let yScale = d3.scale.linear()
            .domain([0, dataset.length])
            .range([height, 0]);


        svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('x', (d: number) => {
                return 0;
            })
            .attr('y', (d: any, i: number) => {
                return i * (height / dataset.length);
            })
            .attr('width', (d: number) => {
                return xScale(d);
            })
            .attr('height', height / dataset.length - barPadding)
            .attr('fill', (d: number) => {
                return 'rgb(0, 0, ' + (d * 10) + ')';
            });

        svg.selectAll('text')
            .data(dataset)
            .enter()
            .append('text')
            .text((d: any) => d)
            .attr('x', (d: any, i: number) => {
                return i * (width / dataset.length) + (width / dataset.length - barPadding) / 2;
            })
            .attr('y', (d: number) => {
                return yScale(d) + 14; // 14 is space for number
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
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        let yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .ticks(5);
        svg.append('g')
            .attr('class', 'axis')
            .call(yAxis);


    }


    barChart2() {
        let margin = { top: 10, right: 10, bottom: 20, left: 30 };

        let width = 500 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        // define svg as a G element that translates the origin to the top-left corner of the chart area.
        let svg = d3.select('body').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // // Create SVG element
        // let svg = d3.select('body')
        //     .append('svg')
        //     .attr('width', w)
        //     .attr('height', h);

        let dataset = [5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
            11, 12, 15, 20, 18, 17, 16, 18, 23, 25];
        let barPadding = 1;

        let xScale = d3.scale.linear()
            .domain([0, 20])
            .range([0, width]);

        let maxY = d3.max(dataset, (d: any) => {
            return d;
        });
        let yScale = d3.scale.linear()
            .domain([0, maxY])
            .range([height, 0]);


        svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('x', (d: any, i: number) => {
                return i * (width / dataset.length);
            })
            .attr('y', (d: number) => {
                return yScale(d);  // Height minus data value
            })
            .attr('width', width / dataset.length - barPadding)
            .attr('height', (d: number) => {
                return height - yScale(d);
            })
            .attr('fill', (d: number) => {
                return 'rgb(0, 0, ' + (d * 10) + ')';
            });

        svg.selectAll('text')
            .data(dataset)
            .enter()
            .append('text')
            .text((d: any) => d)
            .attr('x', (d: any, i: number) => {
                return i * (width / dataset.length) + (width / dataset.length - barPadding) / 2;
            })
            .attr('y', (d: number) => {
                return yScale(d) + 14; // 14 is space for number
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
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        let yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .ticks(5);
        svg.append('g')
            .attr('class', 'axis')
            .call(yAxis);


    }
}
