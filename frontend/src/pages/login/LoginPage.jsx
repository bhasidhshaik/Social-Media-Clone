import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye , FaEyeSlash} from "react-icons/fa";
import {Helmet} from 'react-helmet'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LogoWhite from "../../assets/logo-white.png"
const LoginPage = () => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { mutate, isPaused, isError, error } = useMutation({
    mutationFn: async ({ username, password }) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
  
      if (data.error) {
        throw new Error(data.error);
      }
  
      return data;
    },
    onSuccess: () => {
      toast.success("Login Successful");
      queryClient.invalidateQueries(['authUser'])
    },
    onError: (err) => {
      console.log("Error:", err);
      toast.error(err.message || 'An unknown error occurred');
    },
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutate(formData)
    }
  };

  return (
    <div>
      <div className="signup-container">
      <div className="signup-right login-left">
          <div className="singup-form-container">
            <div className="signup-form-header">
              <h2>Welcome Back.</h2>
              <h4>Let's login quickly to get started.</h4>
            </div>
            <div className="signup-form-body">
              <div className="form-container">
                <form className="form" onSubmit={onSubmit}>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      autoComplete="off"
                      autoFocus
                    
                    />
                    {errors.username && <p className="error">{errors.username}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="rel">
                    <div className="eye-toggle" onClick={()=>{
                      setShowPassword(!showPassword)
                    }}>
                    {showPassword ? <FaEyeSlash size={25}/> : <FaEye size={25} />}
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                    </div>
                    {errors.password && <p className="error">{errors.password}</p>}
                  </div>
                  <button className="form-submit-btn" type="submit">
                    Submit
                  </button>
                  <div className="signin-btn">
                    <Link to="/signup" className="signin-btn-link">Dont't have an account ? <span>SignUp</span></Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="signup-left login-right">
          <div className="signup-left-top">
          <img src={LogoWhite} alt="Logo" />
          </div>
          <div className="signup-left-bottom">
            <h2>Where connections shape the world.</h2>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
