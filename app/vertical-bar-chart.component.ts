import { Component, Input, OnInit, AfterViewInit, ElementRef }   from '@angular/core';

import { VerticalBarChart } from './vertical-bar-chart';
import { VBarChartOptions } from './interfaces';
import { DataSet } from './data-set';

@Component({
    selector: 'vertical-bar-chart',
    template: `<div id="chart"></div>`
})
export class VerticalBarChartComponent {
    @Input() data: DataSet;
    @Input() options: VBarChartOptions;

    constructor(private _elementRef: ElementRef) {
    }


    ngAfterViewInit() {
        this.drawChart();
    }

    drawChart() {
        let div = this._elementRef.nativeElement.firstElementChild;
        let chart = new VerticalBarChart();
        this.options.selector = div;
        chart.draw(this.data, this.options);
    }

}
