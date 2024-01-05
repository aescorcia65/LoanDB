import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from "ag-grid-community";
import React, { useEffect, useState, useRef } from 'react';
import './HomePage.css';

function InfoGrid({loanId} : any) {
    const rowData = [
        { LoanID: '216354', Name: 'Tony Meatballs', Principal: '$1224565', DueDate: '12/22/24', AmountReceived: '$1200', AmountReceivedDate: '12/22/22' },
       
    ];


    const columnDefs: ColDef[] = [
        
    
        { field: 'AmountReceived'},
        { field: 'AmountReceivedDate'}
    ];

    const gridRef = useRef<AgGridReact>(null);
    const navigate = useNavigate();
 // Listen for changes in selectedClient



    return (
        <div className='ag-theme-alpine-dark' style={{ width: '100%', height: '100%' }}>
            <AgGridReact
                ref = {gridRef}
                rowData={rowData}
                columnDefs={columnDefs}/>
        </div>
    );
}
export default InfoGrid;
