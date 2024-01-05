import React, {useEffect, useState, useRef, useImperativeHandle, forwardRef} from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from "ag-grid-community";
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
const InfoGrid = forwardRef(({ loanId }: any, ref) => {
    const [rowData, setRowData] = useState<any>([]);
    const columnDefs: ColDef[] = [
        { field: 'PaymentDue', editable:true },
        { field: 'PaymentDueDate' , editable:true},
        { field: 'PaymentReceived' , editable:true},
        { field: 'PaymentReceivedDate' , editable:true},
    ];

    const gridRef = useRef<AgGridReact>(null);
    const navigate = useNavigate();
    const addNewRow = () => {
        const newRowData = {
            PaymentDue: '',
            PaymentDueDate: '',
            PaymentReceived: '',
            PaymentReceivedDate: '',
            isNew: true
        };
        setRowData([...rowData, newRowData]);
    };

    // Expose addNewRow function to parent via ref
    useImperativeHandle(ref, () => ({
        addNewRow
    }));
    const onCellEditingStopped = async (params:any) => {
        const updatedRowData = params.data;

        // Define the endpoint and method based on whether the row is new
        let endpoint = "/new-payment";
        let method = "POST";

        if (!updatedRowData.isNew) {
            // Update existing payment
            endpoint = `/api/update-payment?payment_id=${updatedRowData.PaymentId}`;
            method = "PUT";
        }

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRowData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Operation result:', result);

            // If this was a new row, remove the isNew flag
            if (updatedRowData.isNew) {
                delete updatedRowData.isNew;
            }

        } catch (error) {
            console.error('Error updating/creating payment:', error);
        }
    };


    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch(`/api/search-payments-by-record-id?payment_id=${loanId}`);
                const data = await response.json();
                if (data && data.results) {
                    setRowData(data.results.map((payment: any) => ({
                        PaymentDue: payment.PaymentDueAmount,
                        PaymentDueDate: payment.PaymentDueDate,
                        PaymentReceived: payment.PaymentRecAmount,
                        PaymentReceivedDate: payment.PaymentRecDate,
                        PaymentId : payment.Paymentid
                    })));
                }
            } catch (error) {
                console.error('Error fetching payment data:', error);
            }
        };

        fetchPayments();
    }, [loanId]);

    return (
        <div className='ag-theme-alpine-dark' style={{ width: '100%', height: '100%' }}>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                onCellEditingStopped={onCellEditingStopped}
            />
        </div>
    );
})

export default InfoGrid;
