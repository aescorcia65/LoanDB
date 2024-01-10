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
    const onRowClicked = (event:any) => {
        console.log('Row clicked:', event);
        // First, ensure that event.colDef is defined
        if (event.columnDefs) {
            console.log(event.columnDefs.field); // Logging the field name
            if (event.colDef.field === 'LoanID') { // Checking if the clicked column is 'LoanID'
                const LoanID = event.data.LoanID;
                console.log(LoanID);
                navigate(`/recordInfo?RecordId=${LoanID}`);
            }
        }
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
    }, []);

    const postNewPayment = async (paymentData: any, event:any) => {
        const newPayment = {
            RecordId: event.LoanId,
            PaymentDueDate: paymentData.PaymentDueDate,
            PaymentDueAmount: parseFloat(paymentData.PaymentDue),
            PaymentRecDate: paymentData.PaymentReceivedDate,
            PaymentRecAmount: parseFloat(paymentData.PaymentReceived),
        };

        try {
            const response = await fetch('/api/new-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPayment),
            });

            if (response.ok) {
                console.log('New payment record created successfully');
                // Additional logic on success
            } else {
                console.error('Failed to create payment record:', response.status);
                // Error handling logic
            }
        } catch (error) {
            console.error('Error in creating payment record:', error);
            // Error handling logic
        }
    };

    async function onRowEdit(event:any) {
        if(event.data.PaymentDue <= event.data.PaymentReceived){
            const newPayment = {
                PaymentDue: event.data.PaymentDue,
                PaymentDueDate: event.data.PaymentDueDate,
                PaymentReceived: 0,
                PaymentReceivedDate: '',
            };
            postNewPayment(newPayment, event.data);



        }
        updatePayment(event)

    }

    const updatePayment = async (event: any) => {
        try {
            const payid = event.data.PaymentId
            console.log(payid)
            const updatedData = {
                PaymentRecAmount: event.data.PaymentReceived,
                PaymentRecDate: event.data.PaymentReceivedDate
                // Include other fields if necessary
            };
            console.log(updatedData)
            const response = await fetch(`/api/update-payment?payment_id=${payid}`, {
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
            <AgGridReact ref={gridRef} rowData={rowData} columnDefs={columnDefs} onRowClicked={onRowClicked} onCellEditingStopped={onRowEdit}/>
        </div>
    );}

export default PayementsGrid;
