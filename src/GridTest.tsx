import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import React, { useEffect, useState, useRef } from 'react';
import './HomePage.css';

function GridTest({selectedClient} : any) { // Accept selectedClient as a prop
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
            Due: item.LoanMaturity,
            Status: item.ActiveStatus,
            Name: item.ClientName,
            Principal: item.LoanAmount
        }));
    };

    useEffect(() => {
        async function fetchData() {
            try {
                // Construct the API URL based on the selected client
                const apiUrl = `/api/search-by-client-id?client_id=${selectedClient}`;
                const response = await fetch(apiUrl);
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
    }, [selectedClient]); // Listen for changes in selectedClient

    return (
        <div className="ag-theme-alpine-dark" style={{ width: '100%', height: '100%' }}>
            <AgGridReact ref={gridRef} rowData={rowData} columnDefs={columnDefs} />
        </div>
    );
}

export default GridTest;
