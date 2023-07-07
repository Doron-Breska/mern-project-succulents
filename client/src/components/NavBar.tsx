import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { AuthContext } from "../contexts/AuthContext";
import { NavLink, useLocation } from "react-router-dom";

type Props = {};

const NavBar = (props: Props) => {
  const { user, login, logout } = useContext(AuthContext);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      sidebarRef.current instanceof Node &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      setIsSidebarVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [formData, setFormData] = useState<SubmitLoginData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(formData.email, formData.password);
  };

  const useActivePath = () => {
    const location = useLocation();
    return location.pathname;
  };

  const activePath = useActivePath();

  return (
    <>
      <span className="menu-button" onClick={toggleSidebar}>
        {isSidebarVisible ? (
          <i className="fa-sharp fa-regular fa-circle-xmark fa-2xl"></i>
        ) : (
          <i className="fa-solid fa-bars fa-2xl"></i>
        )}
      </span>
      {isSidebarVisible && (
        <aside className="sidebar" ref={sidebarRef}>
          <div className="first-line-sidebar">
            {user ? <p>User logged in!</p> : <p>User logged out!</p>}
          </div>
          <nav>
            <ul>
              <li>
                <NavLink
                  className={activePath === "/" ? "active" : ""}
                  onClick={toggleSidebar}
                  to="/"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={activePath === "/register" ? "active" : ""}
                  onClick={toggleSidebar}
                  to="/register"
                >
                  Register
                </NavLink>
              </li>
              {user !== null && (
                <li>
                  <NavLink
                    className={activePath === "/profile" ? "active" : ""}
                    onClick={toggleSidebar}
                    to="/profile"
                  >
                    Profile
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
          {user !== null ? (
            <button onClick={logout}>Log-Out</button>
          ) : (
            <>
              {" "}
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  onChange={handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  onChange={handleChange}
                />
                <button type="submit">Log-In</button>
              </form>
            </>
          )}
        </aside>
      )}
    </>
  );
};

export default NavBar;
