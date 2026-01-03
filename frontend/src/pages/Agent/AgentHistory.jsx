import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../../services/api';

const AgentHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await bookingsAPI.getMy();
                setBookings(data || []);
            } catch (err) {
                setError(err.message || 'Failed to fetch booking history');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getStatusBadge = (status) => {
        const badges = {
            'pending': 'bg-warning-light text-warning',
            'confirmed': 'bg-success-light text-success',
            'cancelled': 'bg-danger-light text-danger',
            'paid': 'bg-primary-light text-primary'
        };
        const colors = badges[status] || 'bg-light text-secondary';
        return <span className={`badge rounded-pill px-3 py-2 fw-bold x-small ${colors}`}>{status.toUpperCase()}</span>;
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;

    return (
        <div className="container-fluid p-0">
            {error && <div className="alert alert-danger mb-4 rounded-4 shadow-sm">{error}</div>}

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="fw-bold mb-1">Booking History</h4>
                        <p className="text-muted small mb-0">Track all your client reservations and payouts</p>
                    </div>
                    <div className="d-flex gap-2">
                        <select className="form-select form-select-sm rounded-pill px-3 border-light bg-light" style={{ width: '150px' }}>
                            <option>All Services</option>
                            <option>Tours</option>
                            <option>Hotels</option>
                            <option>Flights</option>
                        </select>
                        <button className="btn btn-primary btn-sm rounded-pill px-4 fw-bold shadow-sm">
                            <i className="fa fa-plus me-2"></i>New Booking
                        </button>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4 py-3 border-0 x-small text-uppercase text-muted fw-bold">ID</th>
                                    <th className="border-0 x-small text-uppercase text-muted fw-bold">Service Details</th>
                                    <th className="border-0 x-small text-uppercase text-muted fw-bold">Client</th>
                                    <th className="border-0 x-small text-uppercase text-muted fw-bold">Date</th>
                                    <th className="border-0 x-small text-uppercase text-muted fw-bold">Internal Price</th>
                                    <th className="border-0 x-small text-uppercase text-muted fw-bold">Status</th>
                                    <th className="border-0 text-center x-small text-uppercase text-muted fw-bold">Manage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5">
                                            <div className="py-5">
                                                <i className="fa fa-inbox fs-1 opacity-10 d-block mb-3"></i>
                                                <p className="text-muted mb-0">No active bookings found in your history.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking._id} className="border-bottom">
                                            <td className="ps-4 fw-bold text-dark small">#{booking._id.substring(18).toUpperCase()}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-light p-2 rounded i-2 me-3 text-primary">
                                                        <i className="fa fa-suitcase"></i>
                                                    </div>
                                                    <div>
                                                        <span className="d-block fw-bold small text-dark">{booking.tour?.title || 'B2B Package'}</span>
                                                        <span className="text-muted x-small">Partner Rate Applied</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="small text-dark fw-medium">{booking.name}</td>
                                            <td className="small text-muted">{new Date(booking.createdAt).toLocaleDateString()}</td>
                                            <td className="fw-bold text-primary">${booking.totalPrice || 0}</td>
                                            <td>{getStatusBadge(booking.status || 'pending')}</td>
                                            <td className="text-center">
                                                <button className="btn btn-sm btn-icon rounded-circle hover-bg-light">
                                                    <i className="fa fa-ellipsis-v text-muted"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
                .x-small { font-size: 11px; letter-spacing: 0.5px; }
                .text-primary { color: #30c39e !important; }
                .bg-primary-light { background-color: rgba(48, 195, 158, 0.1) !important; }
                .text-success { color: #28a745 !important; }
                .bg-success-light { background-color: rgba(40, 167, 69, 0.1) !important; }
                .text-warning { color: #ffc107 !important; }
                .bg-warning-light { background-color: rgba(255, 193, 7, 0.1) !important; }
                .text-danger { color: #dc3545 !important; }
                .bg-danger-light { background-color: rgba(220, 53, 69, 0.1) !important; }
                .btn-primary { background-color: #30c39e; border-color: #30c39e; }
                .btn-icon { width: 32px; height: 32px; display: inline-flex; alignItems: center; justifyContent: center; border: none; background: transparent; }
                .hover-bg-light:hover { background-color: #f8f9fa; }
            `}</style>
        </div>
    );
};

export default AgentHistory;
