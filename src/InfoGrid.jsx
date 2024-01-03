import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from "ag-grid-community";
import React, { useEffect, useState, useRef } from 'react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

import './HomePage.css';

function GridTest() {
    const rowData = [
        { LoanID: '216354', Name: 'Tony Meatballs', Principal: '$1224565', Due: '1000', AmountReceived: '$1200', AmountRecievedDate: '12/22/22' },
       
    ];


    const columnDefs: ColDef[] = [
        
        { field: 'LoanID', filter: true},
        { field: 'Name'},
        { field: 'Principal'},
        { field: 'Due'},
        { field: 'AmountRecieved'},
        { field: 'AmountReceivedDate'}
    ];

    const gridRef = useRef<AgGridReact>(null);
    const navigate = useNavigate();
    
   



    return (
        <div className='ag-theme-alpine-dark' style={{ width: '100%', height: '100%' }}>
            <AgGridReact
                ref = {gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                onRowClicked={onRowClicked} />
        </div>
    );
}

export default GridTest;
