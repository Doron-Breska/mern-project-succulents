
import { ReactNode, createContext, useState, useEffect } from "react"

interface User {
  _id:string
  email: string,
  username: string,
  avatar: string,
  succulents: [],
  role: string
}
interface AuthContextType {
  user: User | null;
  error: Error | null;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  login(email: string, password: string): void;
  logout(): void;
}



// export const AuthContext = createContext<AuthContextType | null>(null); // not recommended
// export const AuthContext = createContext<AuthContextType>({} as AuthContextType); // less recommended
// export const AuthContext = createContext<AuthContextType>(null!); // less recommended
const initialAuth: AuthContextType = {
  user: null,
  error: null,
  errorMsg: '',
  setErrorMsg: () => {},
  login: () => {
    throw new Error('login function not implemented.');
  },
  logout: () => {
    throw new Error('logout function not implemented.');
  },
};


export const AuthContext = createContext<AuthContextType>(initialAuth);

export const AuthContextProvider = ({children} : {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  console.log("active user : ", user)
  const [error, setError] = useState<Error | null>(null);
  const [errorMsg, setErrorMsg] = useState("");


  const login = async(email: string, password: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    const urlencoded = new URLSearchParams();
    urlencoded.append("email", email);
    urlencoded.append("password", password);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}users/login`, requestOptions);
      const result = await response.json();
      if (result.user) {
        setUser(result.user);
        console.log("test-result.user",result.user )
        localStorage.setItem("token", result.token);
        localStorage.setItem("my name", "doron");
        setErrorMsg("")
      }
      console.log(result);
    } catch (error) {
      console.log(error);
      // setError(error); //I still have to figure out how to type the unknown fetch results
      alert("Something went wrong - check console for error")
    }

  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token")
  }

  //old vers start
  // const checkForToken = () => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     console.log("There is a token")
  //   } else {
  //     console.log("There is no token")
  //   }
  // }

//  useEffect(() => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     fetchActiveUser(token);
//   }
// }, []);
  
// old vers end
  
const checkForToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    console.log("There is a token");
    fetchActiveUser(token);
  } else {
    console.log("There is no token");
  }
};
  

  
  const fetchActiveUser = async(token: string) => {
     const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}users/active`, requestOptions);
      const result = await response.json();
      console.log("active user result:", result);
      setUser(result);
    } catch (error) {
      console.log(error);
    }
  }

    useEffect(() => {
  checkForToken();
    }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, error, errorMsg, setErrorMsg }}>
    { children }
  </AuthContext.Provider>
  )
}
