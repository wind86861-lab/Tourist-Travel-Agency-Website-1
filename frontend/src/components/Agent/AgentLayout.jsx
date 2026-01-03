import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AgentLayout = () => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/agent', label: 'Dashboard', icon: 'fa-chart-line' },
        { path: '/agent/search/tours', label: 'Search Tours', icon: 'fa-map-marked-alt' },
        { path: '/agent/history', label: 'Booking History', icon: 'fa-calendar-check' },
    ];

    return (
        <div className="agent-container d-flex" style={{ minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
            {/* Sidebar */}
            <div className="agent-sidebar bg-white shadow-sm d-flex flex-column" style={{ width: '280px', position: 'fixed', height: '100vh', zIndex: 1000 }}>
                <div className="p-4 border-bottom">
                    <h4 className="text-primary m-0 fw-bold">
                        <i className="fa fa-shuttle-van me-2"></i>Agent Cabinet
                    </h4>
                </div>

                <div className="flex-grow-1 py-3 px-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`d-flex align-items-center p-3 mb-1 rounded-3 text-decoration-none transition-all ${location.pathname === item.path
                                ? 'bg-primary text-white shadow'
                                : 'text-secondary hover-bg-light'
                                }`}
                        >
                            <i className={`fa ${item.icon} me-3`} style={{ width: '20px' }}></i>
                            <span className="fw-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="p-4 border-top">
                    <button onClick={handleLogout} className="btn btn-outline-danger w-100 rounded-pill py-2 small fw-bold mb-3">
                        <i className="fa fa-sign-out-alt me-2"></i>Logout
                    </button>
                    <Link to="/" className="text-muted text-decoration-none x-small fw-bold d-block text-center">
                        <i className="fa fa-arrow-left me-2"></i>Back to Site
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="agent-main-content flex-grow-1" style={{ marginLeft: '280px' }}>
                {/* Topbar */}
                <header className="bg-white shadow-sm py-3 px-4 d-flex justify-content-between align-items-center sticky-top">
                    <div className="search-bar border rounded-pill px-3 py-1 bg-light d-flex align-items-center" style={{ width: '300px' }}>
                        <i className="fa fa-search text-muted me-2"></i>
                        <input type="text" className="form-control border-0 bg-transparent shadow-none small" placeholder="Search bookings..." />
                    </div>

                    <div className="d-flex align-items-center">
                        <div className="position-relative me-4">
                            <i className="fa fa-bell text-secondary cursor-pointer"></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light" style={{ fontSize: '10px' }}>2</span>
                        </div>
                        <div className="d-flex align-items-center border-start ps-4">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.officialName || 'Agent'}&background=30c39e&color=fff`}
                                className="rounded-circle me-2 shadow-sm"
                                style={{ width: '35px' }}
                                alt="Agent"
                            />
                            <div className="lh-1">
                                <span className="d-block fw-bold small text-dark">{user?.officialName || 'B2B Partner'}</span>
                                <span className="text-success x-small fw-bold">Active Partner</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4">
                    <Outlet />
                </main>
            </div>

            <style>{`
                :root {
                    --primary: #30c39e;
                }
                .text-primary {
                    color: #30c39e !important;
                }
                .bg-primary {
                    background-color: #30c39e !important;
                }
                .btn-primary {
                    background-color: #30c39e;
                    border-color: #30c39e;
                }
                .btn-outline-primary {
                    color: #30c39e;
                    border-color: #30c39e;
                }
                .btn-outline-primary:hover {
                    background-color: #30c39e;
                    border-color: #30c39e;
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
                .hover-bg-light:hover {
                    background-color: #f8f9fa;
                    color: #30c39e !important;
                }
                .x-small {
                    font-size: 11px;
                }
                .cursor-pointer {
                    cursor: pointer;
                }
                .shadow {
                    box-shadow: 0 .5rem 1rem rgba(48, 195, 158, .15) !important;
                }
            `}</style>
        </div>
    );
};

export default AgentLayout;
