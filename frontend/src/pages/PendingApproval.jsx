import React from 'react';
import { Link } from 'react-router-dom';

const PendingApproval = () => {
    return (
        <div className="container-xxl py-5 mt-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 text-center wow fadeInUp" data-wow-delay="0.1s">
                        <div className="bg-light p-5 rounded shadow-lg border-top border-warning border-5">
                            <i className="fa fa-hourglass-half fa-4x text-warning mb-4"></i>
                            <h1 className="display-6 mb-3">Account Pending Approval</h1>
                            <p className="lead mb-4">
                                Thank you for registering your business with Avocado Tour.
                                Your B2B partner application is currently being reviewed by our administration team.
                            </p>
                            <div className="alert alert-info py-3 mb-4">
                                <i className="fa fa-info-circle me-2"></i>
                                Standard review process takes 1-2 business days. You will receive an email once your account is activated.
                            </div>
                            <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                                <Link to="/" className="btn btn-primary px-4 py-2 rounded-pill">
                                    Return to Home
                                </Link>
                                <Link to="/contact" className="btn btn-outline-secondary px-4 py-2 rounded-pill">
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingApproval;
