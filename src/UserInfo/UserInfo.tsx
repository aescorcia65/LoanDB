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
        Name:"Marcus Cuch",
        InterestPaid: "10,0238423",
        InterestDue: "25,435,435,435",
        PrinciplePaid: "10,0238423",
        PrincipleDue: "25,435,435,435",
        LoanID: "LX32523, LX32423, LX64456"
    });
  
    // This function is responsible for navigation
    const HomePagenav = () => {
      navigate('/');
    };
    useEffect(() => {
        const fetchData = async () => {
            const apiUrl = `/api/user-info?client_id=${ClientId}`;
            try {
                const response = await fetch(apiUrl, {
                    method: 'GET', // If your API requires, adjust the method
                    headers: {
                        'Content-Type': 'application/json',
                        // Include other headers as required by your API
                        // For example, 'Authorization': 'Bearer <YourTokenHere>'
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();

                console.log(data); // Do something with the data
            } catch (error) {
                console.error("Failed to fetch data: ", error);
            }
        };

        fetchData();
    }, [ClientId]);
    return (
        <div>
        <div className="sharkcage">
        


            <div className="container4">
                <button onClick={HomePagenav}>Cancel</button>
                <h1>USER INFO</h1>

                <div className="payment-record">
                    <span className="record-field record-label">Name:</span>
                    <span className="record-field record-date">{}</span>

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
