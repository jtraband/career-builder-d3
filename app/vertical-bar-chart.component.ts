import { Component, Input, OnInit, AfterViewInit, ElementRef }   from '@angular/core';

import { VerticalBarChart } from './vertical-bar-chart';
import { AbstractChartComponent } from './abstract-chart.component';
import { VBarChartOptions } from './interfaces';
import { DataSet } from './data-set';

@Component({
    selector: 'vertical-bar-chart',
    template: `<div id="chart"></div>`
})
export class VerticalBarChartComponent extends AbstractChartComponent {
    @Input() data: DataSet;
    @Input() options: VBarChartOptions;

    constructor(private _elementRef: ElementRef) {
        super();
    }

    drawChart() {
        let div = this._elementRef.nativeElement.firstElementChild;
        let chart = new VerticalBarChart();
        this.options.selector = div;
        chart.draw(this.data, this.options);
    }

}
