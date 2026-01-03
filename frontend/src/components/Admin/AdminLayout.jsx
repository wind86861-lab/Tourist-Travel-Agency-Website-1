import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: 'fa-chart-line' },
        { path: '/admin/bookings', label: 'Bookings', icon: 'fa-calendar-check' },
        { path: '/admin/calendar', label: 'Tour Calendar', icon: 'fa-calendar-alt' },
        { path: '/admin/tours', label: 'Manage Tours', icon: 'fa-map' },
        { path: '/admin/tours/create', label: 'Create New Tour', icon: 'fa-plus-circle' },
        { path: '/admin/tours/create-b2b', label: 'Create B2B Tour', icon: 'fa-suitcase-rolling' },
        { path: '/admin/confirmations', label: 'Confirmations', icon: 'fa-user-check' },
        { path: '/admin/settings', label: 'Site View', icon: 'fa-palette' },
    ];

    return (
        <div className="admin-container d-flex" style={{ minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
            {/* Sidebar */}
            <div className="admin-sidebar bg-white shadow-sm d-flex flex-column" style={{ width: '280px', position: 'fixed', height: '100vh', zIndex: 1000 }}>
                <div className="p-4 border-bottom">
                    <h4 className="text-primary m-0 fw-bold">
                        <i className="fa fa-shuttle-van me-2"></i>Avocado Admin
                    </h4>
                </div>
                <div className="flex-grow-1 py-3 px-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`d-flex align-items-center p-3 mb-1 rounded-3 text-decoration-none transition-all ${location.pathname === item.path ? 'bg-primary text-white shadow' : 'text-secondary hover-bg-light'}`}
                        >
                            <i className={`fa ${item.icon} me-3`} style={{ width: '20px' }}></i>
                            <span className="fw-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
                <div className="p-4 border-top">
                    <Link to="/" className="text-danger text-decoration-none small fw-bold">
                        <i className="fa fa-sign-out-alt me-2"></i>Back to Site
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-main-content flex-grow-1" style={{ marginLeft: '280px' }}>
                {/* Topbar */}
                <header className="bg-white shadow-sm py-3 px-4 d-flex justify-content-between align-items-center sticky-top">
                    <div className="search-bar border rounded-pill px-3 py-1 bg-light d-flex align-items-center" style={{ width: '300px' }}>
                        <i className="fa fa-search text-muted me-2"></i>
                        <input type="text" className="form-control border-0 bg-transparent shadow-none small" placeholder="Search data..." />
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="position-relative me-4">
                            <i className="fa fa-bell text-secondary cursor-pointer"></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light" style={{ fontSize: '10px' }}>3</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <img src="https://ui-avatars.com/api/?name=Admin+User&background=30c39e&color=fff" className="rounded-circle me-2 shadow-sm" style={{ width: '35px' }} alt="Admin" />
                            <div className="lh-1">
                                <span className="d-block fw-bold small">Admin User</span>
                                <span className="text-muted x-small">Super Admin</span>
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
            `}</style>
        </div>
    );
};

export default AdminLayout;
