import { AuthContext } from "../contexts/AuthContext";
import Form from "react-bootstrap/Form";
import React, { ChangeEvent, FormEvent, useState, useContext } from "react";

type Props = {};

type Avatar = string | File;

interface FormData {
  email: string;
  password: string;
  username: string;
  avatar: Avatar;
}

const ProfileUpdate = (props: Props) => {
  const { user, setUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  console.log("this is the user", user);
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
    const submitData = new FormData();
    if (formData.email !== "") {
      submitData.append("email", formData.email);
    }
    if (formData.password !== "") {
      submitData.append("password", formData.password);
    }
    if (formData.username !== "") {
      submitData.append("username", formData.username);
    }
    if (formData.avatar !== "") {
      submitData.append("avatar", formData.avatar);
    }
    const requestOptions = {
      method: "PUT",
      headers: new Headers({ Authorization: `Bearer ${token}` }),
      body: submitData,
    };
    try {
      const response = await fetch(
        `http://localhost:5001/api/users/update/${user?._id}`,
        requestOptions
      );
      const result = await response.json();
      setUser(result);
      setFormData({
        // Reset form
        email: "",
        password: "",
        username: "",
        avatar: "",
      });
      if (fileInput.current) {
        fileInput.current.value = "";
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <div className="inner-component">
      <h1 className="profile-page-header">View / Edit your profile</h1>
      <div className="edit-profile-container">
        <div className="profile-pic-frame">
          <div
            className="profile-pic"
            style={{ backgroundImage: `url(${(user && user.avatar) || ""})` }}
          ></div>
          <p className="profile-pic-text">{user && user.username}</p>
          <p className="profile-pic-text">{user && user.email}</p>
        </div>
        <div className="profile-edit-frame">
          <div className="profile-edit">
            <div className="semi-img-edit-profile">
              <p>
                current eamil : {user && user.email}
                <br /> current username : {user && user.username}
              </p>
              <Form onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="email"
                  onChange={handleChange}
                  className="input-text-area"
                />
                <br />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  placeholder="password"
                  onChange={handleChange}
                  className="input-text-area"
                />
                <br />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  placeholder="username"
                  onChange={handleChange}
                />
                <br />
                <input
                  ref={fileInput}
                  type="file"
                  name="avatar"
                  onChange={handleFile}
                  accept="image/png, image/jpg, image/jpeg"
                  className="text-input-position"
                />
                <br />
                <button className="custom-button" type="submit">
                  Update
                </button>
              </Form>
            </div>

            <div className="profile-pic-text-div">
              It's never too late,
              <br />
              To make a positive change!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
