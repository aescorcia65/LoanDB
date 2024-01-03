import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { AgGridReact } from 'ag-grid-react';
import { ColDef } from "ag-grid-community";

import './HomePage.css';

function GridTest() {
    const rowData = [
        { LoanID: '216354', Name: 'Tony Meatballs', Principal: '$1224565', Due: '1000', Status: 'Y' },
        { LoanID: '216123', Name: 'Joey Spaghetti', Principal: '$1462254', Due: '1000', Status: 'Y' },
        { LoanID: '216634', Name: 'Chris Lasagna', Principal: '$02568', Due: '10a00', Status: 'Y' },
        { LoanID: '216354', Name: 'Tony Meatballs', Principal: '$1225', Due: '1000', Status: 'Y' },
        { LoanID: '216354', Name: 'Tony Meatballs', Principal: '$1225', Due: '1000', Status: 'Y' },
        { LoanID: '216354', Name: 'Tony Meatballs', Principal: '$1225', Due: '1000', Status: 'n' },
    ];


    const columnDefs: ColDef[] = [
        { field: 'LoanID'},
        { field: 'Name'},
        { field: 'Principal'},
        { field: 'Due'},
        { field: 'Status'}
    ];

    return (
        <div className='ag-theme-alpine-dark' style={{ width: '100%', height: '100%' }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs} />
        </div>
    );
}

export default GridTest;
