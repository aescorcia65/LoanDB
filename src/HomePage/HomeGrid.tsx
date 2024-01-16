import React, {useEffect, useState, useRef, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react';
import {ColDef, GridOptions} from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import './HomePage.css';
import ClosePaymentModal from "./ClosePaymentModal";




function HomeGrid({ selectedClient, selectedMonths, selectedYears, selectedStatus }:any) {
    const [rowData, setRowData] = useState([]);
    const navigate = useNavigate();
    const [gridApi, setGridApi] = useState(null);
    const [updateCount, setUpdateCount]= useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEdit, setCurrentEdit] = useState(null);

    const gridOptions: GridOptions<any> = {
        dataTypeDefinitions: {

            date: {
                extendsDataType: 'date',
                baseDataType: 'date',
                valueFormatter: (params: any) => {
                    if (params.value) {
                        const parts = String(params.value).split('-');
                        const year = parseInt(parts[0], 10);
                        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript Date
                        const day = parseInt(parts[2], 10);

                        const date = new Date(year, month, day);
                        const formattedDay = String(date.getDate()).padStart(2, '0');
                        const formattedMonth = String(date.getMonth() + 1).padStart(2, '0'); // Adjusting back to 1-indexed
                        const formattedYear = date.getFullYear();

                        return `${formattedMonth}/${formattedDay}/${formattedYear}`;
                    } else {
                        return '';
                    }
                },
            },
        },
        headerHeight: 40,
        getRowStyle: (params: any) => {
            if (params.data.Closed) {
                return { backgroundColor: 'rgb(208,206,206)' }; // Row color for 'Closed' is true
            } else {
                return { backgroundColor: 'rgb(255,255,204)' }; // Row color for 'Closed' is false
            }
        }
    };

    const columnDefs: ColDef[] = [

        { headerName: 'Name',field: 'Name', width: 122, filter: true, autoHeight:true , cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text' },
        { headerName: 'LX ID', field: 'LoanID', headerClass: 'thick-border', width: 122, filter: true, autoHeight:true, cellStyle: {'padding-left': 4 ,'border-right': '2px solid', 'border-bottom': '1px solid'}},
        { headerName: 'Loan Amt', field: 'Principal',  filter: true, width: 122 ,columnGroupShow: 'open', autoHeight:true,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text' },
        { headerName: 'Loan Issue Date',field: 'Issued', filter: true, width: 122, columnGroupShow: 'open', autoHeight:true,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, cellDataType:'date', headerClass: 'wrap-header-text' },
        { headerName: 'Loan Maturity Date',field: 'Due' , filter: true, width: 122, columnGroupShow: 'open', autoHeight:true,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, cellDataType:'date', headerClass: 'wrap-header-text' },
        { headerName: 'Interest Rate', field: 'InterestRate', filter: true, width: 122, columnGroupShow: 'open', autoHeight:true,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text'},
        { headerName: 'Payment Freq',field: 'PaymentFreq', filter: true, width: 122, columnGroupShow: 'open', autoHeight:true,  cellStyle: {'padding-left': 4 ,'border-right': '2px solid', 'border-bottom': '1px solid'}, headerClass: 'thick-border'},
        { headerName: 'Payment Due Date', field: 'DueDate' , headerClass: 'wrap-header-text', width: 122,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, cellDataType:'date' },
        { headerName: 'Payment Expected', field: 'PaymentDue', filter: true, width: 122,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text'},
        { headerName: 'Payment Received', field: 'PaymentReceived', filter: true, editable:true, width: 122,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text'},
        { headerName: 'Payment Received Date', field: 'PaymentReceivedDate', filter: true, editable:true, width: 127,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, cellDataType:'date', headerClass: 'wrap-header-text',},
        { headerName: 'Closed',field: 'Closed', filter: true, editable:true, width: 95  ,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text'  },
          
    ];

    // This function maps the API response to the grid's data format
    const mapApiResponseToGridFields = (apiData:any) => {
        return apiData.map((item:any) => ({
            LoanID: item.LoanId,
            Due: item.LoanMaturity != null ? item.LoanMaturity : null,
            Issued: item.IssueDate != null ? item.IssueDate : null,
            Status: Boolean(item.ActiveStatus),
            Name: item.ClientName,
            Principal: item.LoanAmount != null ? `$${item.LoanAmount}` : item.LoanAmount,
            PaymentDue: item.PaymentDueAmount != null ? `$${item.PaymentDueAmount}` : item.PaymentDueAmount,
            DueDate: item.PaymentDueDate != null ? item.PaymentDueDate : null,
            PaymentReceived: item.PaymentRecAmount != null ? `$${item.PaymentRecAmount}` : item.PaymentRecAmount,
            PaymentReceivedDate: item.PaymentRecDate != null ? item.PaymentRecDate : null,
            Closed: Boolean(item.PaidStatus),
            PaymentId: item.PaymentId,
            PaymentFreq: item.PaymentFrequency,
            InterestRate: item.InterestRate != null ? `${item.InterestRate}%` : null,
        }));
    };

    // Fetch data whenever selectedClient, selectedMonths, or selectedYears changes
    useEffect(() => {

        const fetchData = async () => {
            try {
                // Map selectedMonths and selectedYears to their respective integer representations
                const mappedMonths = selectedMonths
                    .map((selected:any, index:any) => selected ? index + 1 : null)
                    .filter((month: any) => month !== null);
                const currentYear = new Date().getFullYear();
                const mappedYears = selectedYears
                    .map((selected:any, index:any) => selected ? currentYear + index : null)
                    .filter((year:any) => year !== null);
                const monthsArray = [0, ...mappedMonths]
                const yearsArray = [0, ...mappedYears]

                let statusFilter;
                if (selectedStatus[0] && selectedStatus[1]) {
                    // Both active and inactive are selected
                    statusFilter = 'both';
                } else if (selectedStatus[0]) {
                    // Only active is selected
                    statusFilter = 'closed';
                } else if (selectedStatus[1]) {
                    // Only inactive is selected
                    statusFilter = 'open';
                } else {
                    // Neither active nor inactive is selected
                    statusFilter = 'none';
                }

                // Construct the API URL
                const apiUrl = `/api/filter-data`;

                // Prepare the request body
                const requestBody = {
                    Months: monthsArray,
                    Years: yearsArray,
                    ActiveStatus: statusFilter,  // Assuming you have this variable in your state
                    ClientId: selectedClient
                };
                console.log(requestBody)

                // Make the POST request
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });
                console.log(requestBody)

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const apiData = await response.json();
                if (gridApi != null) {
                    if (apiData && apiData.results) {
                        const sortedPayments = apiData.results.sort((a: any, b: any) => {
                            // Assuming PaidStatus is a boolean where true represents 'closed'
                            // Sorting 'closed' (true) first and then 'open' (false)
                            if (a.PaidStatus && !b.PaidStatus) {
                                return 1; // a comes first
                            } else if (!a.PaidStatus && b.PaidStatus) {
                                return -1; // b comes first
                            } else {
                                return 0; // No change in order
                            }
                        });
                        setRowData(mapApiResponseToGridFields(sortedPayments));
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Consider setting an error state and displaying it in the UI
            }
        };

        fetchData();
    }, [selectedMonths, selectedYears, gridApi, selectedStatus, selectedClient, updateCount]);

    const onGridReady = useCallback((params:any) => {
        setGridApi(params.api);
        // You can now safely use gridApi here if needed
    }, []);

    const handleConfirmUpdate = () => {
        // Perform the update logic here using currentEdit
        console.log("Update Confirmed", currentEdit);
        updatePayment(currentEdit)

        // Close the modal
        setIsModalOpen(false);

    };

    const handleCancelUpdate = () => {
        setIsModalOpen(false);
        setCurrentEdit(null)
        setUpdateCount(updateCount+1)
    };
    const updateRecordd = useCallback((event:any) => {
        if(event.column.colDef.field === "Closed"){
        setCurrentEdit(event);
        setIsModalOpen(true);}
        else{
            updatePayment(event)
        }
    }, []);
    async function updatePayment(event:any) {
        try {

            // Construct the API URL
            const apiUrl = `/api/update-payment`;

            const formatDate = (date: any) => {
                let year = date.getFullYear();
                let month = date.getMonth() + 1; // getMonth() returns 0-11
                let day = date.getDate();
                return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            };

            const requestBody = {
                LoanId: event.data.LoanID,
                PaymentDueDate: event.data.DueDate != null ? formatDate(new Date(event.data.DueDate)) : null,
                PaymentDueAmount: event.data.PaymentDue != null ? parseFloat(event.data.PaymentDue.replace("$", "")) : null,
                PaymentRecDate: event.data.PaymentReceivedDate != null ? formatDate(new Date(event.data.PaymentReceivedDate)) : null,
                PaymentRecAmount: event.data.PaymentReceived != null ? parseFloat(event.data.PaymentReceived.replace("$", "")) : null,
                PaymentId: event.data.PaymentId,
                PaidStatus: event.data.Closed
            };

            // Make the POST request
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            else{setUpdateCount(updateCount+1)}

        } catch (error) {
            console.error('Error fetching data:', error);
            // Consider setting an error state and displaying it in the UI
        }

    }

    return (
        <div className="ag-theme-balham" style={{ width: '100%', height: '100%' }}>
            <AgGridReact
                onGridReady={onGridReady}
                rowData={rowData}
                columnDefs={columnDefs}
                // onRowClicked={handleRowClick}
                onCellEditingStopped={updateRecordd}
                gridOptions={gridOptions}
                //onRowEditingStopped={updateRecord}
            />
            <ClosePaymentModal
                isOpen={isModalOpen}
                onConfirm={handleConfirmUpdate}
                onCancel={handleCancelUpdate}
            />
        </div>
    );
}

export default HomeGrid;
