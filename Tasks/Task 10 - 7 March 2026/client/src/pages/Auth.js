import React, { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight, TrendingUp, Sun, Moon, KeyRound } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { supabase } from "../utils/supabase";
import "./Auth.css";

const QUOTES = [
  {
    text: "Wealth is the ability to fully experience life.",
    author: "Henry David Thoreau",
  },
  {
    text: "Do not save what is left after spending, but spend what is left after saving.",
    author: "Warren Buffett",
  },
  {
    text: "A budget is telling your money where to go instead of wondering where it went.",
    author: "Dave Ramsey",
  },
  {
    text: "Beware of little expenses; a small leak will sink a great ship.",
    author: "Benjamin Franklin",
  },
  {
    text: "Never spend your money before you have it.",
    author: "Thomas Jefferson",
  },
  {
    text: "If you buy things you do not need, soon you will have to sell things you need.",
    author: "Warren Buffett",
  },
  {
    text: "A penny saved is a penny earned.",
    author: "Benjamin Franklin",
  },
  {
    text: "Too many people spend money they earned to buy things they don’t want.",
    author: "Will Rogers",
  },
  {
    text: "The habit of saving is itself an education.",
    author: "T. T. Munger",
  },
  {
    text: "Small daily financial habits lead to long-term wealth.",
    author: "Anonymous",
  },
];

