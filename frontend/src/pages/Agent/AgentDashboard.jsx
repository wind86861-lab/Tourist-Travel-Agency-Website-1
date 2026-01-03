import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AgentDashboard = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Active Bookings', value: '12', icon: 'fa-calendar-check', color: '#30c39e' },
        { label: 'Total Volume', value: '$14,250', icon: 'fa-dollar-sign', color: '#30c39e' },
        { label: 'Pending Docs', value: '0', icon: 'fa-file-invoice', color: '#30c39e' },
        { label: 'Notifications', value: '3', icon: 'fa-bell', color: '#ffc107' },
    ];

    const searchTools = [
        {
            title: 'Tours',
            desc: 'Find premium tour packages worldwide',
            icon: 'fa-map-marked-alt',
            link: '/agent/search/tours',
            color: '#30c39e'
        },
        {
            title: 'Hotels',
            desc: 'Search 500,000+ hotels at B2B rates',
            icon: 'fa-hotel',
            link: '/agent/search/hotels',
            color: '#30c39e'
        },
        {
            title: 'Flights',
            desc: 'Book international & domestic flights',
            icon: 'fa-plane-departure',
            link: '/agent/search/flights',
            color: '#30c39e'
        },
    ];

    return (
        <div className="container-fluid p-0">
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold m-0">Dashboard Overview</h3>
                    <p className="text-muted small mb-0">Welcome back to your partner cabinet, {user?.officialName}</p>
                </div>
                <div className="text-end">
                    <button className="btn btn-white shadow-sm rounded-pill px-4 btn-sm fw-bold">
                        <i className="fa fa-download me-2 text-primary"></i>Export Report
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="row g-4 mb-4">
                {stats.map((stat, idx) => (
                    <div className="col-md-3 col-sm-6" key={idx}>
                        <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="p-3 rounded-3 bg-light text-primary">
                                    <i className={`fa ${stat.icon} fs-4`} style={{ color: stat.color }}></i>
                                </div>
                                <span className="badge bg-light text-success border">+12.5%</span>
                            </div>
                            <h6 className="text-muted x-small text-uppercase fw-bold mb-1">{stat.label}</h6>
                            <h3 className="fw-bold mb-0">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Section */}
            <div className="row g-4 mb-5">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold m-0"><i className="fa fa-search me-2 text-primary"></i>Partner Search Tools</h5>
                            <Link to="/agent/search/tours" className="text-primary small text-decoration-none fw-bold">All Services <i className="fa fa-arrow-right ms-1"></i></Link>
                        </div>
                        <div className="row g-3">
                            {searchTools.map((tool, idx) => (
                                <div className="col-md-4" key={idx}>
                                    <Link to={tool.link} className="text-decoration-none">
                                        <div className="p-4 rounded-4 bg-light border-0 transition-all hover-translate-y text-center h-100">
                                            <i className={`fa ${tool.icon} fs-1 mb-3`} style={{ color: tool.color }}></i>
                                            <h6 className="fw-bold mb-1 text-dark">{tool.title}</h6>
                                            <p className="text-muted x-small mb-0">{tool.desc}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                        <h5 className="fw-bold mb-4">Recent Notifications</h5>
                        <div className="list-group list-group-flush">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="list-group-item px-0 py-3 border-0 border-bottom">
                                    <div className="d-flex">
                                        <div className="bg-light p-2 rounded-circle me-3 flex-shrink-0" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa fa-info-circle text-info"></i>
                                        </div>
                                        <div>
                                            <p className="small mb-1 fw-bold">Booking #{i}452 confirmed</p>
                                            <span className="text-muted x-small">2 hours ago • System Update</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .hover-translate-y:hover {
                    transform: translateY(-5px);
                    background-color: #fff !important;
                    box-shadow: 0 .5rem 1rem rgba(0,0,0,.05) !important;
                }
                .text-primary {
                    color: #30c39e !important;
                }
                .x-small {
                    font-size: 11px;
                }
            `}</style>
        </div>
    );
};

export default AgentDashboard;
