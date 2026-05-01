import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Menu from "./Menu";
import bgImage from "./Images/gym-bg.jpg";

// Pages
import Registration from "./pages/Registration";
import Admin from "./pages/Admin";
import ThankYou from "./pages/ThankYou";
import Login from "./pages/login";

function Home() {
  return (
    <div style={styles.hero}>
      <div style={styles.overlay}>
        <h1 style={styles.heading}>Welcome to MS Fitness</h1>
        <p style={styles.subtext}>
          Build your body. Transform your life.
        </p>
      </div>
    </div>
  );
}

// 🔥 Wrapper to control navbar
function Layout() {
  const location = useLocation();

  return (
    <>
      {/* Hide navbar only on thankyou */}
      {location.pathname !== "/thankyou" && <Menu />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

const styles = {
  hero: {
    width: "100%",
    height: "100vh",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  overlay: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    color: "#fff",
    fontSize: "42px",
  },
  subtext: {
    color: "#cbd5f5",
  },
};

export default App;