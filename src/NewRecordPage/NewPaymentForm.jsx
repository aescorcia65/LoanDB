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
        setSelectedClient(selectedValue);
        setFormData(prevFormData => ({
            ...prevFormData,
            ClientId: selectedValue
        }));
    };

    function getNewYorkDateISO() {
        const now = new Date();
        const localTimeOffset = now.getTimezoneOffset() * 60000;
        const newYorkOffset = -300 * 60000; // Adjust for EST; consider daylight saving time as well
        const newYorkDate = new Date(now.getTime() - localTimeOffset + newYorkOffset);
        return newYorkDate.toISOString().split('T')[0];
    }

    const [formData, setFormData] = useState({
        LoanId: selectedLoan,
        ClientId: selectedClient,
        PaymentDueDate: getNewYorkDateISO(),
        PaymentDueAmount: ""

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        // Assuming you have an API endpoint '/api/submit-form' and formData is your data to submit
        const apiEndpoint = '/api/new-payment';

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Assuming you're sending JSON data
                    // Include other headers as needed
                },
                body: JSON.stringify(formData), // Convert your data to a JSON string
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json(); // Assuming the server responds with JSON data
            console.log(result); // Process your result here
            navigate('/');

            // Handle success, e.g., show a success message, redirect, etc.
        } catch (error) {
            console.error('Error:', error);
            // Handle errors, e.g., show an error message
        }
    };

    function handleLoanSelect(selectedValue) {
        setSelectedLoan(selectedValue);
        setFormData(prevFormData => ({
            ...prevFormData,
            LoanId: selectedValue
        }));
    }

    return (
        <div>


                <form onSubmit={handleSubmit}>



                            <div className="form-group">
                                <label>Client Name</label>
                                
                                <div className="clientdrop">
                                <ClientDropdown onSelectClient={handleClientSelection}/>
                                </div>
                            </div>




                            <div className="form-group">
                                <label>LoanID</label>
                                <LoanDropdown onSelectLoan={handleLoanSelect} clientId={selectedClient}/>
                            </div>




                            <div className="form-group">
                                <label htmlFor="PaymentDueDate">Payment Due Date </label>
                                <input
                                    type="date"
                                    id="PaymentDueDate"
                                    name="PaymentDueDate"
                                    value={formData.PaymentDueDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>




                            <div className="form-group">
                                <label htmlFor="PaymentDueAmount">Amount Due </label>
                                <input
                                    type="number"
                                    id="PaymentDueAmount"
                                    name="PaymentDueAmount"
                                    value={formData.PaymentDueAmount}
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
