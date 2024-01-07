import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import GridTest from "./GridTest";
import ClientDropdown from "./ClientDropdown";
import LoanShark from './LoanShark.png';
import PayementsGrid from './PaymentsGrid';
 

function Help() {
    const navigate = useNavigate();
   
    const HomePagenav = () => {
        navigate('/');
    };
   

    return (
        <div>
            <div className={"top-left-button"}>
                {/* Use the HomePagenav function here for navigation */}
                <button onClick={HomePagenav}>Back</button>
            </div>
            <div>
                <h1>
                    <img src={LoanShark} alt="Loan Shark"/>
                </h1>
            </div>
            {/* <div
                className={"searchContainer"}>
                <ClientDropdown onSelectClient={handleClientSelection}/>
            </div> */}
            <div className="recordContainer">
                <h1> Hello User, Welcome to LoanPro™</h1>
                <h3>Home Page will show you every loan you have ever entered, active or not. You can click on the column headers to sort or filter any field that you desire </h3>
               <h3>New Loan page allows you enter loanee informtion, then hit submit to create a new entry</h3>
               <h3>Upcoming Payments will show you every auto generated interest payment. These Payments are auto generated when the loan is created, and every time a payment is received in full.</h3>
               <h4>For assistance contact ADMIN call or text 516-946-1116</h4>
            </div>
        </div>
    );
}

export default Help;
