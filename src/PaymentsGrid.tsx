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


    // Define a mapping function to map API response fields to grid fields
    const mapApiResponseToGridFields = (apiData: any) => {
        return apiData.map((item : any) => ({
            LoanID: item.LoanId,
            DueDate: item.PaymentDueDate,
            PaymentDue: item.PaymentDueAmount,
            PaymentReceived: item.PaymentRecAmount,
            PaymentReceivedDate: item.PaymentRecDate,
            Name: item.ClientName
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

                // Use map to transform each item in apiData.results

                // Assuming mapApiResponseToGridFields is a valid function
                const transformedGridData = mapApiResponseToGridFields(apiData.results);
                setRowData(transformedGridData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);


    async function closePayment(payment:any) {
        try {
            // Construct the API URL based on the selected client
            const apiUrl = `/api/close-payment`;
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payment)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const apiData = await response.json();

            // Use map to transform each item in apiData.results

            // Assuming mapApiResponseToGridFields is a valid function
            const transformedGridData = mapApiResponseToGridFields(apiData.results);
            setRowData(transformedGridData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }

    async function onRowEdit(event:any) {
        if(event.data.PaymentDue <= event.data.PaymentReceived){
            closePayment(event.data);



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
            <AgGridReact ref={gridRef} rowData={rowData} columnDefs={columnDefs} onCellEditingStopped={onRowEdit}/>
        </div>
    );}

export default PayementsGrid;
