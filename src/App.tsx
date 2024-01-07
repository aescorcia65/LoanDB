import React from 'react';
import './App.css';
import './HomePage.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage'; // import your components
import NewRecord from './NewRecord';
import UpcomingPayments from './UpcomingPayments'
import RecordInfo from './RecordInfo';
import Help from './Help';

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/NewRecord" element={<NewRecord />} />
          <Route path="/RecordInfo" element={<RecordInfo />} />
          <Route path="/UpcomingPayments" element={<UpcomingPayments />} />
          <Route path="/Help" element={<Help />} />

          {/* Other routes */}
        </Routes>
      </Router>
    );
  }
  
  export default App;

