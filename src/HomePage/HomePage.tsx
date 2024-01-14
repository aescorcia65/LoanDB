import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import HomeGrid from "./HomeGrid";
import ClientDropdown from "./ClientDropdown";
import MonthButtons from './MonthsButton';
import YearButtons from './YearButtons';
import StatusButtons from './StatusButtons';


function HomePage() {
    const navigate = useNavigate();
    const [selectedClient, setSelectedClient] = useState("*"); // State to store the selected client
    const [selectedMonths, setSelectedMonths] = useState(Array(12).fill(true));
    const [selectedYears, setSelectedYears] = useState(Array(11).fill(true));
    const [selectedstatuss, setSelectedstatuss] = useState(Array(2).fill(true));
    const [allToggle, setAllToggle] = useState(true)

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
    useEffect(() => {
        console.log(allToggle)
    }, [allToggle]);


    const handleToggle = () => {
         setAllToggle(!allToggle);
         setSelectedMonths(Array(12).fill(allToggle));
         setSelectedYears(Array(11).fill(allToggle));
         setSelectedstatuss(Array(2).fill(allToggle));
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


            <div className={"topbuttons"}>
                <button onClick={handleToggle}>*ALL*</button> <StatusButtons selectedstatuss={selectedstatuss} setSelectedstatuss={setSelectedstatuss}/>
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
