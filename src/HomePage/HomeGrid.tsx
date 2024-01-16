import React, {useEffect, useState, useRef, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import './HomePage.css';




function HomeGrid({ selectedClient, selectedMonths, selectedYears, selectedStatus }:any) {
    const [rowData, setRowData] = useState([]);
    const navigate = useNavigate();
    const [gridApi, setGridApi] = useState(null);
    const [updateCount, setUpdateCount]= useState(0)

    const gridOptions = {
        headerHeight: 40, // Adjust this value as needed
    };

    const columnDefs: ColDef[] = [

        { headerName: 'Name',field: 'Name', width: 122, filter: true, autoHeight:true , cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text' },
        { headerName: 'LX ID', field: 'LoanID', width: 122, filter: true, autoHeight:true, cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text'},
        { headerName: 'Loan Amt', field: 'Principal',  filter: true, width: 122 ,columnGroupShow: 'open', autoHeight:true,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text' },
        { headerName: 'Loan Issue Date',field: 'Issued', filter: true, width: 122, columnGroupShow: 'open', autoHeight:true,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, cellDataType:'date', headerClass: 'wrap-header-text' },
        { headerName: 'Loan Maturity Date',field: 'Due' , filter: true, width: 122, columnGroupShow: 'open', autoHeight:true,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, cellDataType:'date', headerClass: 'wrap-header-text' },
        { headerName: 'Interest Rate', field: 'InterestRate', filter: true, width: 122, columnGroupShow: 'open', autoHeight:true,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text'},
        { headerName: 'Payment Freq',field: 'PaymentFreq', filter: true, width: 122, columnGroupShow: 'open', autoHeight:true,  cellStyle: {'padding-left': 4 ,'border-right': '2px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text'},
        { headerName: 'Payment Due Date', field: 'DueDate' ,  width: 122,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, cellDataType:'date', headerClass: 'wrap-header-text' },
        { headerName: 'Payment Expected', field: 'PaymentDue', filter: true, width: 122,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text'},
        { headerName: 'Payment Received', field: 'PaymentReceived', filter: true, editable:true, width: 144,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text'},
        { headerName: 'Payment Received Date', field: 'PaymentReceivedDate', filter: true, editable:true, width: 174,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, cellDataType:'date', headerClass: 'wrap-header-text'},
        { headerName: 'Closed',field: 'Closed', filter: true, editable:true, width: 78  ,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text'  },
          
    ];

    // This function maps the API response to the grid's data format
    const mapApiResponseToGridFields = (apiData:any) => {
        return apiData.map((item:any) => ({
            LoanID: item.LoanId,
            Due: item.LoanMaturity != null ? new Date(item.LoanMaturity) : null,
            Issued: item.IssueDate != null ? new Date(item.IssueDate) : null,
            Status: Boolean(item.ActiveStatus),
            Name: item.ClientName,
            Principal: item.LoanAmount != null ? `$${item.LoanAmount}` : item.LoanAmount,
            PaymentDue: item.PaymentDueAmount != null ? `$${item.PaymentDueAmount}` : item.PaymentDueAmount,
            DueDate: item.PaymentDueDate != null ? new Date(item.PaymentDueDate) : null,
            PaymentReceived: item.PaymentRecAmount != null ? `$${item.PaymentRecAmount}` : item.PaymentRecAmount,
            PaymentReceivedDate: item.PaymentRecDate != null ? new Date(item.PaymentRecDate) : null,
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
                            // Convert dates to Date objects for comparison
                            const dateA = new Date(a.PaymentDueDate);
                            const dateB = new Date(b.PaymentDueDate);
                            return dateB.getTime() - dateA.getTime(); // Sort in descending order (newest first)
                        });
                    setRowData(mapApiResponseToGridFields(sortedPayments));
                }}
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

    async function updateRecord(event:any) {
        console.log(event)
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

        } catch (error) {
            console.error('Error fetching data:', error);
            // Consider setting an error state and displaying it in the UI
        }
        setUpdateCount(updateCount+1)

    }

    return (
        <div className="ag-theme-balham" style={{ width: '100%', height: '100%' }}>
            <AgGridReact
                onGridReady={onGridReady}
                rowData={rowData}
                columnDefs={columnDefs}
                // onRowClicked={handleRowClick}
                onCellEditingStopped={updateRecord}
                gridOptions={gridOptions}
                //onRowEditingStopped={updateRecord}
                onRowSelected={updateRecord}
            />
        </div>
    );
}

export default HomeGrid;
