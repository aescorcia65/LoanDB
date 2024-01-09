import React, {useEffect, useState, useRef, useImperativeHandle, forwardRef} from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from "ag-grid-community";
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
const InfoGrid = forwardRef(({ loanRecord }: any, ref) => {
    const [rowData, setRowData] = useState<any>([]);
    const columnDefs: ColDef[] = [
        { field: 'PaymentDue', editable:true },
        { field: 'PaymentDueDate' , editable:true},
        { field: 'PaymentReceived' , editable:true},
        { field: 'PaymentReceivedDate' , editable:true},
    ];

    const gridRef = useRef<AgGridReact>(null);
    const navigate = useNavigate();

    const postNewPayment = async (paymentData: any) => {
        const newPayment = {
            RecordId: loanRecord.RecordId,
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

    const addNewRow = () => {
        // Find the highest PaymentDueDate in the existing rowData
        const latestDate = rowData.reduce((latest: any, row: any) => {
            const rowDate = new Date(row.PaymentDueDate);
            return rowDate > latest ? rowDate : latest;
        }, new Date(loanRecord.LoanMaturity)); // Start with epoch date

        // Calculate the date 30 days later
        const newDueDate = new Date(latestDate);

        if (loanRecord.PaymentFrequency === "Monthly") {
            newDueDate.setDate(newDueDate.getDate() + 30);
        } else if (loanRecord.PaymentFrequency === "Quarterly") {
            newDueDate.setDate(newDueDate.getDate() + 90); // Approximate quarter
        } else if (loanRecord.PaymentFrequency === "Annually") {
            newDueDate.setFullYear(newDueDate.getFullYear() + 1); // Add one year
        }


        // Format the newDueDate back to the same format as your rowData dates
        const formattedDate = newDueDate.toISOString().split('T')[0];

        const newRowData = {
            PaymentDue: 0,
            PaymentDueDate: formattedDate,
            PaymentReceived: 0,
            PaymentReceivedDate: '',
        };
        postNewPayment(newRowData);

        setRowData([...rowData, newRowData]);
    };


    // Expose addNewRow function to parent via ref
    useImperativeHandle(ref, () => ({
        addNewRow
    }));


    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch(`/api/search-payments-by-record-id?record_id=${loanRecord.RecordId || 1}`);
                const data = await response.json();
                if (data && data.results) {
                    setRowData(data.results.map((payment: any) => ({
                        PaymentDue: payment.PaymentDueAmount,
                        PaymentDueDate: payment.PaymentDueDate,
                        PaymentReceived: payment.PaymentRecAmount,
                        PaymentReceivedDate: payment.PaymentRecDate,
                        PaymentId : payment.PaymentId
                    })));
                }
            } catch (error) {
                console.error('Error fetching payment data:', error);
            }
        };

        fetchPayments();
    }, [loanRecord.RecordID]);

    async function onRowEdit(event:any) {
        if(event.data.PaymentDue <= event.data.PaymentReceived){
            addNewRow()


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
        <div className='ag-theme-alpine-dark' style={{ width: '100%', height: '100%' }}>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                onCellEditingStopped={onRowEdit}
            />
        </div>
    );
})

export default InfoGrid;
