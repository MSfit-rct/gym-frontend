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
    const data = await res.json();
    setMembers(data);
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
    if (!start) return "";
    const d = new Date(start);
    if (plan === "1 Month") d.setMonth(d.getMonth() + 1);
    if (plan === "3 Months") d.setMonth(d.getMonth() + 3);
    if (plan === "6 Months") d.setMonth(d.getMonth() + 6);
    if (plan === "1 Year") d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split("T")[0];
  };

  const filtered = members.filter(m =>
    (m.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>

      <input
        placeholder="Search..."
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
          {filtered.map(m => {
            const expiry = getExpiry(m.startDate, m.membership);
            const expired = new Date() > new Date(expiry);

            return (
              <tr key={m._id}>
                <td>{m.name}</td>
                <td>{m.age}</td>
                <td>{m.phone}</td>
                <td>{m.membership}</td>
                <td>{m.startDate}</td>
                <td>{expiry}</td>
                <td style={{color: expired ? "red" : "lime"}}>
                  {expired ? "Expired" : "Active"}
                </td>
                <td>{m.payment}</td>
                <td>{m.training}</td>
                <td>{m.gender}</td>

                <td>
                  <button onClick={()=>handleEdit(m)}>Edit</button>
                  <button onClick={()=>handleDelete(m._id)}>Delete</button>
                  <button onClick={()=>setHistoryData(m)}>History</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* EDIT */}
      {editData && (
        <div style={styles.modal}>
          <div style={styles.box}>
            <h2>Edit Member</h2>

            <input placeholder="Name" value={editData.name || ""} onChange={(e)=>setEditData({...editData,name:e.target.value})}/>
            <input placeholder="Age" value={editData.age || ""} onChange={(e)=>setEditData({...editData,age:e.target.value})}/>
            <input placeholder="Phone" value={editData.phone || ""} onChange={(e)=>setEditData({...editData,phone:e.target.value})}/>

            <select value={editData.membership} onChange={(e)=>setEditData({...editData,membership:e.target.value})}>
              <option>1 Month</option>
              <option>3 Months</option>
              <option>6 Months</option>
              <option>1 Year</option>
            </select>

            <input type="date"
              value={editData.startDate?.split("T")[0]}
              onChange={(e)=>setEditData({...editData,startDate:e.target.value})}
            />

            <select value={editData.payment} onChange={(e)=>setEditData({...editData,payment:e.target.value})}>
              <option>Cash</option>
              <option>UPI</option>
            </select>

            <select value={editData.training} onChange={(e)=>setEditData({...editData,training:e.target.value})}>
              <option>No</option>
              <option>Yes</option>
            </select>

            <select value={editData.gender} onChange={(e)=>setEditData({...editData,gender:e.target.value})}>
              <option>Male</option>
              <option>Female</option>
            </select>

            <button onClick={handleUpdate}>Update</button>
            <button onClick={()=>setEditData(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* HISTORY */}
      {historyData && (
        <div style={styles.modal}>
          <div style={styles.box}>
            <h2>{historyData.name} History</h2>

            <h4>Current</h4>
            <p>{historyData.membership} | {historyData.startDate}</p>

            <h4>Past</h4>
            {historyData.history?.length ? (
              historyData.history.map((h,i)=>(
                <div key={i}>
                  {h.membership} | {h.startDate} → {h.endDate}
                </div>
              ))
            ) : <p>No history</p>}

            <button onClick={()=>setHistoryData(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container:{ padding:20, background:"#020617", color:"#fff", minHeight:"100vh"},
  input:{ padding:10, marginBottom:20},
  table:{ width:"100%"},
  modal:{ position:"fixed", top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.7)",display:"flex",justifyContent:"center",alignItems:"center"},
  box:{ background:"#0f172a", padding:20}
};

export default Admin;