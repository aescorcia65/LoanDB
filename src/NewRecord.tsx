import React, { useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

function NewRecord() {
    const navigate = useNavigate();
  
    // This function is responsible for navigation
    const HomePagenav = () => {
      navigate('/');
    };
    
    const [formData, setFormData] = useState({
        name: '',
        maturitydate: '',
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
                    <label htmlFor="amountOwed">Loan ID  </label>
                    <input
                        type="number"
                        id="loanID"
                        placeholder="loanID"
                        name="loanID"
                        value={formData.amountOwed}
                        onChange={handleChange}
                        required
                    />
                </div>

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

                <div className="form-group">
                    <label htmlFor="date">Loan Maturity Date  </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.maturitydate}
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
                    <label htmlFor="amountOwed">Interest Rate  </label>
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
                <label htmlFor="nextPaymentDate">Payment Frequency </label>
                <select
                id="nextPaymentDate"
                name="nextPaymentDate"
                value={formData.nextPaymentDate}
                onChange={handleChange}
                required
                >
                <option value="Monthly">Monthly  </option>
                <option value="Quarterly">Quarterly  </option>
                <option value="Annually">Annually</option>
                </select>
            </div>

                <div className="form-group">
                <label htmlFor="nextPaymentDate">Active Status </label>
                <select
                id="nextPaymentDate"
                name="nextPaymentDate"
                value={formData.nextPaymentDate}
                onChange={handleChange}
                required
                >
                <option value="yes">Yes</option>
                <option value="no">No</option>
                </select>
            </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default NewRecord;
