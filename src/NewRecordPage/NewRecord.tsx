import React, { useState } from 'react';
import '../HomePage/HomePage.css';
import { useNavigate } from 'react-router-dom';
import ClientDropdown from '../HomePage/ClientDropdown';
import LoanDropdown from '../HomePage/LoanDropdown';
import NewLoanForm from "./NewLoanForm";
import NewPaymentForm from "./NewPaymentForm";

function NewRecord() {
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
        issueDate: new Date().toISOString().split('T')[0],
        interestRate: "",
        paymentFrequency: 'Monthly',
        loanAmount: "",
        activeStatus: 'true',
        firstPayment: "",
        firstPaymentDate: "",
        recordType: 'Loan',
        paymentDueDate:"",
        paymentDue: "" ,
        newOrExisting: "New",
        interestAmount: undefined,
        interestType: undefined,
        maturityType: undefined,
        maturityPeriod: undefined,
        loanLength: undefined,
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: any) => {
        console.log(formData)

    };

    function handleLoanSelect(selectedValue: any) {
        setSelectedLoan(selectedValue);
    }

    return (
        <div>


            <div className="container2">
                <button onClick={HomePagenav}>Cancel</button>

                <h1 className="title">{formData.recordType === "Loan" ? "New Loan" : "New Payment"}</h1>
                <div className="form-group">
                    <label htmlFor="recordType">Loan or Payment </label>
                    <select
                        id="recordType"
                        name="recordType"
                        value={formData.recordType}
                        onChange={handleChange}
                        required
                    >
                        <option value="Loan">Loan</option>
                        <option value="Payment">Payment</option>


                    </select>
                </div>

                {formData.recordType === "Loan" &&(
                    <NewLoanForm/>
                )

                }

                {formData.recordType === "Payment" &&(
                    <NewPaymentForm/>
                )

                }


            </div>
        </div>
);
}

export default NewRecord;
