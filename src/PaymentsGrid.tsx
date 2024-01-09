import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import React, { useEffect, useState, useRef } from 'react';
import './HomePage.css';
import {useNavigate} from "react-router-dom";

function PayementsGrid({selectedClient} : any) { // Accept selectedClient as a prop
    const [rowData, setRowData] = useState([]);
    const navigate = useNavigate();

    const columnDefs: ColDef[] = [
        { field: 'LoanID', filter: true, width: 100 },
        { field: 'Name' },
        { field: 'PaymentDue', width: 190 },
        { field: 'DueDate' , filter: true, width: 190},
        { field: 'PaymentReceived', editable:true },
        { field: 'PaymentReceivedDate', editable:true },
    ];

    const gridRef = useRef<AgGridReact>(null);
    const onRowClicked = (event: any) => {
        // if (event.colDef.field === 'RecordId') {
            const RecordId = event.data.RecordId;
            navigate(`/recordInfo?RecordId=${RecordId}`);
        
        
    };

    // Define a mapping function to map API response fields to grid fields
    const mapApiResponseToGridFields = (apiData: any) => {
        return apiData.map((item : any) => ({
            LoanID: item.RecordId,
            DueDate: item.PaymentDueDate,
            PaymentDue: item.PaymentDueAmount,
            PaymentReceived: item.PaymentRecAmount,
            PaymentReceivedDate: item.PaymentRecDate
        }));
    };

    useEffect(() => {
        async function fetchData() {
            try {
                // Construct the API URL based on the selected client
                const apiUrl = `/api/get_all_upcoming_payments`;
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const apiData = await response.json();
                const gridData = mapApiResponseToGridFields(apiData.results);
                console.log(gridData);
                setRowData(gridData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [selectedClient]); // Listen for changes in selectedClient


    return (
        <div className="ag-theme-alpine-dark" style={{ width: '100%', height: '100%' }}>
            <AgGridReact ref={gridRef} rowData={rowData} columnDefs={columnDefs} onRowClicked={onRowClicked} />
        </div>
    );
}

export default PayementsGrid;