// View states: "login" | "signup" | "verify-otp"
const Auth = ({ onLoginSuccess }) => {
  const [view, setView] = useState("login");
  const [pendingEmail, setPendingEmail] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otpCode, setOtpCode] = useState("");

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);

  const { isDark, toggleTheme } = useTheme();

  // Apply theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDark]);

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setGeneralError("");
    setSuccessMessage("");
  };

  const validateLoginSignup = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (view === "signup" && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (view === "signup" && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  // ----- SIGN IN -----
  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = validateLoginSignup();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      onLoginSuccess();
    } catch (error) {
      setGeneralError(error.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  // ----- SIGN UP → triggers OTP email -----
  const handleSignup = async (e) => {
    e.preventDefault();
    const newErrors = validateLoginSignup();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // This tells Supabase to send an OTP code instead of a magic link
          emailRedirectTo: undefined,
        },
      });
      if (error) throw error;

      // Move to OTP verification screen
      setPendingEmail(formData.email);
      setOtpCode("");
      setGeneralError("");
      setView("verify-otp");
    } catch (error) {
      setGeneralError(error.message || "Unable to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  // ----- VERIFY OTP -----
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 8) {
      setGeneralError("Please enter the 8-digit code from your email.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: pendingEmail,
        token: otpCode,
        type: "email",
      });
      if (error) throw error;

      // Account confirmed — go to login with success message
      setView("login");
      setFormData({ email: pendingEmail, password: "", confirmPassword: "" });
      setSuccessMessage("Email verified! You can now sign in with your password.");
    } catch (error) {
      setGeneralError(error.message || "Invalid or expired code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: pendingEmail,
      });
      if (error) throw error;
      setSuccessMessage("A new code has been sent to your email.");
    } catch (error) {
      setGeneralError("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-master-container">
      {/* Visual Showcase Panel */}
      <div className="auth-showcase">
        <div className="auth-showcase-content">
          <div className="brand-logo-large">
            <span className="logo-icon-wrap">
              <TrendingUp size={48} strokeWidth={1.5} />
            </span>
            <h1>Onyx Wealth</h1>
          </div>

          <div className="quote-container">
            {QUOTES.map((quote, idx) => (
              <div
                key={idx}
                className={`quote-block ${idx === quoteIndex ? "active" : ""}`}
              >
                <p className="quote-text">"{quote.text}"</p>
                <p className="quote-author">— {quote.author}</p>
              </div>
            ))}
          </div>

          <div className="showcase-footer">
            <p>Elevating personal finance to an art form.</p>
          </div>
        </div>
        <div className="ambient-bg shape-1"></div>
        <div className="ambient-bg shape-2"></div>
      </div>

      {/* Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-wrapper">

          <div className="theme-toggle-container">
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="mobile-brand">
            <TrendingUp size={24} strokeWidth={2} />
            <span>Onyx Wealth</span>
          </div>

          {/* ============ OTP VERIFICATION VIEW ============ */}
          {view === "verify-otp" && (
            <>
              <div className="auth-header">
                <div className="otp-icon-wrap">
                  <KeyRound size={32} strokeWidth={1.5} />
                </div>
                <h2>Check your email</h2>
                <p className="subtitle">
                  We sent an 8-digit verification code to<br />
                  <strong>{pendingEmail}</strong>
                </p>
              </div>

              {generalError && (
                <div className="error-banner"><span>{generalError}</span></div>
              )}
              {successMessage && (
                <div className="success-banner"><span>{successMessage}</span></div>
              )}

              <form className="auth-form" onSubmit={handleVerifyOtp}>
                <div className="input-group">
                  <label htmlFor="otpCode">Verification Code</label>
                  <div className="input-wrapper otp-input-wrapper">
                    <KeyRound className="input-icon" size={18} />
                    <input
                      type="text"
                      id="otpCode"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={8}
                      value={otpCode}
                      onChange={(e) => {
                        setOtpCode(e.target.value.replace(/\D/g, ""));
                        setGeneralError("");
                        setSuccessMessage("");
                      }}
                      placeholder="00000000"
                      autoComplete="one-time-code"
                      className="search-input otp-input"
                    />
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  <span>{isLoading ? "Verifying..." : "Verify Code"}</span>
                  {!isLoading && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  Didn't receive a code?{" "}
                  <button
                    type="button"
                    className="toggle-mode-btn"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                  >
                    Resend
                  </button>
                  {" · "}
                  <button
                    type="button"
                    className="toggle-mode-btn"
                    onClick={() => { setView("signup"); setGeneralError(""); setSuccessMessage(""); }}
                  >
                    Go back
                  </button>
                </p>
              </div>
            </>
          )}

          {/* ============ LOGIN / SIGNUP VIEW ============ */}
          {view !== "verify-otp" && (
            <>
              <div className="auth-header">
                <h2>{view === "login" ? "Welcome back" : "Begin your journey"}</h2>
                <p className="auth-subtitle">
                  {view === "login"
                    ? "Enter your credentials to access your dashboard."
                    : "Create an account to track your wealth."}
                </p>
              </div>

              {generalError && (
                <div className="error-banner"><span>{generalError}</span></div>
              )}
              {successMessage && (
                <div className="success-banner"><span>{successMessage}</span></div>
              )}

              <form
                className="auth-form"
                onSubmit={view === "login" ? handleLogin : handleSignup}
              >
                <div className="input-group">
                  <label htmlFor="email">Email Address</label>
                  <div className={`input-wrapper ${errors.email ? "has-error" : ""}`}>
                    <Mail className="input-icon" size={18} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      autoComplete="email"
                      className="search-input"
                    />
                  </div>
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <div className={`input-wrapper ${errors.password ? "has-error" : ""}`}>
                    <Lock className="input-icon" size={18} />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete={view === "login" ? "current-password" : "new-password"}
                      className="search-input"
                    />
                  </div>
                  {errors.password && <span className="field-error">{errors.password}</span>}
                </div>

                {view === "signup" && (
                  <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className={`input-wrapper ${errors.confirmPassword ? "has-error" : ""}`}>
                      <Lock className="input-icon" size={18} />
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="search-input"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <span className="field-error">{errors.confirmPassword}</span>
                    )}
                  </div>
                )}

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  <span>
                    {isLoading
                      ? "Authenticating..."
                      : view === "login"
                      ? "Sign In"
                      : "Create Account"}
                  </span>
                  {!isLoading && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  {view === "login" ? "New to Onyx Wealth?" : "Already a member?"}{" "}
                  <button
                    type="button"
                    className="toggle-mode-btn"
                    onClick={() => {
                      setView(view === "login" ? "signup" : "login");
                      setErrors({});
                      setGeneralError("");
                      setSuccessMessage("");
                      setFormData({ email: "", password: "", confirmPassword: "" });
                    }}
                  >
                    {view === "login" ? "Create an account" : "Sign in instead"}
                  </button>
                </p>
              </div>

              {/* Mobile Quotes */}
              <div className="mobile-quotes">
                {QUOTES.map((quote, idx) => (
                  <div
                    key={idx}
                    className={`mobile-quote-block ${idx === quoteIndex ? "active" : ""}`}
                  >
                    <p>"{quote.text}"</p>
                    <span>— {quote.author}</span>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Auth;
