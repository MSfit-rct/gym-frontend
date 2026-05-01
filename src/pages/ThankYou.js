import React from "react";
import bgImage from "../Images/thank-bg.jpg";

function ThankYou() {
  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        {/* No text here */}
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
};

export default ThankYou;