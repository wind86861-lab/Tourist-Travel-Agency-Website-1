import React, { useState } from 'react';

const B2BSearchResults = ({ results, loading }) => {
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!results || results.length === 0) {
        return (
            <div className="text-center py-5 bg-light rounded-4">
                <i className="fa fa-search fa-3x text-muted opacity-25 mb-3"></i>
                <p className="text-muted">No results found. Try adjusting your filters.</p>
            </div>
        );
    }

    return (
        <div className="b2b-results-container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">{results.length} Results Found</h5>
                <div className="d-flex gap-2">
                    <span className="badge bg-light text-dark border"><i className="fa fa-filter me-1"></i> Best Match</span>
                    <span className="badge bg-light text-dark border"><i className="fa fa-sort me-1"></i> Price: Low to High</span>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 b2b-table">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4 border-0 x-small text-uppercase text-muted fw-bold">Age</th>
                                <th className="border-0 x-small text-uppercase text-muted fw-bold">Price</th>
                                <th className="border-0 x-small text-uppercase text-muted fw-bold">ID</th>
                                <th className="border-0 x-small text-uppercase text-muted fw-bold">Origin</th>
                                <th className="border-0 x-small text-uppercase text-muted fw-bold">Destination</th>
                                <th className="border-0 x-small text-uppercase text-muted fw-bold">Date</th>
                                <th className="border-0 x-small text-uppercase text-muted fw-bold">Duration</th>
                                <th className="border-0 x-small text-uppercase text-muted fw-bold">Company</th>
                                <th className="border-0 text-center x-small text-uppercase text-muted fw-bold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((item) => (
                                <React.Fragment key={item._id}>
                                    <tr
                                        onClick={() => toggleRow(item._id)}
                                        className={`cursor-pointer ${expandedRow === item._id ? 'bg-primary bg-opacity-10' : ''}`}
                                    >
                                        <td className="ps-4 small text-muted">2m</td>
                                        <td className="fw-bold text-success">${item.price}</td>
                                        <td className="text-primary small fw-bold">#{item._id.substring(item._id.length - 6).toUpperCase()}</td>
                                        <td className="small">Tashkent, UZ</td>
                                        <td className="small fw-bold">{item.destination || item.title}</td>
                                        <td className="small">{new Date().toLocaleDateString()}</td>
                                        <td className="small">{item.duration || '7'} Days</td>
                                        <td className="small text-primary">Avocado Broker</td>
                                        <td className="text-center">
                                            <i className={`fa fa-chevron-${expandedRow === item._id ? 'up' : 'down'} text-muted small`}></i>
                                        </td>
                                    </tr>
                                    {expandedRow === item._id && (
                                        <tr className="bg-white">
                                            <td colSpan="9" className="p-0 border-0">
                                                <div className="p-4 border-start border-primary border-4 animate__animated animate__fadeIn">
                                                    <div className="row">
                                                        <div className="col-md-7">
                                                            <h5 className="fw-bold mb-3">{item.title}</h5>
                                                            <p className="text-muted small mb-4">{item.description}</p>
                                                            <div className="row g-3">
                                                                <div className="col-6">
                                                                    <div className="d-flex align-items-center small text-muted">
                                                                        <i className="fa fa-hotel me-2 text-primary"></i>
                                                                        <span>5* Premium Hotel included</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="d-flex align-items-center small text-muted">
                                                                        <i className="fa fa-plane me-2 text-primary"></i>
                                                                        <span>Round-trip flights included</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="d-flex align-items-center small text-muted">
                                                                        <i className="fa fa-utensils me-2 text-primary"></i>
                                                                        <span>All-inclusive meal plan</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="d-flex align-items-center small text-muted">
                                                                        <i className="fa fa-shield-alt me-2 text-primary"></i>
                                                                        <span>Travel insurance covered</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-5 border-start">
                                                            <div className="ps-4">
                                                                <div className="bg-light p-3 rounded-3 mb-3">
                                                                    <div className="d-flex justify-content-between mb-2">
                                                                        <span className="small text-muted">Base Fare (Net):</span>
                                                                        <span className="small fw-bold">${item.price - 50}</span>
                                                                    </div>
                                                                    <div className="d-flex justify-content-between mb-2">
                                                                        <span className="small text-muted">Agent Commission:</span>
                                                                        <span className="small fw-bold text-success">+$50</span>
                                                                    </div>
                                                                    <hr className="my-2" />
                                                                    <div className="d-flex justify-content-between">
                                                                        <span className="fw-bold">Total Payout:</span>
                                                                        <span className="fw-bold text-primary">${item.price}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="d-flex gap-2">
                                                                    <button className="btn btn-primary flex-grow-1 fw-bold rounded-pill py-2">
                                                                        Book Now
                                                                    </button>
                                                                    <button className="btn btn-outline-secondary rounded-pill px-3">
                                                                        <i className="fa fa-share-alt"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .b2b-table thead th {
                    background-color: #f8f9fa;
                    padding: 12px 15px;
                }
                .b2b-table tbody tr td {
                    padding: 12px 15px;
                    border-bottom: 1px solid #f1f2f4;
                }
                .b2b-table tbody tr:hover {
                    background-color: #fdfdfd;
                }
                .x-small {
                    font-size: 11px;
                    letter-spacing: 0.5px;
                }
                .cursor-pointer {
                    cursor: pointer;
                }
                .animate__fadeIn {
                    animation: fadeIn 0.3s;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default B2BSearchResults;
