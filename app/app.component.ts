// /// <reference path='../typings/browser.d.ts' />
// /// <reference path='../typings/browser/definitions/d3/index.d.ts'/>;

import { Component, ElementRef } from '@angular/core';

declare var d3: any;

// Ugh... can't get typings correct yet....
// import * as d3 from 'd3';
// import * as d3 from 'd3/d3';
// import * as d3 from 'd3/index';


@Component({
    selector: 'my-app',
    template: `
        <h1>D3 Test</h1>
        <div class="named-bar"></div>
        <div class="other-bars"></div>
        `
})
export class AppComponent {

    elementRef: ElementRef;

    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef;
    }


    ngAfterViewInit() {
        d3.select(this.elementRef.nativeElement).select('h1').style('background-color', 'lightblue');
        this.barChartNamedXBar();
        this.barChartGroupedYBar();
        this.barChartXBar();
        this.barChartYBar();
    }

    barChartGroupedYBar() {
        let margin = { top: 25, right: 10, bottom: 20, left: 30 };

        let width = 500 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        let x0 = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        let x1 = d3.scale.ordinal();

        let y = d3.scale.linear()
            .range([height, 0]);

        let color = d3.scale.ordinal()
            .range(['#98abc5', '#8a89a6', '#d0743c']);

        let xAxis = d3.svg.axis()
            .scale(x0)
            .orient('bottom');

        let yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .tickFormat(d3.format('.2s'));

        let svg = d3.select('.named-bar')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        let dataset = [
            { year: '2015', demand: 12000, supply: 9000 },
            { year: '2014', demand: 6000, supply: 5000 },
            { year: '2013', demand: 2000, supply: 1000 },
        ];

        let groupNames = ['demand', 'supply'];

        dataset.forEach(function (d) {
            (<any> d).groups = groupNames.map(function (name) { return { name: name, value: +d[name] }; });
        });

        x0.domain(dataset.map(function (d) { return d.year; }));
        x1.domain(groupNames).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(dataset, (d: any) => {
            return d3.max(d.groups, (d2: any) => d2.value);
        })]);

        svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

        let year = svg.selectAll('.year')
            .data(dataset)
            .enter().append('g')
            .attr('class', 'year')
            .attr('transform', (d: any) => 'translate(' + x0(d.year) + ',0)');

        year.selectAll('rect')
            .data((d: any) => d.groups)
            .enter().append('rect')
            .attr('width', x1.rangeBand())
            .attr('x', (d: any) => x1(d.name))
            .attr('y', (d: any) => y(d.value))
            .attr('height', (d: any) => height - y(d.value))
            .style('fill', (d: any) => color(d.name));

        let legend = svg.selectAll('.legend')
            .data(groupNames)
            .enter().append('g')
            .attr('class', 'legend')
            .attr('transform', (d: any, i: number) => 'translate(0,' + i * 20 + ')');
        legend.append('rect')
            .attr('x', width - 18)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', color);

        legend.append('text')
            .attr('x', width - 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text((d: any) => d);

         svg.append('text')
            .attr('x', margin.left)
            .attr('y', 0 - (margin.top / 2))
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .style('text-decoration', 'bold')
            .text('Company');

    }

    barChartNamedXBar() {
        let margin = { top: 25, right: 10, bottom: 20, left: 30 };

        let width = 500 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        // define svg as a G element that translates the origin to the top-left corner of the chart area.
        let svg = d3.select('.named-bar')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        let dataset = [
            { key: 'Veteran', value: 574 },
            { key: 'No Obligation', value: 113 },
            { key: 'Active Duty', value: 79 },
            { key: 'Retired Military', value: 78 },
            { key: 'Reserve-Drilling', value: 56 },
            { key: 'Inactive Reserve', value: 45 },
            { key: 'Unfilled', value: 10 },
            { key: 'Filled', value: 4 }
        ];
        let max = d3.max(dataset, (d: any) => {
            return d.value;
        });

        let xScale = d3.scale.linear()
            .domain([0, max])
            .range([0, width]);

        let yScale = d3.scale.ordinal()
            .domain(dataset.map((d: any) => d.value))
            .rangeRoundBands([0, height]);


        svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('x', (d: number) => {
                return 0;
            })
            .attr('y', (d: any, i: number) => {
                // return i * (height / dataset.length);
                return yScale(d.value) + 5;
            })
            .attr('width', (d: any) => {
                return xScale(d.value);
            })
            // .attr('height', height / dataset.length - barPadding)
            .attr('height', yScale.rangeBand() - 10)
            .attr('fill', (d: any) => 'lightgreen');


        svg.selectAll('text')
            .data(dataset)
            .enter()
            .append('text')
            .text((d: any) => d.key)
            .attr('x', (d: any) => {
                return 5; // margin from the left side of the current bar.
            })
            .attr('y', (d: any, i: number) => {
                // return i * (height / dataset.length) + barPadding + 11;
                return yScale(d.value) + (yScale.rangeBand() / 2) + 5;
            })
            .attr('font-size', '11px')
            .attr('fill', 'black')
            .attr('text-anchor', 'left')
            .attr('text-anchor', 'center');

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

        svg.append('text')
            .attr('x', 5)
            .attr('y', 0 - (margin.top / 2))
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .style('text-decoration', 'bold')
            .text('Military');

    }


    barChartXBar() {
        let margin = { top: 10, right: 10, bottom: 20, left: 30 };

        let width = 500 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        let barPadding = 2;

        // define svg as a G element that translates the origin to the top-left corner of the chart area.
        let svg = d3.select('.other-bars')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        let dataset = [5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
            11, 12, 15, 20, 18, 17, 16, 18, 23, 25];
        let max = d3.max(dataset, (d: any) => {
            return d;
        });

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
            .attr('y', (d: any, i: number) => {
                return i * (height / dataset.length) + barPadding + 11;
            })
            .attr('x', (d: number) => {
                return 10;
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


    barChartYBar() {
        let margin = { top: 10, right: 10, bottom: 20, left: 30 };

        let width = 500 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        // define svg as a G element that translates the origin to the top-left corner of the chart area.
        let svg = d3.select('.other-bars')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

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
