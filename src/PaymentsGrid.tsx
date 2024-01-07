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
        { field: 'LoanID', filter: true },
        { field: 'Name' },
        { field: 'AmountDue' },
        { field: 'DueDate' , filter: true},
        { field: 'PaymentReceived', editable:true },
        { field: 'PaymentReceivedDate', editable:true },
    ];

    const gridRef = useRef<AgGridReact>(null);
    const onRowClicked = (event: any) => {
        const loanId = event.data.LoanID;
        // Perform navigation using your preferred method
        // For example, using window.location for redirection
        navigate(`/recordInfo?loanId=${loanId}`);
    };

    // Define a mapping function to map API response fields to grid fields
    const mapApiResponseToGridFields = (apiData: any) => {
        return apiData.map((item : any) => ({
            LoanID: item.RecordId,
            DueDate: item.LoanMaturity,
            Status: item.ActiveStatus,
            Name: item.ClientName,
            AmountDue: item.LoanAmount
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

    const updateRecord = async (event: any) => {
        try {
            const loanid = event.data.LoanID
            const updatedData = {
                    ActiveStatus: event.data.Status,
                LoanMaturity: event.data.Due,
                LoanAmount: event.data.AmountDue
                    // Include other fields if necessary
            };
            console.log(updatedData)
            const response = await fetch(`/api/update-record?record_id=${loanid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log('Record updated successfully');
        } catch (error) {
            console.error('Error updating record:', error);
        }
    };

    return (
        <div className="ag-theme-alpine-dark" style={{ width: '100%', height: '100%' }}>
            <AgGridReact ref={gridRef} rowData={rowData} columnDefs={columnDefs} onRowClicked={onRowClicked} onCellEditingStopped={updateRecord}/>
        </div>
    );
}

export default PayementsGrid;
