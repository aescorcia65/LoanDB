import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import GridTest from "./GridTest";
import ClientDropdown from "./ClientDropdown";
import LoanShark from './LoanShark.png';
import PayementsGrid from './PaymentsGrid';
import MonthsDropdown from './MonthDropdown';
import YearDropown from './YearDropdown';
import YearDropdown from './YearDropdown';

function HomePage() {
    const navigate = useNavigate();
    const [selectedClient, setSelectedClient] = useState("*"); // State to store the selected client

    // This function is responsible for navigation to the HomePage page
    const HomePagenav = () => {
        navigate('/');
    };

    // Function to handle the selection change in the ClientDropdown
    const handleClientSelection = (selectedValue: any) => {
        setSelectedClient(selectedValue); // Update the selected client in state
    };

    return (
        <div>
            <div className={"top-left-button"}>
                {/* Use the HomePagenav function here for navigation */}
                <button onClick={HomePagenav}>Back</button>
            </div>
            <div>
                <h1>Payments Due
                    <img src={LoanShark} alt="Loan Shark"/>
                </h1>
            </div>

            <div>
            
            <h5><MonthsDropdown />           <YearDropdown /></h5>
        </div>
            

            <div className="recordContainer">
                
                <PayementsGrid/>
            </div>
        </div>
    );
}

export default HomePage;
