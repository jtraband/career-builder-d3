// /// <reference path='../typings/browser.d.ts' />
// /// <reference path='../typings/browser/definitions/d3/index.d.ts'/>;

import { Component, ElementRef } from '@angular/core';
import { DataSet } from './data-set';
import { HBarChartOptions, VBarChartOptions } from './interfaces';
import { VerticalBarChartComponent } from './vertical-bar-chart.component';
import { HorizontalBarChartComponent } from './horizontal-bar-chart.component';
import { HorizontalBarChart } from './horizontal-bar-chart';
import { HorizontalBarChartSimple } from './horizontal-bar-chart-simple';

declare var d3: any;

@Component({
    selector: 'my-app',
    template: `
        <h1>D3 Test</h1>
        <horizontal-bar-chart *ngIf="militaryInfo" [data]="militaryInfo.data" [options]="militaryInfo.options" style="display: inline-block"></horizontal-bar-chart>
        <vertical-bar-chart *ngIf="companyInfo" [data]="companyInfo.data" [options]="companyInfo.options" style="display: inline-block"></vertical-bar-chart>
        <div></div>
        <vertical-bar-chart *ngIf="militaryInfo" [data]="militaryInfo.data" [options]="militaryInfo.options" style="display: inline-block"></vertical-bar-chart>
        <horizontal-bar-chart *ngIf="companyInfo" [data]="companyInfo.data" [options]="companyInfo.options" style="display: inline-block"></horizontal-bar-chart>
       
        <div class="hbar2"></div>
     `,
     directives: [HorizontalBarChartComponent, VerticalBarChartComponent]

})
export class AppComponent {

    elementRef: ElementRef;
    militaryInfo: { data: DataSet, options: HBarChartOptions };
    companyInfo: { data: DataSet, options: VBarChartOptions };

    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef;
    }

    ngAfterViewInit() {
        d3.select(this.elementRef.nativeElement).select('h1').style('background-color', 'lightblue');
        setTimeout( () => {
            this.initMilitaryData();
            this.initCompanyData();
            this.drawHBar2();
        }, 0);
    }

    drawHBar2() {
        let chart = new HorizontalBarChartSimple();
        this.militaryInfo.options.selector = '.hbar2';
        chart.draw(this.militaryInfo.data, this.militaryInfo.options);
    }

    initMilitaryData() {
        let dataSet = new DataSet();
        dataSet.addColumns('label', 'value');
        dataSet.addRows([
            [ 'Veteran', 574 ],
            [ 'No Obligation',  113 ],
            [ 'Active Duty',  79 ],
            [ 'Retired Military', 78 ],
            [ 'Reserve - Drilling', 56 ],
            [ 'Inactive Reserve', 45 ],
            [ 'Unfilled', 10 ] ,
            [ 'Filled', 4 ]
        ]);
        let options: HBarChartOptions = {
            width: 500,
            height: 300,
            // selector: '.named-bar',
            title: { text: 'Military Data', fontSize: '18px' },
            margin: { top: 25, right: 30, bottom: 40, left: 30 },
            xAxis: { ticks: 11 }
        };
        this.militaryInfo = { data: dataSet, options: options };
    }

    initCompanyData() {
        let dataSet = new DataSet();
        dataSet.addColumns('year', 'demand', 'supply');
        dataSet.addRows([
            [ '2015', 12000, 9000 ] ,
            [ '2014', 6000, 5000 ],
            [ '2013', 2000, 1000 ]
        ]);
        let options: VBarChartOptions = {
            width: 500,
            height: 300,
            // selector: '.named-bar',
            title: { text: 'Company Data', fontSize: '18px' },
            margin: { top: 25, right: 10, bottom: 20, left: 50 },
            yAxis: { ticks: 5 }
        };
        this.companyInfo = { data: dataSet, options: options };
    }



}
