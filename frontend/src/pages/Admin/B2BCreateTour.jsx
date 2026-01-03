import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { toursAPI } from '../../services/api';
import 'react-datepicker/dist/react-datepicker.css';

const B2BCreateTour = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        departureTown: null,
        tour: null,
        state: null,
        departureDate: new Date(),
        nightsFrom: 7,
        nightsTill: 14,
        adults: 2,
        children: 0,
        priceAdult: 0,
        priceChild: 0,
        agencyCommission: 0,
        town: null,
        category: null,
        hotels: [],
        mealType: null,
        isPromotion: false,
        description: '',
        images: []
    });

    const departureCities = [
        { value: 'TAS', label: 'Tashkent' },
        { value: 'SAM', label: 'Samarkand' },
        { value: 'DXB', label: 'Dubai' }
    ];

    const categoryOptions = [
        { value: '5', label: '5* Stars' },
        { value: '4', label: '4* Stars' },
        { value: '3', label: '3* Stars' }
    ];

    const mealTypeOptions = [
        { value: 'AI', label: 'All Inclusive (AI)' },
        { value: 'UAI', label: 'Ultra All Inclusive (UAI)' },
        { value: 'FB', label: 'Full Board (FB)' },
        { value: 'HB', label: 'Half Board (HB)' }
    ];

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev - 1);

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
                headers: { 'Authorization': `Bearer ${token}` },
                body: uploadData
            });
            const data = await response.json();
            if (response.ok) {
                setFormData(prev => ({ ...prev, images: [...prev.images, ...data.urls] }));
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

    const handlePublish = async () => {
        setLoading(true);
        setError('');
        try {
            const tourData = {
                ...formData,
                departureTown: formData.departureTown?.label,
                toCity: formData.tour?.label,
                state: formData.state?.label,
                category: formData.category?.value,
                mealType: formData.mealType?.value,
                hotels: formData.hotels.map(h => h.label),
                priceAdult: Number(formData.priceAdult),
                priceChild: Number(formData.priceChild),
                agencyCommission: Number(formData.agencyCommission),
                tourType: 'B2B',
                status: 'Active'
            };
            await toursAPI.create(tourData);
            setSuccess(true);
            setTimeout(() => navigate('/admin/tours'), 2000);
        } catch (err) {
            setError(err.message || 'Failed to create B2B tour');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold m-0">Create B2B Tour</h3>
                    <p className="text-muted small">Specialized high-density form for partner packages</p>
                </div>
                <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={() => navigate('/admin/tours')}>
                    <i className="fa fa-arrow-left me-2"></i>Back to Tours
                </button>
            </div>

            {error && (
                <div className="alert alert-danger mb-4 shadow-sm rounded-4">
                    <i className="fa fa-exclamation-circle me-2"></i>{error}
                </div>
            )}
            {success && (
                <div className="alert alert-success mb-4 shadow-sm rounded-4">
                    <i className="fa fa-check-circle me-2"></i>B2B Tour created successfully! Redirecting...
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
                                    <span className="position-absolute start-50 translate-middle-x mt-2 x-small fw-bold text-nowrap text-uppercase">
                                        {num === 1 ? 'Basic' : num === 2 ? 'Logistics' : num === 3 ? 'Services' : num === 4 ? 'Pricing' : 'Media'}
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
                                            <label className="form-label small fw-bold text-muted text-uppercase">Tour Title</label>
                                            <input type="text" className="form-control bg-light border-0 py-2" placeholder="e.g. Istanbul Magic - B2B Special" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Departure Town</label>
                                            <Select options={departureCities} styles={customStyles} value={formData.departureTown} onChange={val => setFormData({ ...formData, departureTown: val })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Destination (Tour)</label>
                                            <Select options={[{ value: 'EGY', label: 'Egypt' }, { value: 'TUR', label: 'Turkey' }]} styles={customStyles} value={formData.tour} onChange={val => setFormData({ ...formData, tour: val })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted text-uppercase">State / Region</label>
                                            <Select options={[{ value: 'SHM', label: 'Sharm El Sheikh' }, { value: 'HRG', label: 'Hurghada' }]} styles={customStyles} value={formData.state} onChange={val => setFormData({ ...formData, state: val })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Departure Date</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-0"><i className="fa fa-calendar-alt text-muted small"></i></span>
                                                <DatePicker
                                                    selected={formData.departureDate}
                                                    onChange={date => setFormData({ ...formData, departureDate: date })}
                                                    className="form-control bg-light border-0"
                                                    dateFormat="dd.MM.yyyy"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Description</label>
                                            <textarea className="form-control bg-light border-0 py-2" rows="4" placeholder="Brief tour description for partners..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="animate-fadeIn">
                                    <h5 className="fw-bold mb-4">Step 2: Logistics & Availability</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Nights (From)</label>
                                            <input type="number" className="form-control bg-light border-0 py-2" value={formData.nightsFrom} onChange={e => setFormData({ ...formData, nightsFrom: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Nights (Till)</label>
                                            <input type="number" className="form-control bg-light border-0 py-2" value={formData.nightsTill} onChange={e => setFormData({ ...formData, nightsTill: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Adults Base</label>
                                            <input type="number" className="form-control bg-light border-0 py-2" value={formData.adults} onChange={e => setFormData({ ...formData, adults: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Children Base</label>
                                            <input type="number" className="form-control bg-light border-0 py-2" value={formData.children} onChange={e => setFormData({ ...formData, children: e.target.value })} />
                                        </div>
                                        <div className="col-12">
                                            <div className="form-check form-switch p-3 bg-light rounded-3 border">
                                                <input className="form-check-input ms-0 me-2" type="checkbox" id="promoSwitch" checked={formData.isPromotion} onChange={e => setFormData({ ...formData, isPromotion: e.target.checked })} />
                                                <label className="form-check-label fw-bold text-muted small text-uppercase" htmlFor="promoSwitch">Mark as Special Promotion</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="animate-fadeIn">
                                    <h5 className="fw-bold mb-4">Step 3: Hotel & Services</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Hotel Category</label>
                                            <Select options={categoryOptions} styles={customStyles} value={formData.category} onChange={val => setFormData({ ...formData, category: val })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Meal Type</label>
                                            <Select options={mealTypeOptions} styles={customStyles} value={formData.mealType} onChange={val => setFormData({ ...formData, mealType: val })} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Specific Hotels</label>
                                            <Select
                                                isMulti
                                                options={[
                                                    { value: 'H1', label: 'Rixos Premium Saadiyat' },
                                                    { value: 'H2', label: 'Hilton Fujairah Resort' }
                                                ]}
                                                styles={customStyles}
                                                value={formData.hotels}
                                                onChange={val => setFormData({ ...formData, hotels: val })}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Additional Town Mapping</label>
                                            <Select options={departureCities} styles={customStyles} value={formData.town} onChange={val => setFormData({ ...formData, town: val })} isClearable />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="animate-fadeIn">
                                    <h5 className="fw-bold mb-4">Step 4: B2B Pricing Strategy</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Adult Net Price ($)</label>
                                            <input type="number" className="form-control bg-light border-0 py-2 fs-5 fw-bold text-primary" value={formData.priceAdult} onChange={e => setFormData({ ...formData, priceAdult: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Child Net Price ($)</label>
                                            <input type="number" className="form-control bg-light border-0 py-2 fs-5 fw-bold text-primary" value={formData.priceChild} onChange={e => setFormData({ ...formData, priceChild: e.target.value })} />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Agency Commission ($)</label>
                                            <input type="number" className="form-control bg-primary bg-opacity-10 border-primary-subtle py-2 fs-5 fw-bold text-success" value={formData.agencyCommission} onChange={e => setFormData({ ...formData, agencyCommission: e.target.value })} />
                                            <p className="x-small text-muted mt-1">This amount is automatically calculated for agents.</p>
                                        </div>
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
                                        <h6 className="fw-bold">Upload Gallery Photos</h6>
                                        <p className="small text-muted">Recommend 1200x800px for best display</p>
                                    </div>

                                    {formData.images.length > 0 && (
                                        <div className="row g-3">
                                            {formData.images.map((url, index) => (
                                                <div key={index} className="col-md-4 col-sm-6">
                                                    <div className="position-relative rounded-3 overflow-hidden border shadow-sm group">
                                                        <img src={`http://localhost:5000${url}`} alt="Tour" className="img-fluid w-100" style={{ height: '150px', objectFit: 'cover' }} />
                                                        <div className="position-absolute top-0 end-0 p-2">
                                                            <button className="btn btn-danger btn-sm rounded-circle" onClick={(e) => { e.stopPropagation(); removeImage(index); }}>
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
                                <button className="btn btn-success rounded-pill px-5 shadow" onClick={handlePublish} disabled={loading}>
                                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Publishing...</> : 'Publish B2B Tour'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Live Preview Sidebar */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white sticky-top" style={{ top: '100px' }}>
                        <h6 className="fw-bold mb-3 text-muted text-uppercase x-small">Live Preview</h6>
                        <div className="rounded-3 overflow-hidden border mb-3">
                            <div className="bg-light d-flex align-items-center justify-content-center overflow-hidden" style={{ height: '180px' }}>
                                {formData.images.length > 0 ? (
                                    <img src={`http://localhost:5000${formData.images[0]}`} className="img-fluid w-100 h-100 object-fit-cover" alt="Preview" />
                                ) : (
                                    <i className="fa fa-image text-muted fs-1 opacity-25"></i>
                                )}
                            </div>
                            <div className="p-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="badge bg-warning text-dark text-uppercase x-small px-2">B2B Package</span>
                                    {formData.isPromotion && <span className="badge bg-danger text-white text-uppercase x-small px-2">Promo</span>}
                                </div>
                                <h6 className="fw-bold mb-1">{formData.title || 'Untitled B2B Tour'}</h6>
                                <p className="x-small text-muted mb-2">
                                    <i className="fa fa-route me-1"></i> {formData.departureTown?.label || 'Origin'} → {formData.tour?.label || '...'}
                                </p>
                                <div className="d-flex justify-content-between align-items-center border-top pt-2">
                                    <div>
                                        <span className="text-muted x-small d-block">Net Price</span>
                                        <span className="fw-bold text-primary fs-5">${formData.priceAdult}</span>
                                    </div>
                                    <div className="text-end">
                                        <span className="text-muted x-small d-block">Comm.</span>
                                        <span className="fw-bold text-success">${formData.agencyCommission}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-light p-3 rounded-3 x-small border">
                            <p className="fw-bold mb-2 text-uppercase text-muted">Config Summary:</p>
                            <ul className="mb-0 ps-3">
                                <li>Nights: {formData.nightsFrom}-{formData.nightsTill}</li>
                                <li>Category: {formData.category?.label || 'N/A'}</li>
                                <li>Meal: {formData.mealType?.label || 'N/A'}</li>
                                <li>Hotels: {formData.hotels.length} selected</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .transition { transition: all 0.3s ease; }
                .cursor-pointer { cursor: pointer; }
                .hover-bg-light:hover { background-color: #f0f7f5 !important; }
                .border-dashed { border: 2px dashed #dee2e6 !important; }
                .x-small { font-size: 11px; letter-spacing: 0.5px; }
                .text-primary { color: #30c39e !important; }
                .btn-primary { background-color: #30c39e; border-color: #30c39e; }
                .btn-primary:active, .btn-primary:hover { background-color: #28a686 !important; border-color: #28a686 !important; }
                .bg-primary { background-color: #30c39e !important; }
                .text-success { color: #198754 !important; }
                .bg-primary-subtle { background-color: rgba(48, 195, 158, 0.1) !important; }
            `}</style>
        </div>
    );
};

const customStyles = {
    control: (base, state) => ({
        ...base,
        backgroundColor: '#f8f9fa',
        borderColor: state.isFocused ? '#30c39e' : 'transparent',
        borderRadius: '8px',
        padding: '2px',
        boxShadow: state.isFocused ? '0 0 0 3px rgba(48, 195, 158, 0.1)' : 'none',
        '&:hover': { borderColor: '#30c39e' }
    }),
    placeholder: (base) => ({ ...base, fontSize: '13px', color: '#adb5bd' }),
    singleValue: (base) => ({ ...base, fontSize: '14px', fontWeight: '500' }),
    multiValue: (base) => ({ ...base, backgroundColor: 'rgba(48, 195, 158, 0.1)', borderRadius: '4px' }),
    multiValueLabel: (base) => ({ ...base, color: '#30c39e', fontWeight: 'bold' }),
    multiValueRemove: (base) => ({ ...base, color: '#30c39e', '&:hover': { backgroundColor: '#30c39e', color: '#fff' } })
};

export default B2BCreateTour;
