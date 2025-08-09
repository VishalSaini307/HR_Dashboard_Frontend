import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'


import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Candidate from './components/Candidate/Candidate';
import Employees from './components/Employees/Employees';
import Attendance from './components/Attendance/Attendance';
import Leaves from './components/Leaves/Leaves';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/candidate" element={<Candidate />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leaves" element={<Leaves />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App
