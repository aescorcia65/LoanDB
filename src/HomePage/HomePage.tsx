import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import HomeGrid from "./HomeGrid";
import ClientDropdown from "./ClientDropdown";
import MonthButtons from './MonthsButton';
import YearButtons from './YearButtons';

function HomePage() {
    const navigate = useNavigate();
    const [selectedClient, setSelectedClient] = useState("*"); // State to store the selected client
    const [selectedMonths, setSelectedMonths] = useState(Array(12).fill(false));
    const [selectedYears, setSelectedYears] = useState(Array(11).fill(false));

    // This function is responsible for navigation to the NewRecord page
    const NewRecordnav = () => {
        navigate('/NewRecord');
    };
    const UpcomingPaymentsNav = () => {
        navigate('/UpcomingPayments');
    };

    const HelpNav = () => {
        navigate('/Help');
    };

    // Function to handle the selection change in the ClientDropdown
    const handleClientSelection = (selectedValue: any) => {
        setSelectedClient(selectedValue); // Update the selected client in state
    };

    return (
        <div>
            
           
            <div className={"top-left-button"}>
                
                <button onClick={NewRecordnav}>New Loan / New Payment</button>
                
                    
               
                
            </div>

            <div>
                <h1>LMS - Loan Management System
    </h1>
            </div>
            
            
            <div className={"monthbuttons"}>
                <MonthButtons selectedMonths={selectedMonths} setSelectedMonths={setSelectedMonths}/>
            </div>
            <div className={"yearbuttons"}>
                <YearButtons selectedYears={selectedYears} setSelectedYears={setSelectedYears}/>
            </div>
            <div className="recordContainer">
                {/* Pass the selectedClient as a prop to the HomeGrid component */}
                <HomeGrid selectedClient={selectedClient} selectedMonths={selectedMonths} selectedYears={selectedYears}/>
            </div>
        </div>
    );
}

export default HomePage;
