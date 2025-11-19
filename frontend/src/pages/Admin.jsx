import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const STATUS_META = {
    pending: { label: "Pending", backgroundColor: "#f8d7da", color: "#721c24" },
    reviewed: { label: "Reviewed", backgroundColor: "#ffe5b4", color: "#8a4d00" },
    resolved: { label: "Resolved", backgroundColor: "#d4edda", color: "#155724" }
};

function Admin() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        try {
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
        } catch (_) {}
        navigate("/login", { replace: true });
    };

    const getFileName = (url) => {
        try {
            if (!url) return "";
            const parts = url.split("/");
            return parts[parts.length - 1];
        } catch (_) {
            return url;
        }
    };

    const fetchEnquiries = () => {
        setLoading(true);
        api.get("/api/admin/enquiries/")
            .then((res) => setEnquiries(res.data || []))
            .catch((err) => alert(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const updateStatus = (id, status) => {
        api.patch(`/api/enquiries/${id}/`, { status })
            .then((res) => {
                // Optimistically update table
                setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
            })
            .catch((err) => alert("Failed to update status"));
    };

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px"
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
                >
                    Logout
                </button>
            </div>
            <h2>All Enquiries</h2>
            {loading ? (
                <p>Loading...</p>
            ) : enquiries.length === 0 ? (
                <p>No enquiries found.</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                            <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Reason</th>
                            <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Details</th>
                            <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Transaction</th>
                            <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>User</th>
                            <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Date</th>
                            <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Status</th>
                            <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Attachment</th>
                            <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enquiries.map((enquiry) => {
                            const statusKey = (enquiry.status || "pending").toLowerCase();
                            const meta = STATUS_META[statusKey] || STATUS_META.pending;
                            return (
                                <tr key={enquiry.id} style={{ borderBottom: "1px solid #ddd" }}>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{enquiry.reason}</td>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={enquiry.details}>
                                        {enquiry.details}
                                    </td>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                                        {enquiry.transaction ? enquiry.transaction.name : "N/A"}
                                    </td>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                                        {enquiry.author ? enquiry.author : "User"}
                                    </td>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                                        {new Date(enquiry.created_at).toLocaleDateString("en-US")}
                                    </td>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                                        <span style={{
                                            padding: "4px 8px",
                                            borderRadius: "4px",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            backgroundColor: meta.backgroundColor,
                                            color: meta.color,
                                            textTransform: "uppercase"
                                        }}>
                                            {meta.label}
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                                        {enquiry.attachment ? (
                                            <span>{getFileName(enquiry.attachment)}</span>
                                        ) : (
                                            <span style={{ color: "#999" }}>None</span>
                                        )}
                                    </td>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                                        <select
                                            value={statusKey}
                                            onChange={(e) => updateStatus(enquiry.id, e.target.value)}
                                            style={{ padding: "6px 8px", borderRadius: "4px" }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="reviewed">Reviewed</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Admin;
