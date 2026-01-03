import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
                    <p className="text-muted">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Check admin role if required
    if (requireAdmin && !isAdmin()) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="text-center">
                    <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                        <i className="fa fa-ban fs-1"></i>
                    </div>
                    <h3 className="fw-bold mb-2">Access Denied</h3>
                    <p className="text-muted mb-4">You don't have admin privileges to access this page.</p>
                    <a href="/" className="btn btn-primary rounded-pill px-4">Go to Home</a>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
