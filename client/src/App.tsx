import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Home from './pages/Home';
import Login from './pages/Login'; 
import { AuthContext, AuthContextProvider } from './contexts/AuthContext';
import NavBar from './components/NavBar';


function App() {

  return (
    <AuthContextProvider>
        <BrowserRouter>
          <NavBar />
        <Routes>
          <Route path='/' element={ <Home /> }/>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
        </BrowserRouter>
        </AuthContextProvider>
  );
}

export default App;
