import React from "react";
import bgImage from "../Images/thank-bg.jpg"; // 🔥 your image

function ThankYou() {
  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <h1 style={styles.text}></h1>
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
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center",
  },
};

export default ThankYou;