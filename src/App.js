import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FlightBooking from "./pages/FlightBooking"; // Giữ lại trang cũ
import "./index.css";
import "./pages/FlightBooking.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FlightBooking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;



