// /// <reference path='../typings/browser.d.ts' />
// /// <reference path='../typings/browser/definitions/d3/index.d.ts'/>;

import { Component, ElementRef } from '@angular/core';
import { DataSet } from './data-set';
import { HorizontalBarChart, HBarChartOptions } from './horizontal-bar-chart';
import { HorizontalBarChartComponent } from './horizontal-bar-chart.component';

declare var d3: any;

@Component({
    selector: 'my-app',
    template: `
        <h1>D3 Test</h1>
        <horizontal-bar-chart *ngIf="militaryInfo" [data]="militaryInfo.data" [options]="militaryInfo.options" style="display: inline-block"></horizontal-bar-chart>
        <div>---------</div>
        <div class="named-bar"></div>
        <div class="other-bars"></div>
     `,
     directives: [HorizontalBarChartComponent]

})
export class AppComponent {

    elementRef: ElementRef;
    militaryInfo: { data: DataSet, options: HBarChartOptions };

    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef;
    }


    ngAfterViewInit() {
        d3.select(this.elementRef.nativeElement).select('h1').style('background-color', 'lightblue');
        setTimeout( () => {
            this.initMilitaryData();
            // this.hBarChart();
            // this.barChartNamedXBar();
            this.barChartGroupedYBar();
            // this.barChartXBar();
            // this.barChartYBar();
        }, 0);
    }

    initMilitaryData() {
        let dataSet = new DataSet();
        // dataSet.addColumn( { name: 'label', type: 'string', } );
        // dataSet.addColumn( { name: 'value', type: 'number' } );
        dataSet.addColumns(['label', 'value']);
        dataSet.addRows([
            [ 'Veteran', 574 ],
            [ 'No Obligation',  113 ],
            [ 'Active Duty',  79 ],
            [ 'Retired Military', 78 ],
            [ 'Reserve-Drilling', 56 ],
            [ 'Inactive Reserve', 45 ],
            [ 'Unfilled', 10 ] ,
            [ 'Filled', 4 ]
        ]);
        let options: HBarChartOptions = {
            width: 500,
            height: 300,
            // selector: '.named-bar',
            title: { text: 'Military Data', fontSize: '18px' },
            margin: { top: 25, right: 10, bottom: 20, left: 30 },
            xAxis: { ticks: 11 }
        };
        this.militaryInfo = { data: dataSet, options: options };
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



}
