import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { message } from "antd";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/auth/login`,
      formData
    );
    
    if (response.data.success) {
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("isAdmin", "true");
      
      // Use absolute path and ensure navigation completes
      window.location.href = "/admin/dashboard";
      // Or alternatively:
      // navigate("/admin/dashboard", { replace: true });
    }
  } catch (error) {
    message.error(error.response?.data?.message || "Invalid email or password");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="adm_login_container">
      <div className="adm_login_card">
        {/* Header */}
        <div className="adm_login_header">
          <h1 className="adm_header_title">Admin Portal</h1>
        </div>

        {/* Form Content */}
        <div className="adm_login_body">
          <p className="adm_login_subtitle">Please login to continue</p>

          <form onSubmit={handleLogin} className="adm_login_form">
            {/* Email Field */}
            <div className="adm_form_group">
              <label htmlFor="email" className="adm_form_label">
                Email Address
              </label>
              <div className="adm_input_wrapper">
                <div className="adm_input_icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="adm_form_input"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="adm_form_group">
              <label htmlFor="password" className="adm_form_label">
                Password
              </label>
              <div className="adm_input_wrapper">
                <div className="adm_input_icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="adm_form_input"
                  placeholder="Enter your password"
                  minLength={6}
                />
                <div className="adm_password_toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="adm_form_extras">
              <div className="adm_remember_wrapper">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="adm_checkbox"
                />
                <label htmlFor="remember-me" className="adm_checkbox_label">
                  Remember me
                </label>
              </div>
              <a href="/admin/forgot-password" className="adm_forgot_password">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`adm_submit_button ${loading ? "adm_loading" : ""}`}
            >
              {loading ? (
                <>
                  <svg className="adm_spinner" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <circle className="adm_spinner_circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="adm_spinner_path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="adm_divider">
            <span className="adm_divider_text">Secure Login</span>
          </div>

          {/* Footer */}
          <div className="adm_login_footer">
            <div className="adm_secure_message">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="adm_shield_icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>This login is encrypted and secure</span>
            </div>
            <p className="adm_copyright">
              © {new Date().getFullYear()} Admin System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// New CSS with unique class names
const styles = `
  /* Admin Login specific styles with unique class names */
  .adm_login_container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  .adm_login_card {
    width: 100%;
    max-width: 400px;
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }

  .adm_login_header {
    background: #3860AC;
    padding: 20px 0;
    text-align: center;
  }

  .adm_header_title {
    color: white;
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }

  .adm_login_body {
    padding: 20px 24px;
  }

  .adm_login_subtitle {
    color: #666;
    text-align: center;
    margin-bottom: 24px;
    font-size: 14px;
  }

  .adm_login_form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .adm_form_group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .adm_form_label {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    padding: 0;
    margin: 0;
  }

  .adm_input_wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .adm_input_icon {
    position: absolute;
    left: 12px;
    color: #9ca3af;
    display: flex;
    align-items: center;
  }

  .adm_form_input {
    width: 100%;
    padding: 12px 12px 12px 40px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.15s ease-in-out;
    outline: none;
  }

  .adm_form_input:focus {
    border-color: #3860AC;
    box-shadow: 0 0 0 3px rgba(56, 96, 172, 0.1);
  }

  .adm_password_toggle {
    position: absolute;
    right: 12px;
    color: #9ca3af;
    cursor: pointer;
  }

  .adm_form_extras {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .adm_remember_wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .adm_checkbox {
    width: 16px;
    height: 16px;
    accent-color: #3860AC;
  }

  .adm_checkbox_label {
    font-size: 14px;
    color: #4b5563;
    margin: 0;
    padding: 0;
  }

  .adm_forgot_password {
    font-size: 14px;
    color: #3860AC;
    text-decoration: none;
  }

  .adm_forgot_password:hover {
    text-decoration: underline;
  }

  .adm_submit_button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 12px;
    background-color: #3860AC;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
  }

  .adm_submit_button:hover:not(:disabled) {
    background-color: #2E4A97;
  }

  .adm_submit_button:disabled {
    background-color: #93a8d6;
    cursor: not-allowed;
  }

  .adm_spinner {
    animation: adm_spin 1s linear infinite;
  }

  @keyframes adm_spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .adm_divider {
    position: relative;
    margin: 24px 0;
    text-align: center;
  }

  .adm_divider::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #e5e7eb;
  }

  .adm_divider_text {
    position: relative;
    display: inline-block;
    padding: 0 10px;
    background-color: white;
    color: #6b7280;
    font-size: 14px;
  }

  .adm_login_footer {
    text-align: center;
    margin-top: 20px;
  }

  .adm_secure_message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;
    color: #6b7280;
    font-size: 14px;
  }

  .adm_shield_icon {
    color: #10b981;
  }

  .adm_copyright {
    color: #9ca3af;
    font-size: 12px;
    margin: 0;
  }
`;

export default () => {
  return (
    <>
      <style>{styles}</style>
      <AdminLogin />
    </>
  );
};