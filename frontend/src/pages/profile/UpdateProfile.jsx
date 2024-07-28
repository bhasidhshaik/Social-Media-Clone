import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import SpinnerLoader from "../../components/loaders/SpinnerLoader";

const UpdateProfile = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {data:authUser} = useQuery({queryKey : ['authUser']})
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    link: "",
    bio: "",
    profileImg: "", // To handle profile image upload
  });

  const {
    mutate: updateProfile,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({
      username,
      email,
      fullName,
      currentPassword,
      newPassword,
      link,
      bio,
      profileImg,
    }) => {
      // Your API call here
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          fullName,
          currentPassword,
          newPassword,
          link,
          bio,
          profileImg,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error while updating user details");
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Profile Updated Successfully");
      queryClient.invalidateQueries(
        ["authUSer"]
      )
      navigate(`/profile/${authUser.username}`)
    },
    onError : ()=>{
      toast.error(error.message);
    }
  });

  const [errors, setErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if(!formData.username && !formData.email && !formData.profileImg && !formData.newPassword && !formData.bio && !formData.link && !formData.fullName){
      toast.error("Please update atleast one field")
    }

    // Check required fields
    if (formData.newPassword && !formData.currentPassword)
      newErrors.currentPassword = "Current Password is required";
    if (formData.newPassword && !formData.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";

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
    if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (formData.newPassword && formData.newPassword.length < 6)
      newErrors.newPassword =
        "New Password should be at least 6 characters long";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          profileImg: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (isPending) {
        return;
      }
      updateProfile(formData);
    }
  };

  return (
    <div>
      <div className="parent-edit">
        <div className="edit-modal">
          <div className="signup-form-container">
            <div className="signup-form-header">
              <h2>Update Profile</h2>
              <h4>Update your profile details below.</h4>
            </div>
            <div className="signup-form-body">
              <div className="form-container">
                <form className="form" onSubmit={onSubmit}>
                  <div className="form-group">
                    <label htmlFor="profileImg">Profile Image</label>
                    <input
                      type="file"
                      id="profileImg"
                      name="profileImg"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {formData.profileImg && (
                      <img
                        src={formData.profileImg}
                        className="profile-preview"
                        alt="Profile Preview"
                      />
                    )}
                  </div>
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
                    {errors.fullName && (
                      <p className="error">{errors.fullName}</p>
                    )}
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
                    {errors.username && (
                      <p className="error">{errors.username}</p>
                    )}
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
                    <label htmlFor="currentPassword">Current Password</label>
                    <div className="rel">
                      <div
                        className="eye-toggle"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <FaEyeSlash size={25} />
                        ) : (
                          <FaEye size={25} />
                        )}
                      </div>
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        autoComplete="off"
                      />
                    </div>
                    {errors.currentPassword && (
                      <p className="error">{errors.currentPassword}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <div className="rel">
                      <div
                        className="eye-toggle"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <FaEyeSlash size={25} />
                        ) : (
                          <FaEye size={25} />
                        )}
                      </div>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        autoComplete="off"
                      />
                    </div>
                    {errors.newPassword && (
                      <p className="error">{errors.newPassword}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      Confirm New Password
                    </label>
                    <div className="rel">
                      <div
                        className="eye-toggle"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash size={25} />
                        ) : (
                          <FaEye size={25} />
                        )}
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
                    {errors.confirmPassword && (
                      <p className="error">{errors.confirmPassword}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="link">Personal Link</label>
                    <input
                      type="text"
                      id="link"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <input
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>

                  <button className="form-submit-btn" type="submit">
                   {isPending ? <SpinnerLoader size={'small'}/> : "Update"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
