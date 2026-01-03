import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { login } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            if (user.role === 'agent') {
                navigate('/agent');
            } else {
                navigate('/');
            }
        } catch (err) {
            if (err.message === 'Account pending approval') {
                navigate('/pending-approval');
            } else {
                setError(err.message || 'Login failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                    <h6 className="section-title bg-white text-center text-primary px-3">Authentication</h6>
                    <h1 className="mb-5">Login to Your Account</h1>
                </div>
                <div className="row g-4 justify-content-center">
                    <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                        <div className="bg-light p-5 rounded shadow-sm">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                placeholder="Your Email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                            <label htmlFor="email">Email Address</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <label htmlFor="password">Password</label>
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="col-12">
                                            <div className="alert alert-danger mb-0" role="alert">
                                                {error}
                                            </div>
                                        </div>
                                    )}
                                    <div className="col-12">
                                        <button className="btn btn-primary w-100 py-3" type="submit" disabled={loading}>
                                            {loading ? 'Logging in...' : 'Login'}
                                        </button>
                                    </div>
                                    <div className="col-12 text-center">
                                        <p className="mb-0">
                                            Don't have an account? <br />
                                            <Link to="/register-b2b" className="text-primary fw-bold">Register as B2B Partner</Link>
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
