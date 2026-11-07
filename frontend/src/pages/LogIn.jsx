import './LogIn.scss';
import illustration from '../assets/Logo.png';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function LogIn() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('stocksplit_auth', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={illustration} alt="A logo" className="logo-icon" />

        <h1 className="split">StockSplit</h1>
        <p className="welcome">Welcome back. Please login to your account.</p>

        <form className="form" onSubmit={handleLogin}>
          <div>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input type="email" placeholder="Email address" required />
            </div>
          </div>

          <div>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input type="password" placeholder="Password" />
            </div>
          </div>

          <p className="forgot">
            <a href="/signup">Forgot Password</a>
          </p>

          <button type="submit" className="login-btn">
            LOGIN <ArrowRight size={18} />
          </button>
        </form>

        <p className="login-text">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

