import React from 'react';
import './App.css';
import './HomePage.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage'; // import your components
import NewRecord from './NewRecord';
import RecordInfo from './RecordInfo';
import FilterPage from "./FilterPage";

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<FilterPage />} />
          <Route path="/NewRecord" element={<NewRecord />} />
          <Route path="/RecordInfo" element={<RecordInfo />} />

          {/* Other routes */}
        </Routes>
      </Router>
    );
  }
  
  export default App;

