import React, { useState } from 'react';
import '../HomePage/HomePage.css';
import { useNavigate } from 'react-router-dom';
import ClientDropdown from '../HomePage/ClientDropdown';
import LoanDropdown from '../HomePage/LoanDropdown';

function NewPaymentForm() {
    const navigate = useNavigate();

    // This function is responsible for navigation
    const HomePagenav = () => {
        navigate('/');
    };
    const [selectedClient, setSelectedClient] = useState("*");
    const [selectedLoan, setSelectedLoan] = useState("");
    const handleClientSelection = (selectedValue) => {
        setSelectedClient(selectedValue); // Update the selected client in state
    };
    const [formData, setFormData] = useState({
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(formData)

    };

    function handleLoanSelect(selectedValue) {
        setSelectedLoan(selectedValue);
    }

    return (
        <div>


                <form onSubmit={handleSubmit}>



                            <div className="form-group">
                                <label>Client Name</label>
                                <ClientDropdown onSelectClient={handleClientSelection}/>
                            </div>




                            <div className="form-group">
                                <label>LoanID</label>
                                <LoanDropdown onSelectLoan={handleLoanSelect} clientId={selectedClient}/>
                            </div>




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



                    <button type="submit">Submit</button>
                </form>
        </div>
    );
}

export default NewPaymentForm;
