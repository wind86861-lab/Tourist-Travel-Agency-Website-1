import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';

const ConfirmRegistrations = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            setLoading(true);
            const data = await usersAPI.getPending();
            setPendingUsers(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch pending registrations');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm('Are you sure you want to approve this partner?')) return;
        try {
            setActionLoading(true);
            await usersAPI.approve(id);
            setPendingUsers(pendingUsers.filter(u => u._id !== id));
            setSelectedUser(null);
            alert('Partner approved successfully!');
        } catch (err) {
            alert(err.message || 'Approval failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Are you sure you want to REJECT and DELETE this application?')) return;
        try {
            setActionLoading(true);
            await usersAPI.delete(id);
            setPendingUsers(pendingUsers.filter(u => u._id !== id));
            setSelectedUser(null);
            alert('Application rejected and removed.');
        } catch (err) {
            alert(err.message || 'Rejection failed');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0 text-primary">Registration Confirmations</h3>
                <button className="btn btn-outline-primary btn-sm rounded-pill px-3" onClick={fetchPendingUsers}>
                    <i className="fa fa-sync-alt me-2"></i>Refresh List
                </button>
            </div>

            {error && <div className="alert alert-danger mb-4">{error}</div>}

            <div className="row">
                <div className={selectedUser ? "col-lg-7" : "col-12"}>
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="fw-bold mb-0">Pending Applications ({pendingUsers.length})</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="list-group list-group-flush">
                                {pendingUsers.length === 0 ? (
                                    <div className="p-5 text-center text-muted">
                                        <i className="fa fa-user-clock fs-1 opacity-25 mb-3"></i>
                                        <p>No pending registrations at the moment.</p>
                                    </div>
                                ) : (
                                    pendingUsers.map(user => (
                                        <div
                                            key={user._id}
                                            className={`list-group-item list-group-item-action p-4 border-start border-4 ${selectedUser?._id === user._id ? 'border-primary bg-light' : 'border-transparent'}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary text-white rounded-circle p-3 me-3 fw-bold" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {(user.officialName || user.name || 'U').substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h6 className="fw-bold mb-1">{user.officialName || user.name}</h6>
                                                    <div className="d-flex flex-wrap gap-2 small text-muted">
                                                        <span><i className="fa fa-envelope me-1"></i>{user.email}</span>
                                                        <span><i className="fa fa-phone me-1"></i>{user.phone}</span>
                                                        <span><i className="fa fa-clock me-1"></i>{new Date(user.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <i className="fa fa-chevron-right text-muted small ms-3"></i>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {selectedUser && (
                    <div className="col-lg-5 mt-4 mt-lg-0">
                        <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '20px' }}>
                            <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0">Application Details</h5>
                                <button className="btn-close" onClick={() => setSelectedUser(null)}></button>
                            </div>
                            <div className="card-body p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                                <section className="mb-4">
                                    <h6 className="text-uppercase text-muted fw-bold x-small mb-3 border-bottom pb-1">General Information</h6>
                                    <table className="table table-sm table-borderless small mb-0">
                                        <tbody>
                                            <tr><td className="text-muted" style={{ width: '40%' }}>Official Name:</td><td className="fw-bold">{selectedUser.officialName}</td></tr>
                                            <tr><td className="text-muted">Latin Name:</td><td>{selectedUser.latinName || '-'}</td></tr>
                                            <tr><td className="text-muted">Head Person:</td><td>{selectedUser.headName}</td></tr>
                                            <tr><td className="text-muted">TIN / BIN:</td><td>{selectedUser.tin}</td></tr>
                                            <tr><td className="text-muted">City/Address:</td><td>{selectedUser.city}, {selectedUser.address}</td></tr>
                                            <tr><td className="text-muted">Mailing Email:</td><td>{selectedUser.emailForMailings}</td></tr>
                                            <tr><td className="text-muted">VAT Rate:</td><td>{selectedUser.vatRate || '-'}</td></tr>
                                        </tbody>
                                    </table>
                                </section>

                                {selectedUser.registrationCertificate && (
                                    <section className="mb-4">
                                        <h6 className="text-uppercase text-muted fw-bold x-small mb-3 border-bottom pb-1">Registration Certificate</h6>
                                        <table className="table table-sm table-borderless small mb-0">
                                            <tbody>
                                                <tr><td className="text-muted" style={{ width: '40%' }}>Authority:</td><td>{selectedUser.registrationCertificate.authority}</td></tr>
                                                <tr><td className="text-muted">Series/Number:</td><td>{selectedUser.registrationCertificate.series} {selectedUser.registrationCertificate.number}</td></tr>
                                            </tbody>
                                        </table>
                                    </section>
                                )}

                                {selectedUser.bankingDetails && (
                                    <section className="mb-4">
                                        <h6 className="text-uppercase text-muted fw-bold x-small mb-3 border-bottom pb-1">Banking & Ownership</h6>
                                        <table className="table table-sm table-borderless small mb-0">
                                            <tbody>
                                                <tr><td className="text-muted" style={{ width: '40%' }}>Ownership:</td><td>{selectedUser.bankingDetails.ownershipForm}</td></tr>
                                                <tr><td className="text-muted">Account #:</td><td>{selectedUser.bankingDetails.accountNumber}</td></tr>
                                                <tr><td className="text-muted">Zip Code:</td><td>{selectedUser.bankingDetails.zipCode}</td></tr>
                                                <tr><td className="text-muted">Accounting Phone:</td><td>{selectedUser.bankingDetails.accountingPhone}</td></tr>
                                            </tbody>
                                        </table>
                                    </section>
                                )}

                                {selectedUser.documents && selectedUser.documents.length > 0 && (
                                    <section className="mb-4">
                                        <h6 className="text-uppercase text-muted fw-bold x-small mb-3 border-bottom pb-1">Attached Documents</h6>
                                        <div className="d-grid gap-2">
                                            {selectedUser.documents.map((doc, idx) => (
                                                <a
                                                    key={idx}
                                                    href={`http://localhost:5000${doc}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-outline-info text-start d-flex align-items-center"
                                                >
                                                    <i className="fa fa-file-alt me-2"></i>
                                                    <span className="text-truncate">Document {idx + 1}</span>
                                                    <i className="fa fa-external-link-alt ms-auto small"></i>
                                                </a>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {selectedUser.comment && (
                                    <div className="bg-light p-3 rounded mb-4">
                                        <small className="text-muted d-block mb-1">Comment:</small>
                                        <p className="mb-0 small fst-italic">{selectedUser.comment}</p>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer bg-white p-4 border-0">
                                <div className="row g-2">
                                    <div className="col-8">
                                        <button
                                            className="btn btn-success w-100 py-2 rounded-pill fw-bold"
                                            onClick={() => handleApprove(selectedUser._id)}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? 'Processing...' : 'Approve Partner'}
                                        </button>
                                    </div>
                                    <div className="col-4">
                                        <button
                                            className="btn btn-outline-danger w-100 py-2 rounded-pill fw-bold"
                                            onClick={() => handleReject(selectedUser._id)}
                                            disabled={actionLoading}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmRegistrations;
