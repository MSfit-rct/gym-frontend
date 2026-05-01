import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../Images/gym-bg.jpg";

const API = "https://gym-backend-dv12.onrender.com";

function Registration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    membership: "",
    startDate: "",
    payment: "",
    training: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const options = ["1 Month", "3 Months", "6 Months", "1 Year"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && !/^[0-9]*$/.test(value)) return;
    if (name === "age" && !/^[0-9]*$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const selectOption = (val) => {
    setFormData((prev) => ({ ...prev, membership: val }));
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.phone || formData.phone.length !== 10)
      newErrors.phone = "Valid phone required";
    if (!formData.membership) newErrors.membership = "Select membership";
    if (!formData.startDate) newErrors.startDate = "Select date";
    if (!formData.payment) newErrors.payment = "Select payment";
    if (!formData.training) newErrors.training = "Select training";
    if (!formData.gender) newErrors.gender = "Select gender";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const res = await fetch(`${API}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        await res.json();
        navigate("/thankyou");

      } catch (err) {
        alert("Error saving data");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <form style={styles.card} onSubmit={handleSubmit}>
          <h2 style={styles.title}>Join MS Fitness</h2>

          <input name="name" placeholder="Name" style={styles.input} value={formData.name} onChange={handleChange}/>
          {errors.name && <span style={styles.error}>{errors.name}</span>}

          <input name="age" placeholder="Age" style={styles.input} value={formData.age} onChange={handleChange}/>
          {errors.age && <span style={styles.error}>{errors.age}</span>}

          <input name="phone" placeholder="Phone Number" style={styles.input} value={formData.phone} onChange={handleChange} maxLength="10"/>
          {errors.phone && <span style={styles.error}>{errors.phone}</span>}

          {/* Gender */}
          <div style={styles.radioGroup}>
            <p>Gender</p>
            {["Male", "Female", "Other"].map((g) => (
              <label key={g}>
                <input
                  type="radio"
                  checked={formData.gender === g}
                  onChange={() => handleGenderChange(g)}
                /> {g}
              </label>
            ))}
          </div>
          {errors.gender && <span style={styles.error}>{errors.gender}</span>}

          {/* Membership */}
          <div style={styles.dropdownContainer} ref={dropdownRef}>
            <div style={styles.dropdown} onClick={() => setOpen(!open)}>
              {formData.membership || "Select Membership"}
            </div>

            {open && (
              <div style={styles.dropdownList}>
                {options.map((item) => (
                  <div key={item} style={styles.dropdownItem} onClick={() => selectOption(item)}>
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.membership && <span style={styles.error}>{errors.membership}</span>}

          <label style={styles.label}>Date of Joining</label>
          <input type="date" name="startDate" style={styles.input} value={formData.startDate} onChange={handleChange}/>
          {errors.startDate && <span style={styles.error}>{errors.startDate}</span>}

          {/* Payment */}
          <div style={styles.radioGroup}>
            <p>Mode of Payment</p>
            <label>
              <input type="radio" name="payment" value="UPI" onChange={handleChange}/> UPI
            </label>
            <label>
              <input type="radio" name="payment" value="Cash" onChange={handleChange}/> Cash
            </label>
          </div>
          {errors.payment && <span style={styles.error}>{errors.payment}</span>}

          {/* Training */}
          <div style={styles.radioGroup}>
            <p>Personal Training</p>
            <label>
              <input type="radio" name="training" value="Yes" onChange={handleChange}/> Taken
            </label>
            <label>
              <input type="radio" name="training" value="No" onChange={handleChange}/> Not Taken
            </label>
          </div>
          {errors.training && <span style={styles.error}>{errors.training}</span>}

          <button type="submit" style={styles.button}>Register</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  overlay: {
    minHeight: "100vh",
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "420px",
    padding: "30px",
    borderRadius: "12px",
    background: "rgba(15, 23, 42, 0.9)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  title: { textAlign: "center", color: "#fff" },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#fff",
  },
  label: { color: "#94a3b8", fontSize: "13px" },
  dropdownContainer: { position: "relative" },
  dropdown: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#fff",
    cursor: "pointer",
  },
  dropdownList: {
    position: "absolute",
    top: "110%",
    width: "100%",
    background: "#020617",
    border: "1px solid #334155",
    borderRadius: "6px",
  },
  dropdownItem: { padding: "12px", color: "#e2e8f0", cursor: "pointer" },
  radioGroup: { color: "#e2e8f0", display: "flex", flexDirection: "column" },
  button: {
    marginTop: "10px",
    padding: "12px",
    background: "#0ea5e9",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
  },
  error: { color: "#f87171", fontSize: "12px" },
};

export default Registration;