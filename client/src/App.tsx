import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Home from './pages/Home';
import { AuthContext, AuthContextProvider } from './contexts/AuthContext';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import SideBar from './components/SideBar';
import ErrorPage from './pages/ErrorPage';
import Succulents from './pages/Succulents';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {

  return (
    <div className='app-container' style={{width: '100%',}}>
    <AuthContextProvider>
        <BrowserRouter>
          <SideBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='*' element={<ErrorPage />} />
          <Route path='/register' element={<Register />} />
          <Route path='/succulents' element={<Succulents />} />
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
        </BrowserRouter>
        </AuthContextProvider>
    </div>
  );
}

export default App;
