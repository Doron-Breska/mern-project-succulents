import { ReactNode, createContext, useState } from "react"

interface User {
  password: string,
  email?: string,
  username: string,
  avatar: string,
  pets: string[]
}

interface AuthContextType {
  user: User | null,
  error: Error | null,
  login(email: string, password: string): void,
}

// export const AuthContext = createContext<AuthContextType | null>(null); // not recommended
// export const AuthContext = createContext<AuthContextType>({} as AuthContextType); // less recommended
// export const AuthContext = createContext<AuthContextType>(null!); // less recommended

const initialAuth: AuthContextType = {
  user: null,
  error: null,
  login: () => {
    throw new Error('login not implemented.');
  }
};

export const AuthContext = createContext<AuthContextType>(initialAuth);

export const AuthContextProvider = ({children} : {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const login = async(email: string, password: string) => {
    console.log({ email: email, password: password })
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
      }
      console.log(result);
    } catch (error) {
      console.log(error);
      // setError(error); //I still have to figure out how to type the unknown fetch results
      alert("Something went wrong - check console for error")
    }

  }

  return (
    <AuthContext.Provider value={{ user, login, error }}>
      { children }
    </AuthContext.Provider>
  )
}