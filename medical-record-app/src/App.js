import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./Navbar"; // Adjust the path based on your project structure
import SetDetails from './SetDetails';

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/setdetails" element={<SetDetails />} />
        {/* Add routes for other pages */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
