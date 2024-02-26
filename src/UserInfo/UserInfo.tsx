import React, {useEffect, useState} from 'react';
import '../HomePage/HomePage.css';
import {useLocation, useNavigate} from 'react-router-dom';
import ClientDropdown from '../HomePage/ClientDropdown';
import LoanDropdown from '../HomePage/LoanDropdown';


function UserInfo() {
    const navigate = useNavigate();
    const location = useLocation(); // Use useParams hook here
    const queryParams = new URLSearchParams(location.search);
    const ClientId = queryParams.get('ClientId');// Access loanId from params
    const [UserInfo, setUserInfo] = useState({
        penis:"balls",

    });
  
    // This function is responsible for navigation
    const HomePagenav = () => {
      navigate('/');
    };
    useEffect(() => {

    }, [ClientId]);
    return (
        <div>
        <div className="sharkcage">
        


            <div className="container4">
                <button onClick={HomePagenav}>Cancel</button>
                <h1>USER INFO</h1>

                <div className="payment-record">
                    <span className="record-field record-label">Name:</span>
                    <span className="record-field record-date">{UserInfo.penis}</span>

                    <span className="record-field record-label">Total Interest Paid</span>
                    <span className="record-field record-amount">$34</span>

                    <span className="record-field record-label">Total Interest Due</span>
                    <span className="record-field record-notes">$20,000</span>

                    <span className="record-field record-label">Total Principal Paid</span>
                    <span className="record-field record-notes">$20,000</span>

                    <span className="record-field record-label">Total Principal Due</span>
                    <span className="record-field record-notes">$20,000</span>

                    <span className="record-field record-label">Current Loans</span>
                    <span className="record-field record-notes">LX3422, LX3647, LX2375</span>

                </div>

            </div>
        </div>
        </div>
    );
}

export default UserInfo;
