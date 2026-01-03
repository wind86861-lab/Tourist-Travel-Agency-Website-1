import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const user = await login(email, password);
            if (user.role !== 'admin') {
                setError('Access denied. Admin privileges required.');
                return;
            }
            navigate('/admin');
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card border-0 shadow-lg rounded-4 p-5" style={{ maxWidth: '420px', width: '100%' }}>
                <div className="text-center mb-4">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                        <i className="fa fa-shield-alt fs-4"></i>
                    </div>
                    <h4 className="fw-bold mb-1">Admin Panel</h4>
                    <p className="text-muted small">Sign in to access the dashboard</p>
                </div>

                {error && (
                    <div className="alert alert-danger py-2 small">
                        <i className="fa fa-exclamation-triangle me-2"></i>{error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-muted">EMAIL</label>
                        <input
                            type="email"
                            className="form-control bg-light border-0 py-2"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-muted">PASSWORD</label>
                        <input
                            type="password"
                            className="form-control bg-light border-0 py-2"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 fw-bold rounded-pill"
                        disabled={loading}
                    >
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</>
                        ) : (
                            <>Sign In</>
                        )}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <a href="/" className="text-muted small text-decoration-none">
                        <i className="fa fa-arrow-left me-1"></i> Back to main site
                    </a>
                </div>
            </div>

            <style>{`
                .form-control:focus {
                    box-shadow: 0 0 0 3px rgba(48, 195, 158, 0.15);
                    border-color: #30c39e;
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;
