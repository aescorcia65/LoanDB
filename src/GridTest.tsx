import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import React, { useEffect, useState, useRef } from 'react';
import './HomePage.css';

function GridTest() {
    const [rowData, setRowData] = useState([]);

    const columnDefs: ColDef[] = [
        { field: 'LoanID', filter: true },
        { field: 'Name' },
        { field: 'Principal' },
        { field: 'Due' },
        { field: 'Status' },
    ];

    const gridRef = useRef<AgGridReact>(null);

    // Define a mapping function to map API response fields to grid fields
    const mapApiResponseToGridFields = (apiData: any) => {
        return apiData.map((item : any) => ({
            LoanID: item.RecordId,
            Due: item.AmountDue,
            Status: item.ActiveStatus,
            Name: item.Name,
            Principal:item.Principal
        }));
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/search-by-fullname?fullname=');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const apiData = await response.json();
                const gridData = mapApiResponseToGridFields(apiData.results);
                setRowData(gridData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="ag-theme-alpine-dark" style={{ width: '100%', height: '100%' }}>
            <AgGridReact ref={gridRef} rowData={rowData} columnDefs={columnDefs} />
        </div>
    );
}

export default GridTest;
