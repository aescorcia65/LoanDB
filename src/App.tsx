import React from 'react';
import './App.css';
import './HomePage.css';
import './NewRecord.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage'; // import your components
import NewRecord from './NewRecord';

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/NewRecord" element={<NewRecord />} />

          {/* Other routes */}
        </Routes>
      </Router>
    );
  }
  
  export default App;

