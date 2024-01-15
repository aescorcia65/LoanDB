import React, { useState } from 'react';
import '../HomePage/HomePage.css';
import { useNavigate } from 'react-router-dom';
import InfoGrid from '../RecordInfoPage/InfoGrid';
import LoanShark from '../LoanShark.png';
import PaymentTypeSelector from '../HomePage/PaymentSelectors';
import ClientDropdown from '../HomePage/ClientDropdown';
import LoanDropdown from '../HomePage/LoanDropdown';

function NewRecord() {
    const navigate = useNavigate();
  
    // This function is responsible for navigation
    const HomePagenav = () => {
      navigate('/');
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

        // Create the request body object with the form data
        const requestBody = {
            ClientName: formData.name,// Assuming the name format is "First Last"
            PaymentFrequency: formData.paymentFrequency,
            LoanMaturity: formData.maturitydate,
            IssueDate: formData.issuedate,
            LoanAmount: parseFloat(formData.loanAmount),
            InterestRate: parseFloat(formData.interestRate),
            ActiveStatus: formData.activeStatus === "true",
            // FirstPaymentDueDate : formData.firstPaymentDate,
            // FirstPaymentDueAmount : formData.firstPayment
            
        };

      

        try {
            console.log(requestBody)
            // Send a POST request with the request body
            const response = await fetch('/api/new-loan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                // Handle success here, e.g., show a success message or redirect
                console.log('Record created successfully');
                navigate('/')
            } else {
                // Handle errors here, e.g., show an error message
                console.error('Error creating record:', response.status);
            }
        } catch (error) {
            console.error('Error creating record:', error);
        }
    };

    return (
        <div>
        <div className="sharkcage">
        {/* <img src={LoanShark} alt="Loan Shark" /> */}
        </div>
        
   
        <div className="container2">
            <button onClick={HomePagenav}>Cancel</button>
            
            <h1 className="title">New Loan</h1>
            <div className="form-group6">
                <label htmlFor="recordType">Loan or Payment </label>
                <select
                id="recordType"
                name="recordType"
                value={formData.recordType}
                onChange={handleChange}
                required
                >
                <option value="Loan">Loan  </option>
                <option value="Payment">Payment  </option>
                

                </select>
            </div>
            
            
            
            {
    formData.recordType === "Loan" && (
            <div className="form-group7">
                <label htmlFor="newOrExisting">New or Existing Client </label>
                <select
                id="newOrExisting"
                name="newOrExisting"
                value={formData.newOrExisting}
                onChange={handleChange}
                required
                >
                <option value="New">New  </option>
                <option value="Existing">Existing  </option>
                

                </select>
            </div>
    )}

            <form onSubmit={handleSubmit}>
                

            {
    formData.recordType === "Payment" && (
        <div className="client-name-row"> 
            <span>Client Name</span>
            <ClientDropdown onSelectClient={function (clientId: string): void {
                throw new Error('Function not implemented.');
            } }/>
        </div>
    )
}


{
    formData.recordType === "Loan" && formData.newOrExisting == "Existing" && (
        <div className="client-name-row"> 
            <span>Client Name</span>
            <ClientDropdown onSelectClient={function (clientId: string): void {
                throw new Error('Function not implemented.');
            } }/>
        </div>
    )
}

{
    formData.recordType === "Payment" && (
        <div className="client-name-row2"> 
            <span>LoanID</span>
            <LoanDropdown onSelectLoan={function (loanId: string): void {
                throw new Error('Function not implemented.');
            } }/>
        </div>
    )
}


            {
    formData.recordType === "Payment" && (
                <div className="form-group9">
                    <label htmlFor="paymentDueDate">Payment Due Date  </label>
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
                <div className="form-group22">
                    <label htmlFor="paymentDue">Amount Due   </label>
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
    formData.recordType === "Loan" && formData.newOrExisting == "New" &&(
                <div className="form-group">
                    <label htmlFor="name">Name  </label>
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
                <div className="form-group2">
                    <label htmlFor="date">Loan Issue Date  </label>
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
                <div className="form-group3">
                    <label htmlFor="date">Loan Maturity Date  </label>
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
                <div className="form-group4">
                    <label htmlFor="loanAmount">Loan Amount  </label>
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
                <div className="form-group16">
                <label htmlFor="paymentFrequency">Payment Frequency </label>
                <select
                id="paymentFrequency"
                name="paymentFrequency"
                value={formData.paymentFrequency}
                onChange={handleChange}
                required
                >
                <option value="Monthly">Monthly  </option>
                <option value="Quarterly">Quarterly  </option>
                <option value="Annually">Annually</option>
                <option value="Manual">MANUAL</option>

                </select>
            </div>
    )
}




            {
    formData.paymentFrequency !== "Manual" && formData.recordType == "Loan" && (
        <div className="form-group5">
            <label htmlFor="interestRate">Interest Rate   </label>
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
        <div className="form-group5">
            <label htmlFor="firstPayment">First Payment  </label>
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
        <div className="form-group3">
        <label htmlFor="firstPaymentDate">First Payment Date  </label>
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



                

                <button type="submit">Submit</button>
            </form>
        </div>
        </div>
    );
}

export default NewRecord;
