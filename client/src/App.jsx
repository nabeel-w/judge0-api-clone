import React from 'react';
import { Route, Routes } from "react-router-dom";
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import CodeSpace from './CodeSpace';

function App() {
    return (
        <>
            <Routes>
                <Route exact path="/login" element={<LoginPage />} />
                <Route exact path="/register" element={<RegisterPage />} />
                <Route exact path="/" element={<CodeSpace />} />
            </Routes>
        </>
    );
}

export default App;