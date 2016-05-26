export interface DataColumn {
    name: string;
    type: string;
    label?: string;
}

export interface DataRow {

}

export class DataSet {
    private _dataColumns: DataColumn[] = [];
    private _dataRows: any[][] = [];

    constructor() {

    }

    get dataColumns() {
        return this._dataColumns;
    }

    get dataRows() {
        return this._dataRows;
    }


    addColumn(col: DataColumn | string) {
        let dc: DataColumn;
        if (typeof col === 'string') {
            dc = <DataColumn> { name: col };
        } else {
            dc = <DataColumn> col;
        }
        this._dataColumns.push(dc);
    }

    addColumns(cols: string[] | DataColumn[]) {
        let tmps = <any[]> cols;
        tmps.forEach(c => this.addColumn(c));
    }


    addRow(row: any[]) {
        this._dataRows.push(row);
    }

    addRows(rows: any[][] ) {
        this._dataRows.push(...rows);
    }

    transformToDataItems() {
        let dataItems = this._dataRows.map((dataRow) => {
            let dataItem = {};
            dataRow.forEach( (item, ix)  => {
                let dc = this._dataColumns[ix];
                dataItem[dc.name] = item;
            });
            return dataItem;
        });
        return dataItems;
    }

}
