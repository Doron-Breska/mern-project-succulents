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

const SideBar = (props: Props) => {
  const { user, login, logout } = useContext(AuthContext);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
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

  const closeSidebar = () => {
    setIsSidebarVisible(false);
  };

  return (
    <>
      {!isSidebarVisible && (
        <span className="menu-button" onClick={() => setIsSidebarVisible(true)}>
          <i className="fa-solid fa-bars fa-2xl" />
        </span>
      )}

      {isSidebarVisible && (
        <aside className="sidebar" ref={sidebarRef}>
          <div className="first-line-sidebar">
            {user ? <p>User logged in!</p> : <p>User logged out!</p>}
          </div>
          <nav>
            <ul>
              <li>
                <NavLink className={activePath === "/" ? "active" : ""} to="/">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={activePath === "/register" ? "active" : ""}
                  to="/register"
                >
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={activePath === "/succulents" ? "active" : ""}
                  to="/succulents"
                >
                  Succulents
                </NavLink>
              </li>
              {user !== null && (
                <li>
                  <NavLink
                    className={activePath === "/profile" ? "active" : ""}
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
          <br />
          {/* <button className="close-button" onClick={closeSidebar}>
            Close
          </button> */}
          <span className="menu-button" onClick={closeSidebar}>
            <i className="fa-solid fa-circle-xmark fa-2xl"></i>
          </span>
        </aside>
      )}
    </>
  );
};

export default SideBar;
