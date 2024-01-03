import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import InfoGrid from './InfoGrid';

function RecordInfo() {
    const navigate = useNavigate();

    // Navigation function to go back to the home page
    const navigateToHomePage = () => {
        navigate('/');
    };

    return (
        <div className="recordInfoContainer">
            <div className="navigationButtons">
                <div className="top-left-button">
                    <button onClick={navigateToHomePage}>Back</button>
                </div>
                <div className="top-middle-button">
                    <button>Add Payment</button>
                    <button>Edit Payment</button>
                </div>
            </div>
            <div className="recordBlock">
                <InfoGrid />
            </div>
        </div>
    );
}

export default RecordInfo;
