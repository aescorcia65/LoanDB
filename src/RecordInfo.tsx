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
            <div className="recordBlock3">
                <h1>Daniel Wright ($7,400) 12/15/97</h1>
                <h3>Initial Loan Amount ($10,000) on 12/15/97</h3>
                <h3>Current balance ($7,400)</h3>
                <h4>Upcoming/proposed payments</h4>
                <h3>$100 on 1/28/98</h3>
                <h3>$250 on 2/11/98</h3>
                <h3>$920 on 2/28/98</h3>
                <h3>$1,400 on 3/11/98</h3>
                <h4>PAYMENTS MADE</h4>
                <h3>$900 on 12/28/97</h3>
                <h3>$1,700 on 1/11/98</h3>
            </div>
            <div className="top-middle-button">
                <button>Add Payment</button>
                <button>Edit Payment</button>
            </div>
            <div className="recordBlock">
                <InfoGrid/>
            </div>
        </div>
    );
}

export default RecordInfo;
