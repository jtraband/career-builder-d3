import { Component, Input, OnInit, AfterViewInit, OnChanges, ElementRef, ChangeDetectionStrategy  }   from '@angular/core';
import { AbstractChartComponent } from './abstract-chart.component';

import { HorizontalBarChart } from './horizontal-bar-chart';
import { HBarChartOptions } from './interfaces';
import { DataSet } from './data-set';

// Does not yet support groups.
@Component({
    selector: 'horizontal-bar-chart',
    template: `<div id="chart"></div>`,
    // changeDetection: ChangeDetectionStrategy.OnPush,

})
export class HorizontalBarChartComponent extends AbstractChartComponent  {
    @Input() data: DataSet;
    @Input() options: HBarChartOptions;

    constructor(private _elementRef: ElementRef) {
        super();
    }

    drawChart() {
        let div = this._elementRef.nativeElement.firstElementChild;
        let chart = new HorizontalBarChart();
        this.options.selector = div;
        chart.draw(this.data, this.options);
    }

}
