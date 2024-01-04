import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import InfoGrid from './InfoGrid';
import LoanShark from './LoanShark.png';

function RecordInfo() {

    const navigate = useNavigate();

    // Navigation function to go back to the home page
    const navigateToHomePage = () => {
        navigate('/');
    };


    return (
        <div>
            <div className="top-left-button">
                {/* Use the NewRecordnav function here for navigation */}
                <button onClick={navigateToHomePage}>Back</button>
            </div>
            <div className="top-middle-button">
                {/* Use the NewRecordnav function here for navigation */}
                <button>Add Payment</button>
                <button>Edit Payment</button>
            </div>
            <div>
                <h1>Payments
                <img src={LoanShark} alt="Loan Shark" />
                </h1>
            </div>
            <div className="recordContainer4">
                <InfoGrid/>
            </div>
        </div>
    );
}

export default RecordInfo;
