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
            
            <div className="top-middle-button3">
            <button onClick={navigateToHomePage}>Back</button>
                <button>Edit Payment</button>
                <button>Add Payment</button>
                <img src={LoanShark} alt="Loan Shark" />
            </div>
        
       
           
        
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
