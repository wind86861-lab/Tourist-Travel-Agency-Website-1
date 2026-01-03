import React from 'react';

const AgentSearch = ({ type }) => {
    return (
        <div className="container-fluid p-0">
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-4" style={{ width: '120px', height: '120px' }}>
                    <i className={`fa ${type === 'hotels' ? 'fa-hotel' : 'fa-plane'} fa-4x text-primary opacity-50`}></i>
                </div>
                <h2 className="fw-bold mb-3">B2B {type.charAt(0).toUpperCase() + type.slice(1)} Global Search</h2>
                <p className="text-muted lead mx-auto mb-5" style={{ maxWidth: '650px' }}>
                    Access our exclusive global inventory with special <span className="text-primary fw-bold">partner-only rates</span>.
                    We are currently integrating the API for real-time bookings.
                </p>

                <div className="row g-4 justify-content-center mb-5">
                    <div className="col-md-3">
                        <div className="p-3 border rounded-3 bg-light">
                            <h5 className="fw-bold mb-1">500,000+</h5>
                            <span className="x-small text-muted text-uppercase">Direct Contracts</span>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="p-3 border rounded-3 bg-light">
                            <h5 className="fw-bold mb-1">24/7</h5>
                            <span className="x-small text-muted text-uppercase">Partner Support</span>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="p-3 border rounded-3 bg-light">
                            <h5 className="fw-bold mb-1">Instant</h5>
                            <span className="x-small text-muted text-uppercase">Confirmation</span>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow">
                        Request API Key
                    </button>
                    <button className="btn btn-outline-secondary rounded-pill px-5 py-3 fw-bold">
                        View Documentation
                    </button>
                </div>
            </div>

            <style>{`
                .text-primary { color: #30c39e !important; }
                .btn-primary { background-color: #30c39e; border-color: #30c39e; }
                .btn-primary:hover { background-color: #28a686; border-color: #28a686; }
                .x-small { font-size: 11px; }
            `}</style>
        </div>
    );
};

export default AgentSearch;
