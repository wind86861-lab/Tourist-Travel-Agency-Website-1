import React from 'react';

const SiteSettings = () => {
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0">Site Appearance</h3>
            </div>
            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                        <h6 className="fw-bold mb-4">Visual Identity (CMS)</h6>
                        <div className="row g-3">
                            <div className="col-md-12">
                                <label className="form-label small fw-bold text-muted">MAIN SITE TITLE</label>
                                <input type="text" className="form-control bg-light border-0 py-2" defaultValue="Avocado Tour" />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label small fw-bold text-muted">SITE SLOGAN</label>
                                <input type="text" className="form-control bg-light border-0 py-2" defaultValue="Explore the World with Us" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small fw-bold text-muted">PRIMARY COLOR</label>
                                <input type="color" className="form-control form-control-color w-100 border-0 bg-light" defaultValue="#30c39e" />
                            </div>
                            <div className="col-md-12 mt-4 text-end">
                                <button className="btn btn-primary rounded-pill px-5 shadow">Update Appearance</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                        <h6 className="fw-bold mb-4">Site Logo</h6>
                        <div className="border rounded-4 p-4 text-center bg-light">
                            <i className="fa fa-map-marker-alt fs-1 text-primary mb-2"></i>
                            <h6 className="fw-bold mb-0">Avocado Tour</h6>
                        </div>
                        <button className="btn btn-outline-secondary btn-sm w-100 mt-3 rounded-pill">Upload New Logo</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteSettings;
