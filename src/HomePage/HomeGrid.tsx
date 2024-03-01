import React, {useCallback, useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {ColDef, GridOptions} from 'ag-grid-community';
import {useNavigate} from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import './HomePage.css';
import ClosePaymentModal from "./ClosePaymentModal";
import {FaRegTrashCan} from "react-icons/fa6";
import DeletePaymentModal from './DeletePaymentModal';


function HomeGrid({ selectedClient, selectedMonths, selectedYears, selectedStatus, tdyToggle }:any) {
    const [rowData, setRowData] = useState([]);
    const navigate = useNavigate();
    const [gridApi, setGridApi] = useState(null);
    const [updateCount, setUpdateCount]= useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


    const [currentEdit, setCurrentEdit] = useState(null);

    const gridOptions: GridOptions<any> = {
        dataTypeDefinitions: {

            date: {
                extendsDataType: 'date',
                baseDataType: 'date',
                valueFormatter: (params: any) => {
                    if (!params.value) {
                        return '';
                    }

                    let date;
                    if (typeof params.value === "string" && params.value.includes('-') && params.value.length ===10) {
                        // Manually construct the date to ensure it's treated as local time
                        const parts = params.value.split('-');
                        if (parts.length === 3) {
                            // Adjusting for local time zone explicitly by adding "T00:00:00"
                            const adjustedDateString = `${parts[0]}-${parts[1]}-${parts[2]}T00:00:00`;
                            date = new Date(adjustedDateString);
                        }
                        else {date = new Date("1888-1-1")}
                    } else {
                        // For full string dates, the Date constructor handles timezone automatically
                        date = new Date(params.value);
                    }

                    if (!isNaN(date.getTime())) { // Check if the date is valid
                        // Format the date to MM/DD/YYYY with leading zeros for month and day
                        const formattedDate = (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
                            date.getDate().toString().padStart(2, '0') + '/' +
                            date.getFullYear();
                        return formattedDate;
                    } else {
                        return 'Invalid Date Format'; // Handle invalid date formats
                    }
                }

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

    const deleteIconCellRenderer = () => {
        return <FaRegTrashCan />;
    };

    const columnDefs: ColDef[] = [

        { headerName: '',field: 'Delete', width: 30 ,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text', cellRenderer : deleteIconCellRenderer  },
        { headerName: 'Name',field: 'Name', width: 122, autoHeaderHeight: true, filter: true, autoHeight:true , cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text' },
        { headerName: 'LX ID', field: 'LoanID', headerClass: 'thick-border', width: 122, filter: true, autoHeight:true, cellStyle: {'padding-left': 4 ,'border-right': '2px solid', 'border-bottom': '1px solid'}},
        { headerName: 'Remaining Principle', field: 'remainingPrinciple', headerClass: 'thick-border', width: 122, filter: true, autoHeight:true, cellStyle: {'padding-left': 4 ,'border-right': '2px solid', 'border-bottom': '1px solid'}},
        { headerName: 'Principle Payment Received',  field: 'PrinciplePaymentReceived', filter: true, editable:true, width: 122,  cellStyle: {'background-color': "#fbfce1", 'padding-left': 4 ,'border-right': '1px solid', 'border-left': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text'},
        { headerName: 'Interest Payment Due Date', autoHeaderHeight: true, field: 'DueDate' , headerClass: 'wrap-header-text', width: 122,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, cellDataType:'date' },
        { headerName: 'Interest Payment Expected', autoHeaderHeight: true, field: 'PaymentDue', filter: true, width: 122,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text'},
        { headerName: 'Interest Payment Received', field: 'PaymentReceived', filter: true, editable:true, width: 122,  cellStyle: {'background-color': "#fbfce1", 'padding-left': 4 ,'border-right': '1px solid','border-left': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text',},
       
        
        { headerName: 'Notes', field: 'Notes', filter: true, editable:true, width: 122,  cellStyle: {'background-color': "#fbfce1", 'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text'},
        { headerName: 'Interest Payment Received Date', field: 'PaymentReceivedDate', filter: true, editable:true, width: 127,  cellStyle: {'background-color': "#fbfce1", 'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, cellDataType:'date', headerClass: 'wrap-header-text',},
        { headerName: 'Closed',field: 'Closed', filter: true, editable:(params) => {
                // Check if the "Closed" field is true or 1
                return !(params.data.Closed || params.data.Closed === 1);
            }, width: 95  ,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text'  },
        { headerName: 'Loan Amt', field: 'Principal',  filter: true, width: 122 ,columnGroupShow: 'open', autoHeight:true,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text' },
        { headerName: 'Loan Issue Date',field: 'Issued', filter: true, width: 122, columnGroupShow: 'open', autoHeight:true,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, cellDataType:'date', headerClass: 'wrap-header-text' },
        { headerName: 'Loan Maturity Date',field: 'Due' , filter: true, width: 122, columnGroupShow: 'open', autoHeight:true,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, cellDataType:'date', headerClass: 'wrap-header-text' },
        { headerName: 'Interest Amount', field: 'InterestRate', filter: true, width: 122, columnGroupShow: 'open', autoHeight:true,  cellStyle: {'padding-left': 4 ,'border-right': '1px solid', 'border-bottom': '1px solid'}, headerClass: 'wrap-header-text'},
        { headerName: 'Payment Freq',field: 'PaymentFreq', filter: true, width: 122, columnGroupShow: 'open', autoHeight:true,  cellStyle: {'padding-left': 4 ,'border-right': '2px solid', 'border-bottom': '1px solid'}, headerClass: 'thick-border'},
       
    ];

    function maturityDate(issueDate:any, loanLength:any, paymentFreq:any) {
        // Create a new Date object from the issueDate
        let maturityDate = new Date(issueDate);

        if (paymentFreq === "Monthly") {
            // Add the loanLength in months to the issueDate
            maturityDate.setMonth(maturityDate.getMonth() + loanLength);
        } else if (paymentFreq === "Weekly") {
            // Add the loanLength in weeks to the issueDate
            // 7 days per week
            maturityDate.setDate(maturityDate.getDate() + (loanLength * 7));
        } else {
            throw new Error("Invalid payment frequency. Please use 'Monthly' or 'Weekly'.");
        }

        // Return the maturity date as a string in YYYY-MM-DD format
        return maturityDate.toISOString().split('T')[0];
    }

    // This function maps the API response to the grid's data format
    const mapApiResponseToGridFields = (apiData:any) => {
        return apiData.map((item:any) => ({
            LoanID: item.LoanId,
            Due: maturityDate(item.IssueDate, item.LoanLength, item.PaymentFrequency),
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
            ClientId: item.ClientId,
            PaymentFreq: item.PaymentFrequency,
            InterestRate: item.InterestAmount != null ? `${item.InterestAmount}$` : null,
            remainingPrinciple: item.PrincipalRemaining != null ? `$${item.PrincipalRemaining}` : item.PrincipalRemaining,
            Notes: item.Notes,
            PrinciplePaymentReceived: item.PrincipalPaymentRec != null ? `$${item.PrincipalPaymentRec}` : item.PrincipalPaymentRec
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
                    ClientId: selectedClient,
                    TdyToggle: tdyToggle,
                    TdyDate: new Date().toISOString().split('T')[0]
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
                            // Check paid status to group not paid and paid separately
                            if (!a.PaidStatus && b.PaidStatus) {
                                return -1; // a (not paid) comes before b (paid)
                            } else if (a.PaidStatus && !b.PaidStatus) {
                                return 1; // b (not paid) comes before a (paid)
                            } else {
                                // If both have the same paid status, sort by date from newest to oldest
                                // Assuming PaymentDate is a date string or a Date object that can be compared directly
                                const dateA:any = new Date(a.IssueDate);
                                const dateB:any = new Date(b.IssueDate);
                                return dateB - dateA; // Sorts descending by date
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




    const handleConfirmDelete = () => {
        // Perform the update logic here using currentEdit
        console.log("Delete Confirmed", currentEdit);
        deletePayment(currentEdit)

        // Close the modal
        setIsDeleteModalOpen(false);

    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setCurrentEdit(null)
        setUpdateCount(updateCount => updateCount+1)
    };

    const handleConfirmUpdate = (nextInterestPayment:any) => {
        console.log("Update Confirmed", currentEdit);
        console.log("Next Interest Payment:", nextInterestPayment);
        console.log("Next Interest Payment2:", nextInterestPayment);
        // You can now use nextInterestPayment as part of your update logic

        updatePayment(currentEdit, nextInterestPayment); // Modify updatePayment to accept this value

        setIsModalOpen(false);
    };

    const handleCancelUpdate = () => {
        setIsModalOpen(false);
        setCurrentEdit(null)
        setUpdateCount(updateCount => updateCount+1)
    };
    const updateRecordd = useCallback((event:any) => {
        if(event.column.colDef.field === "Closed"){
        setCurrentEdit(event);
        setIsModalOpen(true);}

        else{

        }
    }, []);

   async function deletePayment(event:any) {

    const apiUrl = `/api/delete-payment`;

    const requestBody = {
        
        LoanId: event.data.LoanID,
        PaymentId: event.data.PaymentId
        
    };

    const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    else{setUpdateCount(updateCount => updateCount+1)}





   }

    async function updatePayment(event:any, newExpectedPayment:any) {
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
                PaidStatus: event.data.Closed,
                PrinciplePaymentReceived: event.data.PrinciplePaymentReceived != null ? parseFloat(event.data.PrinciplePaymentReceived.replace("$", "")) : null,
                Notes: event.data.Notes,
                PrincipalRemaining: event.data.remainingPrinciple != null ? parseFloat(event.data.remainingPrinciple.replace("$","")) : null,
                NewExpectedPayment: newExpectedPayment


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
            else{setUpdateCount(updateCount => updateCount+1)}

        } catch (error) {
            console.error('Error fetching data:', error);
            // Consider setting an error state and displaying it in the UI
        }

    }

    function cellClicked(event:any) {
        if(event.colDef.field === "Name"){
            navigate(`/UserInfo?ClientId=${event.data.ClientId}`);
        }
        else if(event.colDef.field === "LoanID"){
            navigate(`/LoanInfo?LoanId=${event.data.LoanID}`);
        }
        else if(event.colDef.field === "Delete"){
            setCurrentEdit(event);
            setIsDeleteModalOpen(true);
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
                onCellClicked={cellClicked}
            />
            <ClosePaymentModal
                isOpen={isModalOpen}
                onConfirm={handleConfirmUpdate}
                onCancel={handleCancelUpdate}
            />
            <DeletePaymentModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
}

export default HomeGrid;
