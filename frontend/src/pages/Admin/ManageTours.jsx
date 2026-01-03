import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toursAPI } from '../../services/api';

const ManageTours = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, tour: null });
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [discountForm, setDiscountForm] = useState({ type: 'none', value: 0 });

    useEffect(() => {
        const handleClickOutside = () => setContextMenu({ ...contextMenu, visible: false });
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [contextMenu]);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            setLoading(true);
            const data = await toursAPI.getAll('');
            setTours(data);
        } catch (err) {
            setError(err.message || 'Failed to load tours');
        } finally {
            setLoading(false);
        }
    };

    const deleteTour = async (id) => {
        if (window.confirm('Are you sure you want to delete this tour?')) {
            try {
                await toursAPI.delete(id);
                setTours(tours.filter(t => t._id !== id));
            } catch (err) {
                alert('Failed to delete: ' + err.message);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleContextMenu = (e, tour) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            tour: tour
        });
    };

    const toggleStatus = async (tour, field) => {
        try {
            const updatedTour = await toursAPI.update(tour._id, {
                [field]: !tour[field]
            });
            setTours(tours.map(t => t._id === tour._id ? updatedTour : t));
        } catch (err) {
            alert('Failed to update: ' + err.message);
        }
    };

    const handleDiscountSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedTour = await toursAPI.update(contextMenu.tour._id, {
                discountType: discountForm.type,
                discountValue: parseFloat(discountForm.value) || 0
            });
            setTours(tours.map(t => t._id === contextMenu.tour._id ? updatedTour : t));
            setShowDiscountModal(false);
        } catch (err) {
            alert('Failed to set discount: ' + err.message);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold m-0">Manage Tours</h3>
                    <p className="text-muted small">View and edit your published travel packages</p>
                </div>
                <Link to="/admin/tours/create" className="btn btn-primary rounded-pill px-4 shadow-sm">
                    <i className="fa fa-plus-circle me-2"></i>Create New Tour
                </Link>
            </div>

            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                {error && (
                    <div className="alert alert-danger">
                        <i className="fa fa-exclamation-circle me-2"></i>{error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary mb-3"></div>
                        <p className="text-muted">Loading tours...</p>
                    </div>
                ) : tours.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fa fa-folder-open fs-1 text-muted mb-3"></i>
                        <h5 className="fw-bold">No Tours Found</h5>
                        <p className="text-muted">Create your first tour to get started!</p>
                        <Link to="/admin/tours/create" className="btn btn-primary rounded-pill px-4">
                            <i className="fa fa-plus me-2"></i>Create Tour
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text bg-light border-0"><i className="fa fa-search text-muted"></i></span>
                                    <input type="text" className="form-control bg-light border-0 shadow-none" placeholder="Search by destination..." />
                                </div>
                            </div>
                            <div className="col-md-8 text-end">
                                <div className="btn-group btn-group-sm bg-light p-1 rounded-pill">
                                    <button className="btn btn-primary rounded-pill px-3 shadow-none border-0">All</button>
                                    <button className="btn btn-light rounded-pill px-3 shadow-none border-0">Active</button>
                                    <button className="btn btn-light rounded-pill px-3 shadow-none border-0">B2B Only</button>
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr className="small text-muted">
                                        <th>TOUR & ROUTE</th>
                                        <th>CHANNEL</th>
                                        <th>PACKAGE</th>
                                        <th>PRICE</th>
                                        <th>SPOTS</th>
                                        <th>STATUS</th>
                                        <th className="text-end">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tours.map(tour => (
                                        <tr
                                            key={tour._id}
                                            onContextMenu={(e) => handleContextMenu(e, tour)}
                                            className="context-menu-row"
                                        >
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="rounded overflow-hidden me-3" style={{ width: '50px', height: '50px' }}>
                                                        <img
                                                            src={tour.images?.[0] ? (tour.images[0].startsWith('http') ? tour.images[0] : `http://localhost:5000${tour.images[0]}`) : '/assets/img/package-1.jpg'}
                                                            alt=""
                                                            className="w-100 h-100"
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="d-block fw-bold small">{tour.title}</span>
                                                        <div className="d-flex gap-1 mt-1">
                                                            {tour.isPopular && <span className="badge bg-danger x-small">Mashhur</span>}
                                                            {tour.isGreatPackage && <span className="badge bg-success x-small">Ajoyib</span>}
                                                        </div>
                                                        <span className="x-small text-muted">{tour.fromCity} <i className="fa fa-long-arrow-alt-right mx-1"></i> {tour.toCity}</span>
                                                        {tour.startDate && <span className="d-block x-small text-primary mt-1 fw-bold"><i className="fa fa-calendar-alt me-1"></i> {formatDate(tour.startDate)}</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge x-small ${tour.tourType === 'B2B' ? 'bg-warning text-dark border border-warning' : 'bg-info text-white border border-info'}`}>
                                                    {tour.tourType}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="small fw-medium">{tour.packageType}</span>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-column">
                                                    <span className={`small fw-bold ${tour.discountType !== 'none' ? 'text-decoration-line-through text-muted' : 'text-primary'}`}>
                                                        ${tour.priceAdult}
                                                    </span>
                                                    {tour.discountType !== 'none' && (
                                                        <span className="small fw-bold text-danger">
                                                            ${tour.discountType === 'percentage'
                                                                ? (tour.priceAdult * (1 - tour.discountValue / 100)).toFixed(0)
                                                                : tour.priceAdult - tour.discountValue}
                                                            <span className="x-small ms-1">(-{tour.discountType === 'percentage' ? `${tour.discountValue}%` : `$${tour.discountValue}`})</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="small">{tour.availableSpots || tour.capacity} Available</span>
                                            </td>
                                            <td>
                                                <div className="form-check form-switch p-0 d-flex align-items-center">
                                                    <input className="form-check-input ms-0 me-2" type="checkbox" checked={tour.status === 'Active'} readOnly />
                                                    <span className={`x-small fw-bold ${tour.status === 'Active' ? 'text-success' : 'text-danger'}`}>{tour.status}</span>
                                                </div>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-1">
                                                    <Link to={`/admin/tours/edit/${tour._id}`} className="btn btn-sm btn-light rounded-circle shadow-none">
                                                        <i className="fa fa-edit text-primary"></i>
                                                    </Link>
                                                    <button className="btn btn-sm btn-light rounded-circle shadow-none" onClick={() => deleteTour(tour._id)}>
                                                        <i className="fa fa-trash text-danger"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* Context Menu */}
            {contextMenu.visible && (
                <div
                    className="position-fixed bg-white shadow rounded-3 border py-2 context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x, zIndex: 1000, minWidth: '180px' }}
                >
                    <div className="px-3 py-1 x-small fw-bold text-muted text-uppercase mb-1 border-bottom">Actions: {contextMenu.tour?.title}</div>
                    <button className="dropdown-item py-2 x-small" onClick={() => toggleStatus(contextMenu.tour, 'isPopular')}>
                        <i className={`fa ${contextMenu.tour.isPopular ? 'fa-star text-warning' : 'fa-star-o'} me-2`}></i>
                        {contextMenu.tour.isPopular ? 'Remove Popular' : 'Mark as Popular'}
                    </button>
                    <button className="dropdown-item py-2 x-small" onClick={() => toggleStatus(contextMenu.tour, 'isGreatPackage')}>
                        <i className={`fa ${contextMenu.tour.isGreatPackage ? 'fa-check-circle text-success' : 'fa-circle-o'} me-2`}></i>
                        {contextMenu.tour.isGreatPackage ? 'Remove Ajoyib' : 'Mark as Ajoyib'}
                    </button>
                    <button className="dropdown-item py-2 x-small" onClick={() => {
                        setDiscountForm({ type: contextMenu.tour.discountType || 'none', value: contextMenu.tour.discountValue || 0 });
                        setShowDiscountModal(true);
                    }}>
                        <i className="fa fa-tag text-danger me-2"></i>Manage Discount
                    </button>
                    <div className="dropdown-divider"></div>
                    <Link to={`/admin/tours/edit/${contextMenu.tour._id}`} className="dropdown-item py-2 x-small">
                        <i className="fa fa-edit text-primary me-2"></i>Edit Tour
                    </Link>
                </div>
            )}

            {/* Discount Modal */}
            {showDiscountModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header border-0 pb-0">
                                <h6 className="fw-bold m-0">Discount Settings</h6>
                                <button type="button" className="btn-close small shadow-none" onClick={() => setShowDiscountModal(false)}></button>
                            </div>
                            <form onSubmit={handleDiscountSubmit}>
                                <div className="modal-body py-3">
                                    <div className="mb-3">
                                        <label className="form-label x-small fw-bold text-muted">Discount Type</label>
                                        <select
                                            className="form-select form-select-sm"
                                            value={discountForm.type}
                                            onChange={(e) => setDiscountForm({ ...discountForm, type: e.target.value })}
                                        >
                                            <option value="none">No Discount</option>
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount ($)</option>
                                        </select>
                                    </div>
                                    {discountForm.type !== 'none' && (
                                        <div className="mb-3">
                                            <label className="form-label x-small fw-bold text-muted">
                                                {discountForm.type === 'percentage' ? 'Percentage Off (%)' : 'Amount Off ($)'}
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={discountForm.value}
                                                onChange={(e) => setDiscountForm({ ...discountForm, value: e.target.value })}
                                                min="0"
                                                max={discountForm.type === 'percentage' ? "100" : undefined}
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-sm btn-light rounded-pill px-3" onClick={() => setShowDiscountModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-sm btn-primary rounded-pill px-3">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .x-small { font-size: 11px; }
                .bg-primary-subtle { background-color: #e0f2f1 !important; }
                .context-menu-row:hover { cursor: context-menu; }
                .context-menu { border-color: #eee !important; animation: fadeIn 0.1s ease-out; }
                .dropdown-item:hover { background-color: #f8f9fa; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default ManageTours;
