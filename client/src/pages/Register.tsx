import React, { ChangeEvent, FormEvent, useState, useContext } from "react";
import { ModalContext } from "../contexts/ModalContext";
import { FaRobot } from "react-icons/fa";

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
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    username: "",
    avatar: "",
  });
  const fileInput = React.useRef<HTMLInputElement>(null);

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
        "http://localhost:5001/api/users/new",
        requestOptions
      );
      const result = await response.json();
      console.log("testing registration", result);
      if (result.msg === "Successfully registered!") {
        setModalContent(
          "Successfully registered! Please log-in through the side-bar"
        );
        openModal();
        setFormData({ email: "", password: "", username: "", avatar: "" });
        if (fileInput.current) {
          fileInput.current.value = ""; // reset the file input
        }
      } else {
        setModalContent(result.error);
        openModal();
        setFormData({ email: "", password: "", username: "", avatar: "" });
      }
    } catch (error) {
      console.log(error);
      setModalContent("Something went wrong - check console");
      openModal();
      setFormData({ email: "", password: "", username: "", avatar: "" });
    }
  };

  return (
    <div className="register-page-outer-container">
      <div className="register-page-container">
        <h3
          className="register-page-header"
          style={{ fontSize: "clamp(1.1rem, 2.1vw, 1.7rem)" }}
        >
          Register here to post,
          <br />
          like, comment, and use our Robi <FaRobot /> Robot AI <br />
          for guidance regarding your succulents.
        </h3>
        <div className="register-container-test">
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
            <button className="custom-button" type="submit">
              Register
            </button>
          </form>
          <div className="register-div-gif"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
