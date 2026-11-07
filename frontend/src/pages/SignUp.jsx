// import { usestate } from 'react'
import './SignUp.scss'
import { Link, useNavigate } from "react-router-dom";
// import illustration from "../assets/Logo.png";
import { Store, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();                              // stop the page from reloading
    localStorage.setItem('stocksplit_auth', 'true'); // remember that they are logged in
    navigate('/dashboard');                          // open the Dashboard
  };

  return (
    <div className="signup-page">
      <div className="signup-card">

        <div className="signup-header">
          <div className="illustration">
            <Store size={24} color="white" />
          </div>
          <h1 className="signup-title">StockSplit</h1>
          <p className="signup-subtitle">Mini-Mart Pro</p>
        </div>

        <form className="signup-form" onSubmit={handleSignUp}>

          <div className="form-group">
            <label>Shop Name</label>
            <div className="input-wrapper">
              <Store size={18} className="input-icon" />
              <input type="text" placeholder="e.g. Iya Basira Stores" />
            </div>
          </div>

          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input type="text" placeholder="Choose a username" required/>
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={25} className="input-icon" />
              <input type="email" placeholder="you@example.com" required/>
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <div className="input-wrapper">
              <Phone size={25} className="input-icon" />
              <input type="tel" placeholder="+234" required/>
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={25} className="input-icon" />
              <input type="password" placeholder="Create a strong password" required />
            </div>
          </div>

          <button type="submit" className="create-shop-btn">
            Create Shop <ArrowRight size={25} />
          </button>

        </form>

        <p className="terms-text">
          By signing up, you agree to our{' '}
          <a href="/terms">Terms of Service</a> and{' '}
          <a href="/privacy">Privacy Policy</a>.
        </p>

        <p className="login-text">
          Already have a shop? <Link to="/login">Log In</Link>
        </p>

      </div>
    </div>
  )
}