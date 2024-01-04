import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import GridTest from "./GridTest";
import FilterPage from "./FilterPage";
// import BtnCellRenderer from "./CellRender"


function HomePage() {


    const navigate = useNavigate();
  
    // This function is responsible for navigation
    const NewRecordnav = () => {
      navigate('/NewRecord');
    };

    const RecordInfoNav = () => {
        navigate('/RecordInfo');
      };

    return (
        <div>
            <div className={"top-left-button"}>
                {/* Use the NewRecordnav function here for navigation */}
                <button onClick={NewRecordnav}>New Loan</button>
            </div>
            <div>
                <h1>LoanPro™</h1>
            </div>
            <div className={"searchContainer"}>
                
                <FilterPage/>
            </div>
            <div className="recordContainer">
                <GridTest/>
            </div>
        </div>
    );
}

export default HomePage;
