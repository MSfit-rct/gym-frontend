import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Menu() {
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();

  const menuItems = ["Home", "Registration", "Admin"];

  const handleNavigation = (item) => {
    setActive(item);

    if (item === "Home") navigate("/");
    if (item === "Registration") navigate("/registration");

   
    if (item === "Admin") navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.menu}>
        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => handleNavigation(item)}
            style={{
              ...styles.link,
              ...(active === item ? styles.active : {}),
            }}
            className="menu-btn"
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    backgroundColor: "#000000",
    borderBottom: "1px solid #111",
  },

  menu: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flex: 1,
  },

  link: {
    background: "transparent",
    border: "none",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    padding: "6px 14px",
    color: "#ffffff",
    borderRadius: "6px",
    transition: "all 0.2s ease",
    fontFamily: "'Roboto Mono', monospace",
  },

  active: {
    borderBottom: "2px solid #38bdf8",
  },
};

export default Menu;