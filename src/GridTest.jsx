import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { AgGridReact } from 'ag-grid-react';

import './HomePage.css'

function GridTest() {
    const rowData = [
        {LoanID: '216354', Name: 'Tony Meatballs', Principal: '$1224565', Due: '1000', Status: 'Y'},
        {LoanID: '216123', Name: 'Joey Spaghetti', Principal: '$1462254', Due: '1000', Status: 'Y'},
        {LoanID: '216634', Name: 'Chris Lasagna', Principal: '$02568', Due: '10a00', Status: 'Y'},
        {LoanID: '216354', Name: 'Tony Meatballs', Principal: '$1225', Due: '1000', Status: 'Y'},
        {LoanID: '216354', Name: 'Tony Meatballs', Principal: '$1225', Due: '1000', Status: 'Y'},
        {LoanID: '216354', Name: 'Tony Meatballs', Principal: '$1225', Due: '1000', Status: 'Y'},
    ];

    const columnDefs = [
        {field: 'LoanID'},
        {field: 'Name'},
        {field: 'Principal'},
        {field: 'Due'},
        {field: 'Status'}
    ];
    return (
        <div className='ag-theme-alpine' style={{ height: 500 }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}/>
        </div>
    );
}

export default GridTest;