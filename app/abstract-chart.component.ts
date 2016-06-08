import { ChartOptions } from './interfaces';
import { DataSet } from './data-set';

export abstract class AbstractChartComponent  {
    data: DataSet;
    options: ChartOptions;

    _dataRevNumber: number;
    _prevOptions: any;

    abstract drawChart(): void;

    ngAfterViewInit() {
        this.drawChart();
    }

    ngDoCheck() {
         if (this.hasChanges()) {
             this.drawChart();
         }
     }

     hasChanges() {
         let changed = this.data.revNumber !== this._dataRevNumber
            || ! _.isEqual(this.options, this._prevOptions);
         if (changed) {
             this._dataRevNumber = this.data.revNumber;
             this._prevOptions = _.cloneDeep(this.options);
         }
         return changed;
     }



}
