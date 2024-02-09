import React, { useState } from 'react';
import '../HomePage/HomePage.css';
import { useNavigate } from 'react-router-dom';
import ClientDropdown from '../HomePage/ClientDropdown';
import LoanDropdown from '../HomePage/LoanDropdown';

function LoanInfo() {
    const navigate = useNavigate();
  
    // This function is responsible for navigation
    const HomePagenav = () => {
      navigate('/');
    };
    const [selectedClient, setSelectedClient] = useState("*");
    const [selectedLoan, setSelectedLoan] = useState("");
    const handleClientSelection = (selectedValue: any) => {
        setSelectedClient(selectedValue); // Update the selected client in state
    };
    const [formData, setFormData] = useState({
        name: "",
        maturitydate: "",
        issuedate: "",
        interestRate: "",
        paymentFrequency: 'Monthly',
        loanAmount: "",
        activeStatus: 'true',
        firstPayment: "",
        firstPaymentDate: "",
        recordType: 'Loan',
        paymentDueDate:"",
        paymentDue: "" ,
        newOrExisting: "New"
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if(formData.recordType === "Loan"){
            if(formData.newOrExisting === "New"){
                try {

                    // Construct the API URL
                    const apiUrl = `/api/new-client`;

                    // Prepare the request body
                    let requestBody = {
                        ClientName: formData.name
                    };

                    // Make the POST request
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody)
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    else{
                        let clientid = await response.json()
                        clientid = clientid.client_id
                        let loanBody:any = {
                            ClientId: clientid,
                            PaymentFrequency: formData.paymentFrequency,
                            LoanMaturity: formData.maturitydate,
                            LoanAmount: formData.loanAmount,
                            InterestRate: formData.interestRate || null,
                            ActiveStatus: formData.activeStatus,
                            IssueDate: formData.issuedate,

                        }
                        if(formData.paymentFrequency === "Manual"){
                            loanBody = {...loanBody,
                                FirstPaymentDueDate: formData.firstPaymentDate,
                                FirstPaymentDueAmount: formData.firstPayment,}
                        }
                        const apiLoanURL = `/api/new-loan`;
                        const loanres = await fetch(apiLoanURL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(loanBody)
                        });
                        if (!loanres.ok) {
                            throw new Error(`HTTP error! Status: ${loanres.status}`);
                        }
                        else{
                            navigate(`/`);
                        }
                    }

                } catch (error) {
                    console.error('Error fetching data:', error);
                    // Consider setting an error state and displaying it in the UI
                }
            }
            else if(formData.newOrExisting === "Existing"){
                let loanBody:any = {
                    ClientId: selectedClient,
                    PaymentFrequency: formData.paymentFrequency,
                    LoanMaturity: formData.maturitydate,
                    LoanAmount: formData.loanAmount,
                    InterestRate: formData.interestRate || null,
                    ActiveStatus: formData.activeStatus,
                    IssueDate: formData.issuedate,

                }
                if(formData.paymentFrequency === "Manual"){
                    loanBody = {...loanBody,
                        FirstPaymentDueDate: formData.firstPaymentDate,
                        FirstPaymentDueAmount: formData.firstPayment,}
                }
                const apiLoanURL = `/api/new-loan`;
                const loanres = await fetch(apiLoanURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loanBody)
                });
                if (!loanres.ok) {
                    throw new Error(`HTTP error! Status: ${loanres.status}`);
                }
                else{
                    navigate(`/`);
                }
            }
            }
        else if(formData.recordType === "Payment"){
            let paymentBody:any = {
                LoanId: selectedLoan,
                PaymentDueDate: formData.paymentDueDate,
                PaymentDueAmount: formData.paymentDue,
            }
            const apiLoanURL = `/api/new-payment`;
            const payres = await fetch(apiLoanURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentBody)
            });
            if (!payres.ok) {
                throw new Error(`HTTP error! Status: ${payres.status}`);
            }
            else{
                navigate(`/`);
            }

        }
    };

    function handleLoanSelect(selectedValue: any) {
        setSelectedLoan(selectedValue);
    }

    return (
        <div>
        <div className="sharkcage">
        


            <div className="container3">
                <button onClick={HomePagenav}>Cancel</button>

                <h1 className="title">{formData.recordType === "Loan" ? "Existing Loan" : "New Payment"}</h1>
                


                

                <form onSubmit={handleSubmit}>


                    {
                        formData.recordType === "Payment" && (
                            <div className="form-group">
                                <label>Client Name</label>
                                <ClientDropdown onSelectClient={handleClientSelection}/>
                            </div>
                        )
                    }


                    {
                        formData.recordType === "Loan" && formData.newOrExisting === "Existing" && (
                            <div className="form-group">
                                <label>Client Name</label>
                                <ClientDropdown onSelectClient={handleClientSelection}/>
                            </div>
                        )
                    }

                    {
                        formData.recordType === "Payment" && (
                            <div className="form-group">
                                <label>LoanID</label>
                                <LoanDropdown onSelectLoan={handleLoanSelect} clientId={selectedClient}/>
                            </div>
                        )
                    }


                    {
                        formData.recordType === "Payment" && (
                            <div className="form-group">
                                <label htmlFor="paymentDueDate">Payment Due Date </label>
                                <input
                                    type="date"
                                    id="paymentDueDate"
                                    name="paymentDueDate"
                                    value={formData.paymentDueDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}


                    {
                        formData.recordType === "Payment" && (
                            <div className="form-group">
                                <label htmlFor="paymentDue">Amount Due </label>
                                <input
                                    type="number"
                                    id="paymentDue"
                                    name="paymentDue"
                                    value={formData.paymentDue}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}


                    {
                        formData.recordType === "Loan" && formData.newOrExisting === "New" && (
                            <div className="form-group">
                                <label htmlFor="name">Name </label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder=""
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        )}

                    {
                        formData.recordType === "Loan" && (
                            <div className="form-group">
                                <label htmlFor="date">Loan Issue Date </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="issuedate"
                                    value={formData.issuedate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}


                    {
                        formData.recordType === "Loan" && (
                            <div className="form-group">
                                <label htmlFor="date">Loan Maturity Date </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="maturitydate"
                                    value={formData.maturitydate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}


                    {
                        formData.recordType === "Loan" && (
                            <div className="form-group">
                                <label htmlFor="loanAmount">Loan Amount </label>
                                <input
                                    type="number"
                                    id="loanAmount"
                                    placeholder=""
                                    name="loanAmount"
                                    value={formData.loanAmount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}


                    {
                        formData.recordType === "Loan" && (
                            <div className="form-group">
                                <label htmlFor="paymentFrequency">Payment Frequency </label>
                                <select
                                    id="paymentFrequency"
                                    name="paymentFrequency"
                                    value={formData.paymentFrequency}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Monthly">Monthly</option>
                                    <option value="Quarterly">Quarterly</option>
                                    <option value="Annually">Annually</option>
                                    <option value="Manual">MANUAL</option>

                                </select>
                            </div>
                        )
                    }


                    {
                        formData.paymentFrequency !== "Manual" && formData.recordType === "Loan" && (
                            <div className="form-group">
                                <label htmlFor="interestRate">Interest Rate Annual % </label>
                                <input
                                    type="number"
                                    id="interestRate"
                                    placeholder=""
                                    name="interestRate"
                                    value={formData.interestRate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )
                    }


                    {
                        formData.paymentFrequency === "Manual" && (
                            <div className="form-group">
                                <label htmlFor="firstPayment">Upcoming Payment Amount </label>
                                <input
                                    type="number"
                                    id="firstPayment"
                                    placeholder=""
                                    name="firstPayment"
                                    value={formData.firstPayment}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )
                    }


                    {
                        formData.paymentFrequency === "Manual" && (
                            <div className="form-group">
                                <label htmlFor="firstPaymentDate">Upcoming Payment Date </label>
                                <input
                                    type="date"
                                    id="firstPaymentDate"
                                    name="firstPaymentDate"
                                    value={formData.firstPaymentDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )
                    }


                    <button type="submit">Submit Changes</button>
                </form>
                
            </div>
            <div className='container3'>
                <h2>Current Principle Balance</h2>
                <h3>$1290 Dollars</h3>
                <h2>Current Interest Balance</h2>
                <h3>$220 Dollars</h3>
                <h2> Principle Paid</h2>
                <h3>$310 Dollars</h3>
                <h2> Interest Paid</h2>
                <h3>$50 Dollars</h3>
            </div>

            </div>
            
            <div className="container2">
                    <h2>Payments Made</h2>
            
            
            <div className="payment-record">
        <span className="record-field record-label">Date:</span>
        <span className="record-field record-date">2024-01-22</span>
        
        <span className="record-field record-label">Amount:</span>
        <span className="record-field record-amount">$34</span>
        
        <span className="record-field record-label">Notes:</span>
        <span className="record-field record-notes">Zelle (298417)</span>
    </div>  




    <div className="payment-record">
        <span className="record-field record-label">Date:</span>
        <span className="record-field record-date">2024-01-07</span>
        
        <span className="record-field record-label">Amount:</span>
        <span className="record-field record-amount">$123</span>
        
        <span className="record-field record-label">Notes:</span>
        <span className="record-field record-notes">Cash</span>
    </div>  




    <div className="payment-record">
        <span className="record-field record-label">Date:</span>
        <span className="record-field record-date">2024-02-02</span>
        
        <span className="record-field record-label">Amount:</span>
        <span className="record-field record-amount">$23.50</span>
        
        <span className="record-field record-label">Notes:</span>
        <span className="record-field record-notes">Zelle (124214)</span>
    </div>  



    </div> 




        </div>
    );
}

export default LoanInfo;
