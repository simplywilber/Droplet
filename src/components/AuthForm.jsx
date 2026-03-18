import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

/**
 * Component for user authentication (Login and Registration).
 * Handles Firebase auth calls and toggles between login/register views.
 * 
 * @param {Object} props
 * @param {Function} props.setUser - Callback to set the authenticated user in parent state
 */
export default function AuthForm({ setUser }) {
  // State to toggle between Login and Registration mode
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  /**
   * Handles form submission for both login and registration.
   * Validates inputs and interacts with Firebase Auth.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset any previous errors

    // Basic client-side validation
    if (!email || !password) {
      setError("Please enter all required fields");
      return;
    }

    try {
      let userCredential;
      // Branch based on current mode
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
      } else {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
      } 
      // Successfully authenticated, update application state
      setUser(userCredential.user);
    } catch (err) {
      // Firebase throws formatted errors that can be displayed
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div id="auth-deck-logo">
        <h1>Droplet</h1>
      </div>
      <div id="auth-deck-form">
        <form onSubmit={handleSubmit} id="auth-form">
          <h1>{isLogin ? "Login" : "Register"}</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
          
          {/* Display error message if one exists */}
          {error && <div className="error">{error}</div>}
        </form>

        <div className="auth-options">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <button className="auth-form-btn" onClick={() => setIsLogin(false)}>Register</button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button className="auth-form-btn" onClick={() => setIsLogin(true)}>Login</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
