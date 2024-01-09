import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import React, { useEffect, useState, useRef } from 'react';
import './HomePage.css';
import {useNavigate} from "react-router-dom";

function PayementsGrid() { // Accept selectedClient as a prop
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
            const LoanID = event.data.LoanID;
            console.log(LoanID)
            navigate(`/recordInfo?RecordId=${LoanID}`);
        
        
    };

    // Define a mapping function to map API response fields to grid fields
    const mapApiResponseToGridFields = (apiData: any) => {
        return apiData.map((item : any) => ({
            LoanID: item.RecordId,
            DueDate: item.PaymentDueDate,
            PaymentDue: item.PaymentDueAmount,
            PaymentReceived: item.PaymentRecAmount,
            PaymentReceivedDate: item.PaymentRecDate,
            Name: item.Name
        }));
    };

    useEffect(() => {
        async function addName(item: any) {
            const response = await fetch(`/api/search-by-record-id?record_id=${item.RecordId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const record = await response.json();
            item = {
                ...item,
                Name: record.results[0].ClientName

            };
            return item;
        }

        async function fetchData() {
            try {
                // Construct the API URL based on the selected client
                const apiUrl = `/api/get_all_upcoming_payments`;
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const apiData = await response.json();

                // Use map to transform each item in apiData.results
                const gridData = await Promise.all(apiData.results.map(addName));

                // Assuming mapApiResponseToGridFields is a valid function
                const transformedGridData = mapApiResponseToGridFields(gridData);
                setRowData(transformedGridData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []); // Listen for changes in selectedClient



    return (
        <div className="ag-theme-alpine-dark" style={{ width: '100%', height: '100%' }}>
            <AgGridReact ref={gridRef} rowData={rowData} columnDefs={columnDefs} onRowClicked={onRowClicked} />
        </div>
    );
}

export default PayementsGrid;
