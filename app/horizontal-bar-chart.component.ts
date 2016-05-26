import { Component, Input, OnInit, AfterViewInit, ElementRef }   from '@angular/core';

import { HorizontalBarChart } from './horizontal-bar-chart';
import { HBarChartOptions } from './interfaces';
import { DataSet } from './data-set';

// Does not yet support groups.
@Component({
    selector: 'horizontal-bar-chart',
    template: `<div id="chart"></div>`
})
export class HorizontalBarChartComponent {
    @Input() data: DataSet;
    @Input() options: HBarChartOptions;

    constructor(private _elementRef: ElementRef) {
    }


    ngAfterViewInit() {
        this.drawChart();
    }

    drawChart() {
        let div = this._elementRef.nativeElement.firstElementChild;
        let chart = new HorizontalBarChart();
        this.options.selector = div;
        chart.draw(this.data, this.options);
    }

}
