
import { AuthContext } from '../contexts/AuthContext';
import Form from 'react-bootstrap/Form';
 import React, { ChangeEvent, FormEvent, useState, useContext} from 'react'




type Props = {}

type Avatar = string | File


interface FormData {
    email: string,
    password: string,
    username: string,
    avatar: Avatar
}

const ProfileUpdate = (props: Props) => {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");
    console.log("this is the user",user)
     const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    username: "",
    avatar: ""
    });
    
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

    
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, avatar: e.target.files[0] })
    } else {
      setFormData({ ...formData, avatar: "" })
    }
  }
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const submitData = new FormData();
        submitData.append("email", formData.email);
        submitData.append("password", formData.password);
        submitData.append("username", formData.username);
        submitData.append("avatar", formData.avatar);
        const requestOptions = {
            method: 'PUT',
            headers: new Headers({"Authorization": `Bearer ${token}` }),
            body: submitData
        };
        try {
                 const response = await fetch(`http://localhost:5001/api/users/update/${user?._id}`, requestOptions);
                 const result = await response.text();
                 console.log("results of update-profile",result);
        } catch (error) {
                console.error('error', error);
        }
    }

  return (
      <div className="inner-component">
        <h1>ProfileUpdate</h1>
          <div className='edit-profile-container'>
              <div className='profile-pic-frame'>
                  <div className='profile-pic' style={{ backgroundImage: `url(${ user && user.avatar || ''})` }}></div>
              </div>
              <div className='profile-edit-frame'>
                    <div className='profile-edit'>
                         <p>current eamil : {user && user.email }</p>
                         <p>current username : {user && user.username}</p>
                         <Form onSubmit={handleSubmit}>
                            <input type='email'  name='email' placeholder='email' onChange={handleChange}/><br />
                            <input type='password' name='password' placeholder='password' onChange={handleChange}/><br />
                            <input type='text' name='username' placeholder='username' onChange={handleChange} /><br />
                            <input type='file' name='avatar' onChange={handleFile} accept="image/png, image/jpg, image/jpeg"/><br />
                            <button type='submit'>edit profile</button>
                        </Form>
                   </div>
              </div>
      </div>
      </div>
  )
}

export default ProfileUpdate