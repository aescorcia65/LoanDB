import React, { useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

function NewRecord() {
    const navigate = useNavigate();
  
    // This function is responsible for navigation
    const HomePagenav = () => {
      navigate('/HomePage');
    };
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        date: '',
        amountOwed: '',
        nextPaymentDate: '',
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
    };

    return (
        <div className="container">
            <button onClick={HomePagenav}>Back</button>
            <h1 className="title">New Loan</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName">First Name  </label>
                    <input
                        type="text"
                        id="firstname"
                        placeholder=""
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Last Name  </label>
                    <input
                        type="text"
                        id="lastname"
                        placeholder=""
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="date">Date  </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="amountOwed">Loan Amount  </label>
                    <input
                        type="number"
                        id="amountowed"
                        placeholder="Initial Amount Owed"
                        name="amountOwed"
                        value={formData.amountOwed}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="nextPaymentDate">First Payment  </label>
                    <input
                        type="date"
                        id="nextPaymentDate"
                        name="nextPaymentDate"
                        value={formData.nextPaymentDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default NewRecord;
