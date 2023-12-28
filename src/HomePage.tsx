import './HomePage.css';

function HomePage() {


    return (
        <div>
            <div className={"top-left-button"}>
            <button>New Loan</button>
            </div>
            <div className={"searchContainer"}>
                <button>Search</button>
                <input
                    placeholder="Loanee Name"
                />
            </div>
            <div className="recordContainer">
                <div className="recordBlock">
                    <h1>TestRecord</h1>
                </div>
                <div className="recordBlock">
                    <h1>testrecord</h1>
                </div>
            </div>
        </div>
    )
}

export default HomePage;