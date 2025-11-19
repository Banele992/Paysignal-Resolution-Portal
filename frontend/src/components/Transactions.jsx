import React from "react";

function Transaction({transaction, onEnquiry}) {
    const formattedDate = new Date(transaction.created_at).toLocaleDateString("en-US")

    return (
        <div className="note-container">
            <p className="transaction-name">{transaction.name}</p>
            <p className="transaction-account_number">{transaction.account_number}</p>
            <p className="transaction-amount">{transaction.amount}</p>
            <p className="transaction-date">{formattedDate}</p>
            <button className="enquiry-button" onClick={() => onEnquiry(transaction.id)}>Enquire</button>
        </div>
    );
}

export default Transaction