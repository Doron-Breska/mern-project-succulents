import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Home from './pages/Home';
import Login from './pages/Login'; 
import { AuthContext, AuthContextProvider } from './contexts/AuthContext';
import NavBar from './components/NavBar';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';


function App() {

  return (
    <AuthContextProvider>
        <BrowserRouter>
          <NavBar />
        <Routes>
          <Route path='/' element={ <Home /> }/>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
        </BrowserRouter>
        </AuthContextProvider>
  );
}

export default App;
