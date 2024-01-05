import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import GridTest from "./GridTest";
import ClientDropdown from "./ClientDropdown";
import LoanShark from './LoanShark.png';

function HomePage() {
    const navigate = useNavigate();
    const [selectedClient, setSelectedClient] = useState("*"); // State to store the selected client

    // This function is responsible for navigation to the NewRecord page
    const NewRecordnav = () => {
        navigate('/NewRecord');
    };

    // Function to handle the selection change in the ClientDropdown
    const handleClientSelection = (selectedValue: any) => {
        setSelectedClient(selectedValue); // Update the selected client in state
    };

    return (
        <div>
            <div className={"top-left-button"}>
                {/* Use the NewRecordnav function here for navigation */}
                <button onClick={NewRecordnav}>New Loan</button>
            </div>
            <div>
                <h1>LoanPro™
                    <img src={LoanShark} alt="Loan Shark"/>
                </h1>
            </div>
            <div
                className={"searchContainer"}>{/* Pass the handleClientSelection function as a prop to ClientDropdown */}
                <ClientDropdown onSelectClient={handleClientSelection}/>
            </div>
            <div className="recordContainer">
                {/* Pass the selectedClient as a prop to the GridTest component */}
                <GridTest selectedClient={selectedClient}/>
            </div>
        </div>
    );
}

export default HomePage;
