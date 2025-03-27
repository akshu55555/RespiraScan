import React from "react";
import "./signupform.css"; // Import CSS file for styling

const SignupForm = () => {
  return (
    <div className="container">
      <div className="form-box">
        <h2>Personal Info</h2>
        <div className="grid">
          <input type="text" placeholder="First Name" />
          <input type="text" placeholder="Last Name" />
          <input type="number" placeholder="Age" />
          <input type="text" placeholder="Gender" />
        </div>

        <h2>History</h2>
        <div className="grid">
          <input type="number" placeholder="Height" />
          <input type="number" placeholder="Weight" />
        </div>
        <input type="text" placeholder="Blood Group" className="full-width" />

        <h2>Login Details</h2>
        <input type="email" placeholder="Email ID" className="full-width" />
        <input type="password" placeholder="Password" className="full-width" />

        <button className="submit-btn">Create an Account</button>

        <p className="login-text">
          Already have an Account? <span className="login-link">Login</span>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
