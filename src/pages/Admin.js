import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://gym-backend-dv12.onrender.com";

function Admin() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("auth")) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchMembers = async () => {
    const res = await fetch(`${API}/members`);
    const data = await res.json();
    setMembers(data);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member?")) return;

    await fetch(`${API}/members/${id}`, {
      method: "DELETE",
    });

    fetchMembers();
  };

  const handleEdit = (member) => {
    setEditData({ ...member });
  };

  const handleUpdate = async () => {
    const payload = {
      name: editData.name,
      age: parseInt(editData.age),
      phone: editData.phone,
      membership: editData.membership,
      startDate: editData.startDate,
      payment: editData.payment,
      training: editData.training,
      gender: editData.gender,
    };

    await fetch(`${API}/members/${editData._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setEditData(null);
    fetchMembers();
  };

  const filtered = members.filter((m) =>
    (m.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const getExpiryDate = (startDate, membership) => {
    if (!startDate || !membership) return null;

    const date = new Date(startDate);

    if (membership === "1 Month") date.setMonth(date.getMonth() + 1);
    if (membership === "3 Months") date.setMonth(date.getMonth() + 3);
    if (membership === "6 Months") date.setMonth(date.getMonth() + 6);
    if (membership === "1 Year") date.setFullYear(date.getFullYear() + 1);

    return date;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date() > expiryDate;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      <input
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      <table style={styles.table}>
        <thead>
          <tr>
            {["Name","Age","Phone","Membership","Start","Expiry","Status","Payment","PT","Gender","Action"]
              .map((h) => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filtered.map((m) => {
            const expiry = getExpiryDate(m.startDate, m.membership);
            const expired = isExpired(expiry);

            return (
              <tr key={m._id} style={styles.tr}>
                <td style={styles.td}>{m.name}</td>
                <td style={styles.td}>{m.age}</td>
                <td style={styles.td}>{m.phone}</td>
                <td style={styles.td}>{m.membership}</td>
                <td style={styles.td}>{m.startDate}</td>
                <td style={styles.td}>{expiry?.toISOString().split("T")[0]}</td>

                <td style={{
                  ...styles.td,
                  color: expired ? "red" : "lime"
                }}>
                  {expired ? "Expired" : "Active"}
                </td>

                <td style={styles.td}>{m.payment}</td>
                <td style={styles.td}>{m.training}</td>
                <td style={styles.td}>{m.gender}</td>

                <td style={styles.td}>
                  <button
                    style={styles.editBtn}
                    onClick={() => handleEdit(m)}
                  >
                    Edit
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(m._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* EDIT MODAL */}
      {editData && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Edit Member</h2>

            <div style={styles.formGrid}>
              <input
                placeholder="Name"
                value={editData.name}
                onChange={(e)=>setEditData({...editData,name:e.target.value})}
              />

              <input
                placeholder="Age"
                value={editData.age}
                onChange={(e)=>setEditData({...editData,age:e.target.value})}
              />

              <input
                placeholder="Phone"
                value={editData.phone}
                onChange={(e)=>setEditData({...editData,phone:e.target.value})}
              />

              <select
                value={editData.membership}
                onChange={(e)=>setEditData({...editData,membership:e.target.value})}
              >
                <option>1 Month</option>
                <option>3 Months</option>
                <option>6 Months</option>
                <option>1 Year</option>
              </select>

              <input
                type="date"
                value={editData.startDate?.split("T")[0]}
                onChange={(e)=>setEditData({...editData,startDate:e.target.value})}
              />

              <select
                value={editData.payment}
                onChange={(e)=>setEditData({...editData,payment:e.target.value})}
              >
                <option>Cash</option>
                <option>UPI</option>
              </select>

              <select
                value={editData.training}
                onChange={(e)=>setEditData({...editData,training:e.target.value})}
              >
                <option>No</option>
                <option>Yes</option>
              </select>

              <select
                value={editData.gender}
                onChange={(e)=>setEditData({...editData,gender:e.target.value})}
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div style={styles.modalActions}>
              <button style={styles.updateBtn} onClick={handleUpdate}>
                Update
              </button>
              <button style={styles.cancelBtn} onClick={()=>setEditData(null)}>
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container:{ padding:"30px", background:"#020617", minHeight:"100vh", color:"#fff"},
  title:{ fontSize:"28px", marginBottom:"20px"},
  input:{ padding:"10px", marginBottom:"20px"},
  table:{ width:"100%"},
  th:{ padding:"10px"},
  tr:{ background:"#0f172a"},
  td:{ padding:"10px"},
  editBtn:{ background:"#22c55e", color:"#fff", marginRight:"5px", border:"none", padding:"6px 10px"},
  deleteBtn:{ background:"#ef4444", color:"#fff", border:"none", padding:"6px 10px"},
  modal:{ position:"fixed", top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.7)",display:"flex",justifyContent:"center",alignItems:"center"},
  modalContent:{ background:"#0f172a",padding:"20px",borderRadius:"10px",width:"500px"},
  formGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"15px"},
  modalActions:{ display:"flex", justifyContent:"flex-end", gap:"10px"},
  updateBtn:{ background:"#0ea5e9", color:"#fff", border:"none", padding:"8px 12px"},
  cancelBtn:{ background:"#64748b", color:"#fff", border:"none", padding:"8px 12px"}
};

export default Admin;