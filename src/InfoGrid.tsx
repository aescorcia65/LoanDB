import React, {useEffect, useState, useRef, useImperativeHandle, forwardRef} from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from "ag-grid-community";
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import any = jasmine.any;

const InfoGrid = forwardRef(({ loanId }: any, ref) => {
    const [rowData, setRowData] = useState<any>([]);

    const columnDefs: ColDef[] = [
        { field: 'AmountDue' },
        { field: 'AmountDueDate' },
        { field: 'AmountReceived' },
        { field: 'AmountReceivedDate' },
    ];

    const gridRef = useRef<AgGridReact>(null);
    const navigate = useNavigate();
    const addNewRow = () => {
        const newRowData = {
            AmountDue: '',
            AmountDueDate: '',
            AmountReceived: '',
            AmountReceivedDate: '',
            isNew: true
        };
        setRowData([...rowData, newRowData]);
    };

    // Expose addNewRow function to parent via ref
    useImperativeHandle(ref, () => ({
        addNewRow
    }));

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch(`/api/search-payments-by-record-id?payment_id=${loanId}`);
                const data = await response.json();
                if (data && data.results) {
                    setRowData(data.results.map((payment: any) => ({
                        AmountDue: payment.PaymentDueAmount,
                        AmountDueDate: payment.PaymentDueDate,
                        AmountReceived: payment.PaymentRecAmount,
                        AmountReceivedDate: payment.PaymentRecDate,
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
                columnDefs={columnDefs} />
        </div>
    );
})

export default InfoGrid;
