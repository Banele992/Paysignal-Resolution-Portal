import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const STATUS_META = {
    pending: { label: "Pending", backgroundColor: "#f8d7da", color: "#721c24" },
    reviewed: { label: "Reviewed", backgroundColor: "#ffe5b4", color: "#8a4d00" },
    resolved: { label: "Resolved", backgroundColor: "#d4edda", color: "#155724" }
};

function Home(){
    const [transactions, setTransactions] = useState([]);
    const [name, setName] = useState("");
    const [account_number, setAccountNumber] = useState("");
    const [amount, setAmount] = useState("");

    const [enquiries, setEnquiries] = useState([]);
    // const [reason, setReason] = useState("");
    // const [details, setDetails] = useState("");
    // const [attachment, setAttachment] = useState(null);

    // Modal states
    const [showEnquiryModal, setShowEnquiryModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [enquiryReason, setEnquiryReason] = useState("");
    const [enquiryDetails, setEnquiryDetails] = useState("");
    const [enquiryAttachment, setEnquiryAttachment] = useState(null);
    const [showCreateTxModal, setShowCreateTxModal] = useState(false);

    const navigate = useNavigate();
    const handleLogout = () => {
        try {
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
        } catch (_) {}
        navigate("/login", { replace: true });
    };

    useEffect(() => {
        getTransactions();
        getEnquiries();
    }, [])

    const getTransactions = () => {
        api.get("/api/transactions/")
            .then((res) => res.data)
            .then((data) => {
                setTransactions(data); 
                console.log(data);
            })
            .catch((err) => alert(err));
    }

     const getEnquiries = () => {
        api.get("/api/enquiries/")
            .then((res) => res.data)
            .then((data) => {
                setEnquiries(data); 
                console.log(data);
            })
            .catch((err) => alert(err));
    }

    const getFileName = (url) => {
        try {
            if (!url) return "";
            const parts = url.split("/");
            return parts[parts.length - 1];
        } catch (_) {
            return url;
        }
    };

    const createTransaction = (e) => {
        e.preventDefault()
        api.post("/api/transactions/", {name, account_number, amount}).then((res) =>{
            if (res.status === 201) alert("Transaction created!")
                else alert("Failed to make transaction.")
        }).catch((err) => alert(err))
        getTransactions();
    }

    const openEnquiryModal = (transaction) => {
        setSelectedTransaction(transaction);
        setShowEnquiryModal(true);
        setEnquiryReason("");
        setEnquiryDetails("");
        setEnquiryAttachment(null);
    };

    const closeEnquiryModal = () => {
        setShowEnquiryModal(false);
        setSelectedTransaction(null);
        setEnquiryReason("");
        setEnquiryDetails("");
        setEnquiryAttachment(null);
    };

    const openCreateTxModal = () => {
        setShowCreateTxModal(true);
    };

    const closeCreateTxModal = () => {
        setShowCreateTxModal(false);
    };

    const submitTransactionEnquiry = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("reason", enquiryReason);
        formData.append("details", enquiryDetails);
        formData.append("transaction_id", selectedTransaction.id);

        if (enquiryAttachment) {
            formData.append("attachment", enquiryAttachment);
        }
        
        api.post("/api/enquiries/", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        .then((res) => {
            if (res.status === 201) {
                alert("Enquiry submitted successfully!");
                closeEnquiryModal();
                getEnquiries();
            } else {
                alert("Failed to submit enquiry.");
            }
        })
        .catch((err) => alert(err));
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

        {/* Transactions Section */}
        <div style={{ marginBottom: "40px" }}>
            <h2>Transactions</h2>
            <button
                onClick={openCreateTxModal}
                style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    margin: "10px 0 20px"
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
            >
                Send Money
            </button>
            <div>
                {transactions.length === 0 ? (
                    <p>No transactions found.</p>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Name</th>
                                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Account Number</th>
                                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Amount</th>
                                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Date</th>
                                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} style={{ borderBottom: "1px solid #ddd", hover: { backgroundColor: "#f9f9f9" } }}>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{transaction.name}</td>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{transaction.account_number}</td>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>R{transaction.amount}</td>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                                        {new Date(transaction.created_at).toLocaleDateString("en-US")}
                                    </td>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                                        <button
                                            onClick={() => openEnquiryModal(transaction)}
                                            style={{
                                                backgroundColor: "#F76806",
                                                color: "white",
                                                border: "none",
                                                padding: "6px 12px",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                fontSize: "14px"
                                            }}
                                            onMouseOver={(e) => e.target.style.backgroundColor = "#F76806"}
                                            onMouseOut={(e) => e.target.style.backgroundColor = "#F76806"}
                                        >
                                            Enquire
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>

        {/* Enquiries Section */}
        <div>
            <h2>Enquiries</h2>
            <div>
                {enquiries.length === 0 ? (
                    <p>No enquiries found.</p>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Reason</th>
                                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Details</th>
                                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Transaction</th>
                                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Date</th>
                                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Status</th>
                                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Attachment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enquiries.map((enquiry) => (
                                <tr key={enquiry.id} style={{ borderBottom: "1px solid #ddd" }}>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>{enquiry.reason}</td>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={enquiry.details}>
                                        {enquiry.details}
                                    </td>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                                        {enquiry.transaction ? enquiry.transaction.name : 'N/A'}
                                    </td>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                                        {new Date(enquiry.created_at).toLocaleDateString("en-US")}
                                    </td>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                                        {(() => {
                                            const statusKey = (enquiry.status || "pending").toLowerCase();
                                            const meta = STATUS_META[statusKey] || STATUS_META.pending;
                                            return (
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
                                            );
                                        })()}
                                    </td>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                                        {enquiry.attachment ? (
                                            <span>{getFileName(enquiry.attachment)}</span>
                                        ) : (
                                            <span style={{ color: "#999" }}>None</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>

        {/* Enquiry Modal */}
        {showEnquiryModal && (
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: "white",
                    padding: "30px",
                    borderRadius: "8px",
                    width: "500px",
                    maxHeight: "80vh",
                    overflowY: "auto"
                }}>
                    <h3>Enquiry for Transaction</h3>
                    {selectedTransaction && (
                        <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
                            <p><strong>Transaction:</strong> {selectedTransaction.name}</p>
                            <p><strong>Account:</strong> {selectedTransaction.account_number}</p>
                            <p><strong>Amount:</strong> R{selectedTransaction.amount}</p>
                        </div>
                    )}
                    
                    <form onSubmit={submitTransactionEnquiry}>
                        <div style={{ marginBottom: "15px" }}>
                            <label htmlFor="enquiryReason">Reason: </label>
                            <br />
                            <select
                                id="enquiryReason"
                                required
                                value={enquiryReason}
                                onChange={(e) => setEnquiryReason(e.target.value)}
                                style={{ padding: "8px", width: "100%" }}
                            >
                                <option value="">Select a reason</option>
                                <option value="Incorrect Amount">Incorrect Amount</option>
                                <option value="Failed Transaction">Failed Transaction</option>
                                <option value="Unauthorized Transaction">Unauthorized Transaction</option>
                            </select>
                        </div>
                        
                        <div style={{ marginBottom: "15px" }}>
                            <label htmlFor="enquiryDetails">Details: </label>
                            <br />
                            <textarea 
                                id="enquiryDetails" 
                                required 
                                value={enquiryDetails}
                                onChange={(e) => setEnquiryDetails(e.target.value)}
                                rows="4"
                                style={{ padding: "8px", width: "100%" }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: "15px" }}>
                            <label htmlFor="enquiryAttachment">Attachment: </label>
                            <br />
                            <input 
                                type="file" 
                                id="enquiryAttachment" 
                                onChange={(e) => setEnquiryAttachment(e.target.files[0])}
                                style={{ padding: "8px" }}
                            />
                            {enquiryAttachment && (
                                <p style={{ marginTop: "5px", fontSize: "14px", color: "#666" }}>
                                    Selected: {enquiryAttachment.name}
                                </p>
                            )}
                        </div>
                        
                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                            <button
                                type="button"
                                onClick={closeEnquiryModal}
                                style={{
                                    padding: "8px 16px",
                                    border: "1px solid #ccc",
                                    backgroundColor: "#f8f9fa",
                                    cursor: "pointer",
                                    borderRadius: "4px"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#F76806",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                    borderRadius: "4px"
                                }}
                            >
                                Submit Enquiry
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        {showCreateTxModal && (
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: "white",
                    padding: "30px",
                    borderRadius: "8px",
                    width: "500px",
                    maxHeight: "80vh",
                    overflowY: "auto"
                }}>
                    <h3>Create a Transaction</h3>
                    <form onSubmit={(e) => { createTransaction(e); closeCreateTxModal(); }}>
                        <div style={{ marginBottom: "15px" }}>
                            <label htmlFor="name">Name: </label>
                            <br />
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                required 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ padding: "8px", width: "100%" }}
                            />
                        </div>
                        <div style={{ marginBottom: "15px" }}>
                            <label htmlFor="account_number">Account Number: </label>
                            <br />
                            <input 
                                type="text" 
                                id="account_number" 
                                name="account_number" 
                                required 
                                value={account_number}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                style={{ padding: "8px", width: "100%" }}
                            />
                        </div>
                        <div style={{ marginBottom: "15px" }}>
                            <label htmlFor="amount">Amount: </label>
                            <br />
                            <input 
                                type="number" 
                                id="amount" 
                                name="amount" 
                                required 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                step="0.01"
                                style={{ padding: "8px", width: "100%" }}
                            />
                        </div>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                            <button
                                type="button"
                                onClick={closeCreateTxModal}
                                style={{
                                    padding: "8px 16px",
                                    border: "1px solid #ccc",
                                    backgroundColor: "#f8f9fa",
                                    cursor: "pointer",
                                    borderRadius: "4px"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#28a745",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                    borderRadius: "4px"
                                }}
                            >
                                Send Money
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
);
}
export default Home