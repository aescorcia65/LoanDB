import './HomePage.css';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import InfoGrid from './InfoGrid';
import LoanShark from './LoanShark.png';
import {useEffect, useState} from "react";

function RecordInfo() {
    const location = useLocation(); // Use useParams hook here
    const queryParams = new URLSearchParams(location.search);
    const loanId = queryParams.get('loanId');// Access loanId from params
    console.log(loanId)
    const [loanInfo, setLoanInfo] = useState<any>({
        ClientName: "NULL",
        RecordID: loanId
    });


    const navigate = useNavigate();


    useEffect(() => {
        async function fetchData() {
            try {
                // Construct the API URL based on the selected client
                const apiUrl = `/api/search-by-record-id?record_id=${loanId}`;
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const apiData = await response.json();
                if (apiData.results && apiData.results.length > 0) {
                    setLoanInfo(apiData.results[0]);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [loanId]);

    // Navigation function to go back to the home page
    const navigateToHomePage = () => {
        navigate('/');
    };


    return (
        <div className="header-container">
            
            <div className="top-middle-button3">
            <button onClick={navigateToHomePage}>Back</button>
                <button>Edit Payment</button>
                <button>Add Payment</button>
                <img src={LoanShark} alt="Loan Shark" />
            </div>
        
       
           
        
        <div className="main-container">
            <div className="left-side-bar">
                <h1>Loan ID: {loanId || "Loading..."}</h1>
                <h3>{loanInfo.ClientName || "Loading..."}</h3>
            </div>
            <div className="recordContainer4">
                <InfoGrid/>
            </div>
        </div>
    </div>
    );
}

export default RecordInfo;
