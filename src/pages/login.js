import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../Images/gym-bg.jpg";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "1234") {
      localStorage.setItem("auth", "true");
      navigate("/admin");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <form style={styles.card} onSubmit={handleLogin}>
          <h2 style={styles.title}>Admin Panel</h2>
          <p style={styles.subtitle}>Secure Access</p>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  overlay: {
    height: "100%",
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "350px",
    padding: "30px",
    borderRadius: "12px",
    background: "rgba(15, 23, 42, 0.95)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "0 0 30px rgba(0,0,0,0.6)",
  },

  title: {
    color: "#fff",
    textAlign: "center",
    fontSize: "24px",
  },

  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    fontSize: "13px",
    marginBottom: "10px",
  },

  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#fff",
    outline: "none",
  },

  button: {
    marginTop: "10px",
    padding: "12px",
    background: "linear-gradient(90deg, #0ea5e9, #22c55e)",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },

  error: {
    color: "#f87171",
    fontSize: "13px",
    textAlign: "center",
  },
};

export default Login;