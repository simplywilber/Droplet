import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function AuthForm({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }// set the user in App state
      setUser(userCredential.user); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="authContainer">
      <form onSubmit={handleSubmit}>
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
        {error && <div className="error">{error}</div>}
      </form>

      <div className="options">
        {isLogin ? (
          <p>
            Don't have an account?{" "}
            <button onClick={() => setIsLogin(false)}>Register</button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button onClick={() => setIsLogin(true)}>Login</button>
          </p>
        )}
      </div>
    </div>
  );
}