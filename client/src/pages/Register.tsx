import React, { ChangeEvent, FormEvent, useState } from 'react'

type Props = {}

type Avatar = string | File


interface FormData {
    email: string,
    password: string,
    username: string,
    avatar: Avatar
}

const Register = (props: Props) => {

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
        // console.log(formData) 
        const submitData = new FormData();
        submitData.append("email", formData.email);
        submitData.append("password", formData.password);
        submitData.append("username", formData.username);
        submitData.append("avatar", formData.avatar);
        const requestOptions = {
        method: 'POST',
        body: submitData
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/users/new`, requestOptions);
            const result = await response.json();
            console.log("testing registration", result);
            if (result.msg === "successfully registered!")  {
                alert("Success! Check console.")
            }
            else {
            alert("Something went wrong")
            }
        } catch (error) {
            console.log(error)
            alert("Something went wrong - check console")
        }
    }
  return (
      <div>
          <form onSubmit={handleSubmit}>
              <input type='email'  name='email' placeholder='email' onChange={handleChange}/>
              <input type='password' name='password' placeholder='password' onChange={handleChange}/>
              <input type='text' name='username' placeholder='username' onChange={handleChange} />
              <input type='file' name='avatar' onChange={handleFile} accept="image/png, image/jpg, image/jpeg"/>
              <button type='submit'>Register</button>
          </form>
      </div>
  )
}

export default Register
