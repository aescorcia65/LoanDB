import React, { useState } from 'react';
import '../HomePage/HomePage.css';
import { useNavigate } from 'react-router-dom';
import ClientDropdown from '../HomePage/ClientDropdown';
import LoanDropdown from '../HomePage/LoanDropdown';
import NewLoanModal from '../HomePage/NewLoanModal';

function NewLoanForm() {

    const [isNewLoanModalOpen, setisNewLoanModalOpen] = useState(false);


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
        InterestAmount: undefined,
        IssueDate: getNewYorkDateISO(),
        LoanAmount: undefined,
        LoanLength: undefined,
        Name: undefined,
        PaymentFrequency: "Monthly",
        Type: "New",
        ClientId: selectedClient

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleConfirmDelete = () => {
        
        deletePayment(currentEdit)

        // Close the modal
        setIsDeleteModalOpen(false);

    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        // Assuming you have an API endpoint '/api/submit-form' and formData is your data to submit
        const apiEndpoint = '/api/new-loan';
        navigate('/');

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

            // Handle success, e.g., show a success message, redirect, etc.
        } catch (error) {
            console.error('Error:', error);
            // Handle errors, e.g., show an error message
        }
    };


    function handleLoanSelect(selectedValue) {
        setSelectedLoan(selectedValue);
    }

    function getNewYorkDateISO() {
        const now = new Date();
        const localTimeOffset = now.getTimezoneOffset() * 60000;
        const newYorkOffset = -300 * 60000; // Adjust for EST; consider daylight saving time as well
        const newYorkDate = new Date(now.getTime() - localTimeOffset + newYorkOffset);
        return newYorkDate.toISOString().split('T')[0];
    }

    return (
        <div>

                <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="Type">New or Existing Client </label>
                                <select
                                    id="Type"
                                    name="Type"
                                    value={formData.Type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="New">New</option>
                                    <option value="Existing">Existing</option>


                                </select>
                            </div>

                    <div className="form-group">
                        {formData.Type === "Existing" ? (
                            <>
                                <label htmlFor={"Name"}>Client Name</label>
                                <ClientDropdown onSelectClient={handleClientSelection} />
                            </>
                        ) : (
                            <>
                                <label htmlFor="Name">Name</label>
                                <input
                                    type="text"
                                    id="Name"
                                    name="Name"
                                    value={formData.Name}
                                    onChange={handleChange}
                                    required
                                />
                            </>
                        )}
                    </div>



                    <div className="form-group">
                                <label htmlFor="date">Loan Issue Date </label>
                                <input
                                    type="date"
                                    id="IssueDate"
                                    name="IssueDate"
                                    value={formData.IssueDate || getNewYorkDateISO()}
                                    onChange={handleChange}
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label htmlFor="LoanAmount">Loan Amount (Principle)</label>
                                <input
                                    type="number"
                                    id="LoanAmount"
                                    placeholder=""
                                    name="LoanAmount"
                                    value={formData.LoanAmount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>




                            <div className="form-group">
                                <label htmlFor="PaymentFrequency">Interest Payment Frequency </label>
                                <select
                                    id="PaymentFrequency"
                                    name="PaymentFrequency"
                                    value={formData.PaymentFrequency}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Monthly">Monthly</option>
                                    <option value="Weekly">Weekly</option>


                                </select>
                            </div>



                            <div className="form-group">
                                <label htmlFor="LoanLength">Loan Length</label>
                                <input
                                    type="number"
                                    id="LoanLength"
                                    placeholder=""
                                    name="LoanLength"
                                    value={formData.LoanLength}
                                    onChange={handleChange}
                                    required
                                />
                            </div>




                            <div className="form-group">
                                <label htmlFor="InterestAmount">Interest Payment Amount</label>
                                <input
                                    type="number"
                                    id="InterestAmount"
                                    placeholder=""
                                    name="InterestAmount"
                                    value={formData.InterestAmount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>


                    <button type={"submit"}>Submit</button>
                </form>
        </div>
    );
}

export default NewLoanForm;
