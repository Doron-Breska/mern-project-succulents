import {
  ReactNode,
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { ModalContext } from "./ModalContext";

interface User {
  _id: string;
  email: string;
  username: string;
  avatar: string;
  succulents: [];
  role: string;
}
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  error: Error | null;
  login(email: string, password: string): void;
  logout(): void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// export const AuthContext = createContext<AuthContextType | null>(null); // not recommended
// export const AuthContext = createContext<AuthContextType>({} as AuthContextType); // less recommended
// export const AuthContext = createContext<AuthContextType>(null!); // less recommended
const initialAuth: AuthContextType = {
  user: null,
  setUser: () => {
    throw new Error("setUser function not implemented.");
  },

  error: null,
  login: () => {
    throw new Error("login function not implemented.");
  },
  logout: () => {
    throw new Error("logout function not implemented.");
  },
  loading: false,
  setLoading: function (loading: boolean): void {
    throw new Error("Function not implemented.");
  },
};

export const AuthContext = createContext<AuthContextType>(initialAuth);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // console.log("active user testing: ", user)
  const { setModalContent, openModal } = useContext(ModalContext); // get setModalContent from ModalContext
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    const urlencoded = new URLSearchParams();
    urlencoded.append("email", email);
    urlencoded.append("password", password);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}users/login`,
        requestOptions
      );
      if (!response.ok) {
        const errorData = await response.json(); // get the error message from the response
        setModalContent(errorData.error); // set the error message as modal content
        openModal();
        return;
      }
      const result = await response.json();
      if (result.user) {
        setUser(result.user);
        // console.log("test--- result.user :",result.user )
        localStorage.setItem("token", result.token);
        localStorage.setItem("my name", "doron");
        setModalContent("");
      }
      console.log(result);
    } catch (error) {
      console.log(error);
      setModalContent("Unexpected error occurred"); // a general error message when an unexpected error (like network error) occurs
      openModal();
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

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

  const checkForToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // console.log("There is a token");
      fetchActiveUser(token);
    } else {
      // console.log("There is no token");
    }
  }, []);

  const fetchActiveUser = async (token: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}users/active`,
        requestOptions
      );
      if (!response.ok) {
        const errorData = await response.json();
        setModalContent(errorData.error);
        return;
      }
      const result = await response.json();
      // console.log("active user result:", result);
      setUser(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkForToken();
  }, [checkForToken]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, error, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
