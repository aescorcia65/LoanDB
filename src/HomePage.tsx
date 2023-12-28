import './HomePage.css';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();
  
    // This function is responsible for navigation
    const NewRecordnav = () => {
      navigate('/NewRecord');
    };

    return (
        <div>
            <div className={"top-left-button"}>
                {/* Use the NewRecordnav function here for navigation */}
                <button onClick={NewRecordnav}>New Loan</button>
            </div>
            <div className={"searchContainer"}>
                <button>Search</button>
                <input placeholder="Loanee Name" />
            </div>
            <div className="recordContainer">
                <div className="recordBlock">
                    <h1>  This will store customer name     </h1>
                </div>
                <div className="recordBlock">
                    <h1>testrecord</h1>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
