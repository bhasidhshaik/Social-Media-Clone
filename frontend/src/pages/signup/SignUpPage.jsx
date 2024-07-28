import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye , FaEyeSlash} from "react-icons/fa";
import {Helmet} from 'react-helmet'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import toast from "react-hot-toast";
import LogoWhite from "../../assets/logo-white.png"

const SignUpPage = () => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  const {mutate , isPending , isError , error } = useMutation({
    mutationFn: async ({ username, email, password, fullName }) => {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, fullName }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error);
      }
  
      return data;
    },
    onSuccess: () => {
      toast.success("Account Created Successfully");
      queryClient.invalidateQueries("authUser")
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  })

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Check required fields
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm Password is required";

    // Check username format (no spaces, at least 3 characters)
    if (formData.username && /\s/.test(formData.username))
      newErrors.username = "Username should not contain spaces";
    if (formData.username && formData.username.length < 3)
      newErrors.username = "Username should be at least 3 characters long";

    // Check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailPattern.test(formData.email))
      newErrors.email = "Invalid email format";

    // Check password match
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if(formData.password && formData.password.length < 6){
      newErrors.password = "Password should be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutate(formData)
      // Proceed with form submission (e.g., API call)
    }
  };

  return (
    <div>
      <div className="signup-container">
        <div className="signup-left">
          <div className="signup-left-top">
            <img src={LogoWhite} alt="Logo" />
          </div>
          <div className="signup-left-bottom">
            <h2>Bringing people together, one connection at a time.</h2>
          </div>

        </div>
        <div className="signup-right">
          <div className="singup-form-container">
            <div className="signup-form-header">
              <h2>Sign Up For Free.</h2>
              <h4>Let's signup quickly to get started.</h4>
            </div>
            <div className="signup-form-body">
              <div className="form-container">
                <form className="form" onSubmit={onSubmit}>
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      autoComplete="off"
                      autoFocus
                    />
                    {errors.fullName && <p className="error">{errors.fullName}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      autoComplete="off"
                    
                    />
                    {errors.username && <p className="error">{errors.username}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
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
                      type= {showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                    </div>
                    {errors.password && <p className="error">{errors.password}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="rel">
                    <div className="eye-toggle" onClick={()=>{
                      setShowConfirmPassword(!showConfirmPassword)
                    }}>
                      {showConfirmPassword ? <FaEyeSlash size={25}/> : <FaEye size={25} />}
                      
             
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                    </div>
                    {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                  </div>
                  <button className="form-submit-btn" type="submit">
                    {isPending ? "Loading.." : "SignUp"}
                  </button>
                  <div className="signin-btn">
                    <Link to="/login" className="signin-btn-link">Already have an account ? <span>SignIn</span></Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
