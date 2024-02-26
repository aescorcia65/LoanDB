import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function UserInfo() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ClientId = queryParams.get('ClientId');
    const [userInfo, setUserInfo] = useState({
        ClientName: "",
        LoanId: "LX-",
        LoanAmount: 0,
        PrincipalRemaining: 0,
        ActiveStatus: 0,
        LoanLength: 0,
        PaymentFrequency: "",
        InterestAmount: 0,
        PaymentDueAmount: 0,
        PaymentRecAmount: null,
        PaidStatus: 0,
        PrincipalPaymentRec: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const apiUrl = `/api/user-info?client_id=${ClientId}`;
            try {
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setUserInfo(data.data[0]);
            } catch (error) {
                console.error("Failed to fetch data: ", error);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        if (ClientId) {
            fetchData();
        }
    }, [ClientId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!userInfo) return <div>No user info available</div>;

    function HomePagenav() {
        navigate('/')
    }

    return (
        <div>
        <div className="sharkcage">
        


            <div className="container4">
                <button onClick={HomePagenav}>Cancel</button>
                <h1>USER INFO</h1>

                <div className="payment-record">
                    <span className="record-field record-label">Name:</span>
                    <span className="record-field record-date">{userInfo.ClientName != null ? userInfo.ClientName : "Example"}</span>

                    <span className="record-field record-label">Total Interest Paid</span>
                    <span className="record-field record-amount">{userInfo.PaymentRecAmount != null ? userInfo.PaymentRecAmount : 0}</span>

                    <span className="record-field record-label">Total Interest Due</span>
                    <span className="record-field record-notes">{userInfo.PaymentDueAmount != null ? userInfo.PaymentDueAmount : 0}</span>

                    <span className="record-field record-label">Total Principal Paid</span>
                    <span className="record-field record-notes">{userInfo.PrincipalPaymentRec != null ? userInfo.PrincipalPaymentRec : 0}</span>

                    <span className="record-field record-label">Total Principal Due</span>
                    <span className="record-field record-notes">{userInfo.PrincipalRemaining != null ? userInfo.PrincipalRemaining : 0}</span>

                    <span className="record-field record-label">Current Loans</span>
                    <span className="record-field record-notes">{userInfo.LoanId != null ? userInfo.LoanId : "LX-"}</span>

                </div>

            </div>
        </div>
        </div>
    );
}

export default UserInfo;
