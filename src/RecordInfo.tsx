import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import InfoGrid from './InfoGrid';

function RecordInfo() {
<<<<<<< HEAD
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
=======
    const {LoanID} = useParams()
    const navigate = useNavigate();

      
        // This function is responsible for navigation
    const HomePagenav = () => {
          navigate('/');
        };
        

    return (
        <div>

            <div className={"top-left-button"}>
                {/* Use the NewRecordnav function here for navigation */}
                <button onClick={HomePagenav}>Back</button>
            </div>
            <div className={"top-middle-button"}>
                {/* Use the NewRecordnav function here for navigation */}
                <button>Add Payment</button>  <button>Edit Payment</button>
            </div>
           
                <div className="recordBlock3">
            <h1>Daniel Wright ($7,400) 12/15/97</h1>
            <h3> Initial Loan Amount ($10000) on (date) 12/15/97 </h3>
            <h3> Current balance ($7400) </h3>
            <h4> Upcoming/proposed payments</h4>
            <h3> $100 on 1/28/98 </h3>
            <h3> $250 on 2/11/98 </h3>
            <h3> $920 on 2/28/98 </h3>
            <h3> $1,400 on 3/11/98 </h3>
            <h4> PAYMENTS MADE </h4>
            <h3> $900 on 12/28/97 </h3>
            <h3> $1700 on 1/11/98 </h3>
        </div>

                
                    <h1></h1>
>>>>>>> 780b858679d4d46cc272991c230f37cdf570f600
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
