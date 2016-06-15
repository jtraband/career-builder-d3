import { Component, ElementRef } from '@angular/core';
import { DataSet } from './data-set';
import { BarChartOptions, HBarChartOptions, VBarChartOptions, LineChartOptions } from './interfaces';
import { VerticalBarChartComponent } from './vertical-bar-chart.component';
import { HorizontalBarChartComponent } from './horizontal-bar-chart.component';
import { LineChartComponent } from './line-chart.component';
import { FunnelChartComponent } from './funnel-chart.component';

declare var d3: any;

@Component({
    selector: 'my-app',
    template: `
        <h1>D3 Test</h1>
        <div style="margin-bottom: 15px">
            <button type="button" class="btn btn-primary" (click)="onUpdateMilitaryInfo()" >Update Military Info</button>
            <button type="button" class="btn btn-primary" (click)="onToggleAxis('xAxis')" >Toggle X axis visibility</button>
            <button type="button" class="btn btn-primary" (click)="onToggleAxis('yAxis')" >Toggle Y axis visibility</button>
            <button type="button" class="btn btn-primary" (click)="onUpdateFunnel()" >Update funnel</button>
        </div>
        
        <horizontal-bar-chart *ngIf="militaryInfo"
             [data]="militaryInfo.data" [options]="militaryInfo.options" style="display: inline-block"></horizontal-bar-chart>
        <vertical-bar-chart *ngIf="companyInfo" 
            [data]="companyInfo.data" [options]="companyInfo.vOptions" style="display: inline-block"></vertical-bar-chart>
        <div></div>
        <vertical-bar-chart *ngIf="militaryInfo" 
            [data]="militaryInfo.data" [options]="militaryInfo.options" style="display: inline-block"></vertical-bar-chart>
        <horizontal-bar-chart *ngIf="companyInfo" 
            [data]="companyInfo.data" [options]="companyInfo.hOptions" style="display: inline-block"></horizontal-bar-chart>

        <div style="margin-top: 10px"></div>
        <line-chart *ngIf="lineInfo" 
            [data]="lineInfo.data" [options]="lineInfo.options" style="display: inline-block"></line-chart>                    
        <funnel-chart *ngIf="funnelInfo" 
            [data]="funnelInfo.data" [options]="funnelInfo.options" style="display: inline-block"></funnel-chart>
     `,
     directives: [HorizontalBarChartComponent, VerticalBarChartComponent, LineChartComponent, FunnelChartComponent]

})
export class AppComponent {

    elementRef: ElementRef;
    militaryInfo: { data: DataSet, options: HBarChartOptions };
    companyInfo: { data: DataSet, vOptions: VBarChartOptions, hOptions: HBarChartOptions };
    lineInfo: { data: DataSet, options: LineChartOptions };
    funnelInfo: { data: any, options: any };

    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef;
    }

    ngAfterViewInit() {
        d3.select(this.elementRef.nativeElement).select('h1').style('background-color', 'lightblue');
        setTimeout( () => {
            this.initMilitaryData();
            this.initCompanyData();
            this.initLineData();
            this.initFunnelData();
        }, 0);
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
            title: { text: 'Military Data', textStyle: { fontSize: '18px' }},
            margin: { top: 25, right: 30, bottom: 40, left: 30 },
            colors: [ 'lightblue', '#2ca02c' ], // 2nd one ignored because only a single color is needed
            xAxis: { ticks: 11 },
            inBar: { color: 'darkblue', textStyle: { fontSize: '12px'} },
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
        let options: BarChartOptions = {
            width: 500,
            height: 300,
            title: { text: 'Company Data', textStyle: { fontSize: '18px' } },
            margin: { top: 25, right: 10, bottom: 20, left: 50 },
            yAxis: { ticks: 5 },
        };
        options.barEvents = {
            click: (d: any, i: number) => {
                alert(`clicked on bar '${d.name}' with value '${d.value}'`);
            }
        };
        options.barToolTip = (d) => {
            return `<p>bar '${d.name}' with value '${d.value}'</p>`;
        };

        let hOptions: HBarChartOptions = _.cloneDeep(options);
        hOptions.legend = { location: 'bottom-right', textStyle: { fontSize: '20px' } };

        let vOptions: VBarChartOptions = _.cloneDeep(options);
        vOptions.legend = { location: 'top-right' };
        this.companyInfo = { data: dataSet, hOptions: hOptions, vOptions: vOptions };
    }

    initLineData() {
        let dataSet = new DataSet();
        dataSet.addColumns('Year', 'Sales', 'Expenses', 'Margin');
        dataSet.addRows([
            ['2013', 1000, 400, 600],
            ['2014', 1170, 460, 710],
            ['Really really extra really really really long label for 2015', 660, 1120, -460],
            ['2016', 1030, 540, 490]
        ]);
        let options: LineChartOptions = {
            width: 500,
            height: 300,
            title: { text: 'Line Data', textStyle: { fontSize: '18px' } },
            margin: { top: 45, right: 10, bottom: 65, left: 50 },
            yAxis: { ticks: 5 },
            // legend: { location: 'bottom-right' }
            legend: { location: 'below' }
        };
        this.lineInfo = { data: dataSet, options: options };
    }

    initFunnelData() {
        let data = [
            ['Plants',     3000],
            ['Flowers',    2500],
            ['Perennials', 2000],
            ['Roses',      1000],
         ];
         let options = {
                width: 500,
                height: 300,
                block: { dynamicHeight: true, dynamicSlope: true }
         };
         this.funnelInfo = { data: data, options: options };
    }

    onUpdateFunnel() {
        let flowers = this.funnelInfo.data[1];
        flowers[1] = flowers[1] + 100;
    }

    onUpdateMilitaryInfo() {
        let row3 = this.militaryInfo.data.dataRows[3];
        row3.values[0] = row3.values[0] + 10;
        this.militaryInfo.data.markChanged();
    }

    onToggleAxis(axis: string) {
         this.toggleAxis(this.militaryInfo.options, axis);
         this.toggleAxis(this.companyInfo.hOptions, axis);
         this.toggleAxis(this.companyInfo.vOptions, axis);
         this.toggleAxis(this.lineInfo.options, axis);
    }

    toggleAxis(options: any, axis: string) {
        if (options[axis]) {
            options[axis].visible = !options[axis].visible;
        } else {
            options[axis] = { visible: false };
        }

    }
}
