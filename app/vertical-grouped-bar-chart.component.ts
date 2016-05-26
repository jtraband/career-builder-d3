import { Component, Input, OnInit, AfterViewInit, ElementRef }   from '@angular/core';

import { VerticalGroupedBarChart } from './vertical-grouped-bar-chart';
import { VBarChartOptions } from './interfaces';
import { DataSet } from './data-set';

@Component({
    selector: 'vertical-bar-chart',
    template: `<div id="chart"></div>`
})
export class VerticalGroupedBarChartComponent {
    @Input() data: DataSet;
    @Input() options: VBarChartOptions;

    constructor(private _elementRef: ElementRef) {
    }


    ngAfterViewInit() {
        this.drawChart();
    }

    drawChart() {
        let div = this._elementRef.nativeElement.firstElementChild;
        let chart = new VerticalGroupedBarChart();
        this.options.selector = div;
        chart.draw(this.data, this.options);
    }

}
