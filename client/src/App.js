import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Dashboard from "./Dashboard/Dashboard";
import Landing from "./Landing/Landing";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Landing/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
