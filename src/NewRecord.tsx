import React, { useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import InfoGrid from './InfoGrid';
import LoanShark from './LoanShark.png';

function NewRecord() {
    const navigate = useNavigate();
  
    // This function is responsible for navigation
    const HomePagenav = () => {
      navigate('/');
    };
    
    const [formData, setFormData] = useState({
        name: '',
        maturitydate: '',
        interestRate: '',
        paymentFrequency: '',
        loanAmount: ','
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
        <div>
        <div className="sharkcage">
        <img src={LoanShark} alt="Loan Shark" />
        </div>
        
   
        <div className="container2">
            <button onClick={HomePagenav}>Back</button>
            <h1 className="title">New Loan</h1>
            <form onSubmit={handleSubmit}>
                

               

                
            

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
                    <label htmlFor="loanAmount">Loan Amount  </label>
                    <input
                        type="number"
                        id="loanAmount"
                        placeholder="loanAmount"
                        name="loanAmount"
                        value={formData.loanAmount}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="interestRate">Interest Rate  </label>
                    <input
                        type="number"
                        id="interestRate"
                        placeholder="interestRate"
                        name="interestRate"
                        value={formData.interestRate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
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
                </select>
            </div>

                <div className="form-group">
                <label htmlFor="paymentFrequency">Active Status </label>
                <select
                id="paymentFrequency"
                name="paymentFrequency"
                value={formData.paymentFrequency}
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
        </div>
    );
}

export default NewRecord;
