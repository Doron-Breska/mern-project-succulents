import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Home from './pages/Home';
import Login from './pages/Login';

interface User {
  email :String,
  password: String,
  username :String
}
type Users = User[]

function App() {
const [users, setUsers] = useState<Users>([]);
const [user, setUser] = useState<User | null>(null);

  const getUsers = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/users/all");
      const result = await response.json();
      setUsers(result)
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

   const getUserById = async() => {
    const id = "6450cfc9b65b487e9927d4c2";
    try {
      const response = await fetch(`http://localhost:5001/api/users/id/${id}`);
      const result = await response.json();
      console.log("single user:", result);
      setUser(result);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUsers();
    getUserById()
},[])

  return (
    <>
    <div className="App">
      <h1>hello</h1>
      <h2>all users</h2>
      { users && users.map((user, i) => {
          return <p key={i}>{user.username}</p>
      })}
        <h2>User with ID: 6450cfc9b65b487e9927d4c2</h2>
      { user && <p>{user.username}</p> }
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Home /> }/>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
