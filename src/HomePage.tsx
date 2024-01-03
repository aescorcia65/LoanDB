import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import GridTest from "./GridTest";


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
            <div className={"searchContainer"}>
                <button>Search</button>
                <input placeholder="Loanee Name" />
            </div>
            <div className="recordContainer">
                <GridTest/>
                
{/*                <div className="recordBlock1">*/}
{/*                    <h2>Homepage will store customer name (first and last), initial loan date, and anything else you might want (last payment, remaining balance, payments made ect.)     </h2>*/}
{/*                    <h2>*Click Daniel below*</h2>*/}
{/*                </div>*/}
{/*                <div className="recordBlock2" onClick={RecordInfoNav}>*/}
{/*            <h1>Daniel Wright ($7,400) 12/15/97</h1>*/}
{/*        </div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Lisa Martinez ($9,500) 10/5/97</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Emily Davis ($2,450) 9/30/96</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Nancy King ($2,600) 1/23/96</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Patricia Lopez ($6,800) 4/10/95</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Mark Robinson ($3,700) 5/21/95</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Brian Hernandez ($5,000) 6/20/94</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Michael Brown ($5,600) 1/8/94</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Jessica Clark ($6,100) 2/14/93</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Jane Doe ($3,200) 6/15/93</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Sarah Wilson ($4,300) 12/20/92</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Karen Young ($3,300) 9/18/92</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Paul Walker ($4,500) 3/30/90</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Chris Garcia ($1,200) 7/17/90</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Steven Gonzalez ($1,100) 10/31/89</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>John Smith ($1,500) 4/22/89</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Alex Johnson ($7,800) 3/11/91</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Susan Hall ($1,800) 7/4/91</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Aaron Lewis ($2,200) 8/29/88</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Joey Spaghetti ($55,000) 8/19/88</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Mary Lee ($8,900) 11/9/89</h1>*/}
{/*</div>*/}
{/*<div className="recordBlock">*/}
{/*    <h1>Hugh Mungus ($2100) 11/10/95</h1>*/}


{/*                */}
{/*                    <h1></h1>*/}
{/*                </div>*/}
            </div>
        </div>
    );
}

export default HomePage;
