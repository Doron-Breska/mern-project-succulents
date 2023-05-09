import React, { useEffect, useState } from 'react'

type Props = {}

interface User {
  email :string,
  password: string,
  username :string
}
type Users = User[]



function Home(props: Props) {
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
    const id = "6452ae8a637768f85036ce93";
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
    <div>
      <h1 className="text-3xl font-bold underline">hello</h1>
      <h2>all users</h2>
      { users && users.map((user, i) => {
          return <p key={i}>{user.username}</p>
      })}
        <h2>User with ID: 6450cfc9b65b487e9927d4c2 </h2>
      { user && <p>{user.username}</p> }
      </div>
  )
}

export default Home