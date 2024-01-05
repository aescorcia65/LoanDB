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
        <div className="header-container">
        <div className="buttons-container">
            <div className="top-left-button2">
                <button onClick={navigateToHomePage}>Back</button>
            </div>
            <div className="top-middle-button">
                <button>Edit Payment</button>
                <button>Add Payment</button>
            </div>
        </div>
        <h1>
            <img src={LoanShark} alt="Loan Shark" />
        </h1>
        <div className="main-container">
            <div className="left-side-bar">
               <h3>Joey Spaghetti</h3>
            </div>
            <div className="recordContainer4">
                <InfoGrid/>
            </div>
        </div>
    </div>
    );
}

export default RecordInfo;
