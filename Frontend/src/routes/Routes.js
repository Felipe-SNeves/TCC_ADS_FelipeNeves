import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Signin from '../views/Signin';
import Home from '../views/Home';
import Account from '../views/Account';
import Recover from '../views/Recover';
import Teachers from '../views/Teachers';
import Attendance from '../views/Attendance';
import Selo from '../views/Selo';
import Ticket from '../views/Ticket';
import AddAdmin from '../views/AddAdmin';

export default function Rotas (props) {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Signin />} />
                <Route path="/home" element={<Home />} />
                <Route path="/account" element={<Account />} />
                <Route path="/recover" element={<Recover />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/selos" element={<Selo />} />
                <Route path="/ticket" element={<Ticket />} />
                <Route path="/admin" element={<AddAdmin />} />
            </Routes>
        </BrowserRouter>
    );
}