import './App.css';

function App() {


    return (
        <div>
            <div className={"top-left-button"}>
                <button>New Loan</button>

            </div>
            <div className={"searchContainer"}>
                <button>Go</button>
                <input
                    placeholder="Seach Loanee Name"
                />
            </div>
            <div className="recordContainer">
                <div className="recordBlock">
                    <h1>testrecord</h1>
                </div>
                <div className="recordBlock">
                    <h1>testrecord</h1>
                </div>
            </div>
        </div>
    )
}

export default App;