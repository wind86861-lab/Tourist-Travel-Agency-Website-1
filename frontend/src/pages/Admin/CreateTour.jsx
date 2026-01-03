import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toursAPI } from '../../services/api';

const CreateTour = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [tourType, setTourType] = useState('B2C'); // B2C or B2B
    const [packageType, setPackageType] = useState('Full'); // Full or Partial
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const includedRef = useRef(null);
    const notIncludedRef = useRef(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        fromCity: 'Tashkent',
        toCity: '',
        duration: '7 days',
        startDate: new Date().toISOString().split('T')[0],
        isVisaRequired: false,
        visaInfo: '',
        description: '',
        flightVendors: [],
        included: [],
        notIncluded: [],
        itinerary: [{ day: 1, title: '', description: '' }],
        hotels: [],
        capacity: 20,
        priceAdult: 0,
        priceChild: 0,
        agencyCommission: 0,
        images: []
    });

    const flightVendorsList = ['Uzbekistan Airways', 'Turkish Airlines', 'Fly Dubai', 'Air Arabia', 'Qatar Airways'];

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev - 1);

    const toggleVendor = (vendor) => {
        setFormData(prev => ({
            ...prev,
            flightVendors: prev.flightVendors.includes(vendor)
                ? prev.flightVendors.filter(v => v !== vendor)
                : [...prev.flightVendors, vendor]
        }));
    };

    const addListItem = (field, value) => {
        if (!value.trim()) return;
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], value.trim()]
        }));
    };

    const removeListItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handlePublish = async () => {
        setLoading(true);
        setError('');
        try {
            const tourData = {
                ...formData,
                tourType,
                packageType,
                priceAdult: Number(formData.priceAdult),
                priceChild: Number(formData.priceChild),
                capacity: Number(formData.capacity),
                agencyCommission: Number(formData.agencyCommission),
                status: 'Active'
            };
            await toursAPI.create(tourData);
            setSuccess(true);
            setTimeout(() => navigate('/admin/tours'), 2000);
        } catch (err) {
            setError(err.message || 'Failed to create tour');
        } finally {
            setLoading(false);
        }
    };

    const addItineraryDay = () => {
        setFormData(prev => ({
            ...prev,
            itinerary: [
                ...prev.itinerary,
                { day: prev.itinerary.length + 1, title: '', description: '' }
            ]
        }));
    };

    const removeItineraryDay = (index) => {
        const newItinerary = formData.itinerary.filter((_, i) => i !== index)
            .map((item, i) => ({ ...item, day: i + 1 })); // Re-index days
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const handleItineraryChange = (index, field, value) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[index] = { ...newItinerary[index], [field]: value };
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const uploadData = new FormData();
        files.forEach(file => uploadData.append('images', file));

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/upload/multiple', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: uploadData
            });
            const data = await response.json();
            if (response.ok) {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, ...data.urls]
                }));
            } else {
                setError(data.message || 'Upload failed');
            }
        } catch (err) {
            setError('Failed to upload images');
        } finally {
            setLoading(false);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold m-0">Create New Tour</h3>
                    <p className="text-muted small">Design and publish a new travel package</p>
                </div>
                <div className="d-flex gap-2">
                    <div className="btn-group shadow-sm">
                        <button className={`btn btn-sm ${tourType === 'B2C' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setTourType('B2C')}>Public (B2C)</button>
                        <button className={`btn btn-sm ${tourType === 'B2B' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setTourType('B2B')}>Agency (B2B)</button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger mb-4">
                    <i className="fa fa-exclamation-circle me-2"></i>{error}
                </div>
            )}
            {success && (
                <div className="alert alert-success mb-4">
                    <i className="fa fa-check-circle me-2"></i>Tour created successfully! Redirecting...
                </div>
            )}

            <div className="row">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                        {/* Stepper Header */}
                        <div className="d-flex justify-content-between mb-5 px-5 position-relative">
                            <div className="position-absolute top-50 start-0 end-0 border-top translate-middle-y" style={{ zIndex: 0 }}></div>
                            {[1, 2, 3, 4, 5].map(num => (
                                <div key={num} className="position-relative" style={{ zIndex: 1 }}>
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold transition ${step >= num ? 'bg-primary text-white shadow' : 'bg-light text-muted border'}`}
                                        style={{ width: '40px', height: '40px' }}>
                                        {num}
                                    </div>
                                    <span className="position-absolute start-50 translate-middle-x mt-2 x-small fw-bold text-nowrap">
                                        {num === 1 ? 'Basic' : num === 2 ? 'Logistics' : num === 3 ? 'Itinerary' : num === 4 ? 'Pricing' : 'Media'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Step Content */}
                        <div className="mt-4">
                            {step === 1 && (
                                <div className="animate-fadeIn">
                                    <h5 className="fw-bold mb-4">Step 1: Basic & Routing</h5>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label small fw-bold text-muted">TOUR TITLE</label>
                                            <input type="text" className="form-control bg-light border-0 py-2" placeholder="e.g. Istanbul Magic & Shopping" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted">FROM (ORIGIN)</label>
                                            <input type="text" className="form-control bg-light border-0 py-2" value={formData.fromCity} onChange={e => setFormData({ ...formData, fromCity: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted">TO (DESTINATION)</label>
                                            <input type="text" className="form-control bg-light border-0 py-2" placeholder="e.g. Antalya" value={formData.toCity} onChange={e => setFormData({ ...formData, toCity: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted">DURATION</label>
                                            <input type="text" className="form-control bg-light border-0 py-2" placeholder="e.g. 7 days / 6 nights" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted">START DATE</label>
                                            <input type="date" className="form-control bg-light border-0 py-2" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-check form-switch p-3 bg-light rounded-3 border">
                                                <input className="form-check-input ms-0 me-2" type="checkbox" id="visaSwitch" checked={formData.isVisaRequired} onChange={e => setFormData({ ...formData, isVisaRequired: e.target.checked })} />
                                                <label className="form-check-label fw-bold text-muted small" htmlFor="visaSwitch">VISA IS REQUIRED FOR THIS TOUR</label>
                                            </div>
                                        </div>
                                        {formData.isVisaRequired && (
                                            <div className="col-md-12 animate-fadeIn">
                                                <label className="form-label small fw-bold text-muted">VISA ADDITIONAL INFO</label>
                                                <input type="text" className="form-control bg-light border-0 py-2" placeholder="e.g. Visa fee $50, process takes 5 days" value={formData.visaInfo} onChange={e => setFormData({ ...formData, visaInfo: e.target.value })} />
                                            </div>
                                        )}
                                        <div className="col-12">
                                            <label className="form-label small fw-bold text-muted">DESCRIPTION</label>
                                            <textarea className="form-control bg-light border-0 py-2" rows="4" placeholder="Describe the tour highlights..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="animate-fadeIn">
                                    <h5 className="fw-bold mb-4">Step 2: Logistics & Details</h5>
                                    <div className="row g-3">
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label small fw-bold text-muted d-block">PACKAGE TYPE</label>
                                            <div className="d-flex gap-3">
                                                <div className={`p-3 border rounded-3 flex-grow-1 cursor-pointer transition ${packageType === 'Full' ? 'border-primary bg-primary-subtle' : 'bg-light'}`} onClick={() => setPackageType('Full')}>
                                                    <h6 className="fw-bold mb-1">Full Package</h6>
                                                    <p className="x-small text-muted mb-0">Fixed flight + hotel bundle</p>
                                                </div>
                                                <div className={`p-3 border rounded-3 flex-grow-1 cursor-pointer transition ${packageType === 'Partial' ? 'border-primary bg-primary-subtle' : 'bg-light'}`} onClick={() => setPackageType('Partial')}>
                                                    <h6 className="fw-bold mb-1">Custom/Partial</h6>
                                                    <p className="x-small text-muted mb-0">Select multiple options</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Show Flight Vendors ONLY for B2B */}
                                        {tourType === 'B2B' && (
                                            <div className="col-12">
                                                <label className="form-label small fw-bold text-muted">AVAILABLE FLIGHT VENDORS</label>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {flightVendorsList.map(vendor => (
                                                        <div key={vendor}
                                                            className={`badge rounded-pill px-3 py-2 cursor-pointer border transition ${formData.flightVendors.includes(vendor) ? 'bg-primary border-primary' : 'bg-light text-dark border-secondary-subtle'}`}
                                                            onClick={() => toggleVendor(vendor)}>
                                                            {vendor}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted">PRICE INCLUDES</label>
                                            <div className="input-group mb-2">
                                                <input
                                                    ref={includedRef}
                                                    type="text"
                                                    className="form-control bg-light border-0"
                                                    placeholder="e.g. Breakfast, Transfer"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addListItem('included', e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                                <button className="btn btn-outline-primary" type="button" onClick={() => {
                                                    const value = includedRef.current?.value;
                                                    addListItem('included', value);
                                                    if (includedRef.current) includedRef.current.value = '';
                                                }}><i className="fa fa-plus"></i></button>
                                            </div>
                                            <div className="d-flex flex-wrap gap-2">
                                                {formData.included.map((item, i) => (
                                                    <span key={i} className="badge bg-success-subtle text-success border border-success-subtle d-flex align-items-center gap-2">
                                                        {item}
                                                        <i className="fa fa-times cursor-pointer" onClick={() => removeListItem('included', i)}></i>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted">PRICE EXCLUDES (EXTRA)</label>
                                            <div className="input-group mb-2">
                                                <input
                                                    ref={notIncludedRef}
                                                    type="text"
                                                    className="form-control bg-light border-0"
                                                    placeholder="e.g. Visa, Personal expenses"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addListItem('notIncluded', e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                                <button className="btn btn-outline-danger" type="button" onClick={() => {
                                                    const value = notIncludedRef.current?.value;
                                                    addListItem('notIncluded', value);
                                                    if (notIncludedRef.current) notIncludedRef.current.value = '';
                                                }}><i className="fa fa-plus"></i></button>
                                            </div>
                                            <div className="d-flex flex-wrap gap-2">
                                                {formData.notIncluded.map((item, i) => (
                                                    <span key={i} className="badge bg-danger-subtle text-danger border border-danger-subtle d-flex align-items-center gap-2">
                                                        {item}
                                                        <i className="fa fa-times cursor-pointer" onClick={() => removeListItem('notIncluded', i)}></i>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <label className="form-label small fw-bold text-muted">TOTAL PLACES (CAPACITY)</label>
                                            <input type="number" className="form-control bg-light border-0 py-2" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="animate-fadeIn">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h5 className="fw-bold m-0">Step 3: Tour Itinerary</h5>
                                        <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={addItineraryDay}>
                                            <i className="fa fa-plus me-2"></i>Add Day
                                        </button>
                                    </div>

                                    <div className="accordion" id="itineraryAccordion">
                                        {formData.itinerary.map((day, index) => (
                                            <div className="card border mb-3 shadow-sm overflow-hidden" key={index}>
                                                <div className="card-header bg-white border-bottom-0 p-3 d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center flex-grow-1">
                                                        <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '32px', height: '32px' }}>
                                                            {day.day}
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm border-0 fw-bold bg-transparent shadow-none"
                                                            placeholder={`Day ${day.day} Title (e.g. Arrival)`}
                                                            value={day.title}
                                                            onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                                                        />
                                                    </div>
                                                    {formData.itinerary.length > 1 && (
                                                        <button className="btn btn-link text-danger p-0 ms-2" onClick={() => removeItineraryDay(index)}>
                                                            <i className="fa fa-trash"></i>
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="card-body p-0 border-top">
                                                    <textarea
                                                        className="form-control border-0 p-3 bg-light"
                                                        rows="3"
                                                        placeholder="Detailed description of activities..."
                                                        value={day.description}
                                                        onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="animate-fadeIn">
                                    <h5 className="fw-bold mb-4">Step 4: Pricing Strategy</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted">ADULT PRICE ($)</label>
                                            <input type="number" className="form-control bg-light border-0 py-2" value={formData.priceAdult} onChange={e => setFormData({ ...formData, priceAdult: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted">CHILD PRICE ($)</label>
                                            <input type="number" className="form-control bg-light border-0 py-2" value={formData.priceChild} onChange={e => setFormData({ ...formData, priceChild: e.target.value })} />
                                        </div>
                                        {tourType === 'B2B' && (
                                            <div className="col-md-12">
                                                <label className="form-label small fw-bold text-muted">AGENCY COMMISSION ($)</label>
                                                <input type="number" className="form-control bg-primary-subtle border-primary-subtle py-2 fw-bold" value={formData.agencyCommission} onChange={e => setFormData({ ...formData, agencyCommission: e.target.value })} />
                                                <p className="x-small text-muted mt-1">This amount will be deducted for B2B partners.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {step === 5 && (
                                <div className="animate-fadeIn">
                                    <h5 className="fw-bold mb-4">Step 5: Media Gallery</h5>

                                    <div
                                        className="border-2 border-dashed rounded-4 p-5 text-center bg-light cursor-pointer hover-bg-light transition mb-4"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="d-none"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                        />
                                        <i className="fa fa-cloud-upload-alt fs-1 text-primary mb-3"></i>
                                        <h6 className="fw-bold">Upload Tour Photos</h6>
                                        <p className="small text-muted">Upload high-quality images of the destination</p>
                                    </div>

                                    {formData.images.length > 0 && (
                                        <div className="row g-3">
                                            {formData.images.map((url, index) => (
                                                <div key={index} className="col-md-4 col-sm-6">
                                                    <div className="position-relative rounded-3 overflow-hidden border shadow-sm group">
                                                        <img src={`http://localhost:5000${url}`} alt="Tour" className="img-fluid w-100" style={{ height: '150px', objectFit: 'cover' }} />
                                                        <div className="position-absolute top-0 end-0 p-2">
                                                            <button
                                                                className="btn btn-danger btn-sm rounded-circle"
                                                                onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                                            >
                                                                <i className="fa fa-times"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                            <button className="btn btn-light rounded-pill px-4" disabled={step === 1} onClick={handlePrev}>Back</button>
                            {step < 5 ? (
                                <button className="btn btn-primary rounded-pill px-5 shadow" onClick={handleNext}>Next Step</button>
                            ) : (
                                <button
                                    className="btn btn-success rounded-pill px-5 shadow"
                                    onClick={handlePublish}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Publishing...</>
                                    ) : (
                                        <>Publish Tour</>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Live Preview Sidebar */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white sticky-top" style={{ top: '100px' }}>
                        <h6 className="fw-bold mb-3 text-muted">Live Preview</h6>
                        <div className="rounded-3 overflow-hidden border mb-3">
                            <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                                <i className="fa fa-image text-muted fs-1 opacity-25"></i>
                            </div>
                            <div className="p-3">
                                <span className={`badge mb-2 ${tourType === 'B2B' ? 'bg-warning text-dark' : 'bg-primary text-white'}`}>{tourType} Package</span>
                                <h6 className="fw-bold mb-1">{formData.title || 'Untitled Tour'}</h6>
                                <p className="x-small text-muted mb-2">
                                    <i className="fa fa-route me-1"></i> {formData.fromCity} → {formData.toCity || '...'}
                                </p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold text-primary">${formData.priceAdult}</span>
                                    {packageType === 'Partial' && <span className="x-small badge bg-light text-dark border">Partial Ready</span>}
                                </div>
                            </div>
                        </div>
                        <div className="bg-light p-3 rounded-3 x-small">
                            <p className="fw-bold mb-2">Configuration Summary:</p>
                            <ul className="mb-0 ps-3">
                                <li>Type: {tourType}</li>
                                <li>Logistics: {packageType} Package</li>
                                <li>Vendors: {formData.flightVendors.length} selected</li>
                                <li>Places: {formData.capacity}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .transition {
                    transition: all 0.3s ease;
                }
                .cursor-pointer {
                    cursor: pointer;
                }
                .hover-bg-light:hover {
                    background-color: #f0f7f5 !important;
                }
                .border-dashed {
                    border: 2px dashed #dee2e6 !important;
                }
            `}</style>
        </div>
    );
};

export default CreateTour;
