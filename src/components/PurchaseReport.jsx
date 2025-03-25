import React from "react";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

function PurchaseReport({ machineId }) {
  const navigate = useNavigate();

  const handlePurchase = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Not logged in — redirect to Login
      return navigate("/login");
    }

    try {
      const response = await fetch(`${API}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ machine_id: machineId }),
      });

      const data = await response.json();
      if (data.url) {
        // ✅ Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to create checkout session");
      }
    } catch (err) {
      console.error("Error creating checkout session:", err);
      alert("Error creating checkout session");
    }
  };

  return (
    <button
      onClick={handlePurchase}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
    >
      Buy Full Report
    </button>
  );
}

export default PurchaseReport;