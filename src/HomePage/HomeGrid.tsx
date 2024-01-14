import React, {useEffect, useState, useRef, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColGroupDef } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import './HomePage.css';


function HomeGrid({ selectedClient, selectedMonths, selectedYears, selectedStatus }:any) {
    const [rowData, setRowData] = useState([]);
    const navigate = useNavigate();
    const [gridApi, setGridApi] = useState(null);

    const columnDefs: ColGroupDef[] = [
        {
            headerName: 'LoanInformation',

            children: [
                { field: 'LoanID', width: 204, filter: true, autoHeight:true},
                { field: 'Name', width: 204, filter: true, autoHeight:true },
                { field: 'Principal', filter: true, width: 204 ,columnGroupShow: 'open', autoHeight:true },
                { field: 'Due' , filter: true, width: 204, columnGroupShow: 'open', autoHeight:true},
                { field: 'Issued', filter: true, width: 204, columnGroupShow: 'open', autoHeight:true},
                { field: 'Status', editable:true, filter: true, width: 204,  columnGroupShow: 'open', autoHeight:true },
            ],
        },
        {
            headerName: 'UpcomingPayments',
            children: [
                { field: 'PaymentDue', filter: true, width: 204 },
                { field: 'DueDate' ,  width: 204},
                { field: 'PaymentReceived', filter: true, editable:true, width: 204 },
                { field: 'PaymentReceivedDate', filter: true, editable:true, width: 204},
                { field: 'PaymentStatus', filter: true, editable:true, width: 204},
            ]
        },
    ];

    // This function maps the API response to the grid's data format
    const mapApiResponseToGridFields = (apiData:any) => {
        return apiData.map((item:any) => ({
            LoanID: item.LoanId,
            Due: item.LoanMaturity,
            Issued: item.IssueDate,
            Status: Boolean(item.ActiveStatus),
            Name: item.ClientName,
            Principal: item.LoanAmount,
            PaymentDue: item.PaymentDueAmount,
            DueDate: item.PaymentDueDate,
            PaymentReceived: item.PaymentRecAmount,
            PaymentReceivedDate: item.PaymentRecDate,
            PaymentStatus: Boolean(item.PaidStatus)
        }));
    };

    // Fetch data whenever selectedClient, selectedMonths, or selectedYears changes
    useEffect(() => {
        console.log(selectedYears);
        console.log(selectedMonths);

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


                // Construct the API URL
                const apiUrl = `/api/filter-data`;

                // Prepare the request body
                const requestBody = {
                    Months: mappedMonths,
                    Years: mappedYears,
                    ActiveStatus: selectedStatus  // Assuming you have this variable in your state
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
                    setRowData(mapApiResponseToGridFields(apiData.results));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Consider setting an error state and displaying it in the UI
            }
        };

        fetchData();
    }, [selectedMonths, selectedYears, gridApi, selectedStatus]);

    // Handle updating active status
    const updateActiveStatus = async (event:any) => {
        const { LoanID, Status } = event.data;
        try {
            const response = await fetch(`/api/active-status?loan_id=${LoanID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ActiveStatus: Status })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log('Record updated successfully');
        } catch (error) {
            console.error('Error updating record:', error);
            // Handle the error in the UI
        }
    };

    // Handle row click navigation
    const handleRowClick = (event:any) => {
        navigate(`/recordInfo?loanId=${event.data.LoanID}`);
    };

    const onGridReady = useCallback((params:any) => {
        setGridApi(params.api);
        // You can now safely use gridApi here if needed
    }, []);

    return (
        <div className="ag-theme-balham" style={{ width: '100%', height: '100%' }}>
            <AgGridReact
                onGridReady={onGridReady}
                rowData={rowData}
                columnDefs={columnDefs}
                onRowClicked={handleRowClick}
                onCellEditingStopped={updateActiveStatus}
            />
        </div>
    );
}

export default HomeGrid;
