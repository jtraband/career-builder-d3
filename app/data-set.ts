export class DataColumn {
    constructor(public name: string, public type?: string, public label?: string) {
        if (!label) {
            this.label = this.name;
        }
    }
}

export class DataRow {
    constructor(public label: string, public values: any[]) {

    }

    // if only a single value
    public get value() {
        return this.values[0];
    }

}

export class DataSet {
    private _dataColumns: DataColumn[] = [];
    private _dataRows: DataRow[] = [];

    constructor() {

    }

    get dataColumns() {
        return this._dataColumns;
    }

    get dataRows() {
        return this._dataRows;
    }

    getGroupNames() {
        return this._dataColumns.slice(1).map( dc => dc.name);
    }

    getGroupLabels() {
        return this._dataColumns.slice(1).map( dc => dc.label);
    }


    addColumn(columnName: string) {
        let dc = new DataColumn(columnName);
        this.addDataColumn(dc);
    }

    addColumns(...columnNames: string[]) {
        columnNames.forEach(c => this.addColumn(c));
    }

    addDataColumn(dataColumn: DataColumn) {
        return this._dataColumns.push(dataColumn);
    }

    addDataColumns(dataColumns: DataColumn[]) {
        return dataColumns.forEach(dc => this.addDataColumn(dc));
    }

    addRow(row: any[]) {
        let dr = new DataRow(row[0], row.slice(1));
        this.addDataRow(dr);
    }

    addRows(rows: any[][] ) {
        rows.forEach(r => this.addRow(r));
    }

    addDataRow(dataRow: DataRow) {
        this._dataRows.push(dataRow);
    }

    addDataRows(dataRows: DataRow[]) {
        dataRows.forEach(dr => this.addDataRow(dr));
    }

}
