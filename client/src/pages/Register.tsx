import React, { ChangeEvent, FormEvent, useState, useContext } from "react";
import { ModalContext } from "../contexts/ModalContext";
import { FaRobot } from "react-icons/fa";
import { serverURL } from "../utils/serverURL";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type Props = {};

type Avatar = string | File;

interface FormData {
  email: string;
  password: string;
  username: string;
  avatar: Avatar;
}

const Register = (props: Props) => {
  //eslint-disable-next-line
  const { isModalOpen, closeModal, openModal, setModalContent } =
    useContext(ModalContext);
  const { setUser, login } = useContext(AuthContext);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    username: "",
    avatar: "",
  });
  const fileInput = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const redirectToSucculents = () => {
    navigate("/succulents");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, avatar: e.target.files[0] });
    } else {
      setFormData({ ...formData, avatar: "" });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // console.log(formData)
    const submitData = new FormData();
    submitData.append("email", formData.email);
    submitData.append("password", formData.password);
    submitData.append("username", formData.username);
    submitData.append("avatar", formData.avatar);
    // console.log("testing registration - submitdata", submitData);
    const requestOptions = {
      method: "POST",
      body: submitData,
    };
    try {
      // const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/users/new`, requestOptions);
      const response = await fetch(
        `${serverURL}/api/users/new`,
        requestOptions
      );
      const result = await response.json();
      // console.log("testing registration", result);
      if (result.msg === "Successfully registered!") {
        setLoading(false);
        login(formData.email, formData.password);
        // setModalContent(
        //   "Successfully registered! Please log-in through the side-bar"
        // );
        // openModal();
        // setUser(result.user);
        redirectToSucculents();
        setFormData({ email: "", password: "", username: "", avatar: "" });
        if (fileInput.current) {
          fileInput.current.value = ""; // reset the file input
        }
      } else {
        setLoading(false);
        setModalContent(result.error);
        openModal();
        setFormData({ email: "", password: "", username: "", avatar: "" });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setModalContent("Something went wrong - check console");
      openModal();
      setFormData({ email: "", password: "", username: "", avatar: "" });
    }
  };

  return (
    <div>
      <h3 className="registerOrHome-header">
        Sign up and join fellow plant enthusiasts!
        <br /> Engage, share, and grow with our community. Get personalized care
        tips from our 'Robi <FaRobot /> Robot AI' for each of your plants.
        Elevate your plant journey with us!
      </h3>
      <div>
        <form className="register-page-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="email"
            onChange={handleChange}
            className="input-text-area"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="password"
            onChange={handleChange}
            className="input-text-area"
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            placeholder="username"
            onChange={handleChange}
          />
          <input
            type="file"
            ref={fileInput}
            name="avatar"
            onChange={handleFile}
            accept="image/png, image/jpg, image/jpeg"
          />
          <button className="custom-button" type="submit" disabled={loading}>
            Register
          </button>
        </form>
        <div className="register-div-gif" style={{ display: "relative" }}>
          {loading && <div className="loader"></div>}
        </div>
      </div>
    </div>
  );
};

export default Register;
