import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://gym-backend-dv12.onrender.com";

function Admin() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState(null);
  const [historyData, setHistoryData] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("auth")) navigate("/login");
  }, [navigate]);

  const fetchMembers = async () => {
    const res = await fetch(`${API}/members`);
    setMembers(await res.json());
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete member?")) return;
    await fetch(`${API}/members/${id}`, { method: "DELETE" });
    fetchMembers();
  };

  const handleEdit = (m) => setEditData({ ...m });

  const handleUpdate = async () => {
    await fetch(`${API}/members/${editData._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });

    setEditData(null);
    fetchMembers();
  };

  const getExpiry = (start, plan) => {
    const d = new Date(start);
    if (plan === "1 Month") d.setMonth(d.getMonth() + 1);
    if (plan === "3 Months") d.setMonth(d.getMonth() + 3);
    if (plan === "6 Months") d.setMonth(d.getMonth() + 6);
    if (plan === "1 Year") d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split("T")[0];
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      <input
        placeholder="Search member..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        style={styles.input}
      />

      <table style={styles.table}>
        <thead>
          <tr>
            {["Name","Age","Phone","Membership","Start","Expiry","Status","Payment","PT","Gender","Action"]
              .map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>

        <tbody>
          {members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
          .map(m => {
            const expiry = getExpiry(m.startDate, m.membership);
            const expired = new Date() > new Date(expiry);

            return (
              <tr key={m._id} style={styles.row}>
                <td>{m.name}</td>
                <td>{m.age}</td>
                <td>{m.phone}</td>
                <td>{m.membership}</td>
                <td>{m.startDate}</td>
                <td>{expiry}</td>

                <td>
                  <span style={{
                    ...styles.badge,
                    background: expired ? "#7f1d1d" : "#064e3b"
                  }}>
                    {expired ? "Expired" : "Active"}
                  </span>
                </td>

                <td>{m.payment}</td>
                <td>{m.training}</td>
                <td>{m.gender}</td>

                <td>
                  <button style={styles.edit} onClick={()=>handleEdit(m)}>Edit</button>
                  <button style={styles.delete} onClick={()=>handleDelete(m._id)}>Delete</button>
                  <button style={styles.history} onClick={()=>setHistoryData(m)}>History</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* EDIT MODAL */}
      {editData && (
        <div style={styles.modal}>
          <div style={styles.card}>
            <h2>Edit Member</h2>

            <div style={styles.grid}>
              <input placeholder="Name" value={editData.name} onChange={e=>setEditData({...editData,name:e.target.value})}/>
              <input placeholder="Age" value={editData.age} onChange={e=>setEditData({...editData,age:e.target.value})}/>
              <input placeholder="Phone" value={editData.phone} onChange={e=>setEditData({...editData,phone:e.target.value})}/>
              
              <select value={editData.membership} onChange={e=>setEditData({...editData,membership:e.target.value})}>
                <option>1 Month</option>
                <option>3 Months</option>
                <option>6 Months</option>
                <option>1 Year</option>
              </select>

              <input type="date"
                value={editData.startDate?.split("T")[0]}
                onChange={e=>setEditData({...editData,startDate:e.target.value})}
              />

              <select value={editData.payment} onChange={e=>setEditData({...editData,payment:e.target.value})}>
                <option>Cash</option>
                <option>UPI</option>
              </select>

              <select value={editData.training} onChange={e=>setEditData({...editData,training:e.target.value})}>
                <option>No</option>
                <option>Yes</option>
              </select>

              <select value={editData.gender} onChange={e=>setEditData({...editData,gender:e.target.value})}>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <button style={styles.update} onClick={handleUpdate}>Update</button>
            <button style={styles.cancel} onClick={()=>setEditData(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {historyData && (
        <div style={styles.modal}>
          <div style={styles.card}>
            <h2>{historyData.name} History</h2>

            <div style={styles.historyBox}>
              <b>Current</b>
              <p>{historyData.membership} | {historyData.startDate}</p>
            </div>

            {historyData.history?.map((h,i)=>(
              <div key={i} style={styles.historyItem}>
                <b>{h.membership}</b>
                <div>{h.startDate} → {h.endDate}</div>
                <small>{h.payment}</small>
              </div>
            ))}

            <button style={styles.cancel} onClick={()=>setHistoryData(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container:{ padding:30, background:"#020617", color:"#fff", minHeight:"100vh"},
  title:{ marginBottom:20 },
  input:{ padding:10, marginBottom:20, borderRadius:8 },
  table:{ width:"100%", borderSpacing:"0 10px" },
  row:{ background:"#0f172a" },
  badge:{ padding:"5px 10px", borderRadius:20 },
  edit:{ background:"#22c55e", marginRight:5, padding:"5px 10px" },
  delete:{ background:"#ef4444", marginRight:5, padding:"5px 10px" },
  history:{ background:"#f59e0b", padding:"5px 10px" },
  modal:{ position:"fixed", top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.7)",display:"flex",justifyContent:"center",alignItems:"center"},
  card:{ background:"#0f172a", padding:25, borderRadius:12, width:500 },
  grid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 },
  update:{ background:"#0ea5e9", marginTop:10, padding:8 },
  cancel:{ background:"#64748b", marginTop:10, marginLeft:10, padding:8 },
  historyBox:{ background:"#1e293b", padding:10, borderRadius:8 },
  historyItem:{ background:"#020617", padding:10, marginTop:10, borderRadius:8 }
};

export default Admin;