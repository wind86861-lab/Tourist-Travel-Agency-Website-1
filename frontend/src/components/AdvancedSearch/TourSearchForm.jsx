import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';

const TourSearchForm = ({ onSearch }) => {
    const [formData, setFormData] = useState({
        departureTown: null,
        tour: null,
        state: null,
        departureDate: new Date(),
        nightsFrom: 7,
        nightsTill: 14,
        adults: 2,
        children: 0,
        priceFrom: '',
        priceTill: '',
        town: null,
        category: null,
        hotels: [],
        mealType: null,
        promotions: false
    });

    const [showAdvanced, setShowAdvanced] = useState(false);

    const departureCities = [
        { value: 'TAS', label: 'Tashkent' },
        { value: 'SAM', label: 'Samarkand' },
        { value: 'DXB', label: 'Dubai' }
    ];

    const tourOptions = [
        { value: 'EGY', label: 'Egypt - Sharm El Sheikh' },
        { value: 'TUR', label: 'Turkey - Antalya' },
        { value: 'THA', label: 'Thailand - Phuket' }
    ];

    const stateOptions = [
        { value: 'SIN', label: 'Sinai Peninsula' },
        { value: 'ANT', label: 'Antalya Coast' }
    ];

    const categoryOptions = [
        { value: '5', label: '5* Stars Only' },
        { value: '4', label: '4* + above' },
        { value: '3', label: '3* + above' }
    ];

    const mealTypeOptions = [
        { value: 'AI', label: 'All Inclusive (AI)' },
        { value: 'UAI', label: 'Ultra All Inclusive (UAI)' },
        { value: 'FB', label: 'Full Board (FB)' },
        { value: 'HB', label: 'Half Board (HB)' }
    ];

    const hotelOptions = [
        { value: 'RIX', label: 'Rixos Premium Saadiyat' },
        { value: 'HIL', label: 'Hilton Fujairah Resort' },
        { value: 'MAR', label: 'Marriott Resort Palm Jumeirah' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(formData);
    };

    return (
        <div className="search-form-card bg-white shadow-sm border rounded-bottom-4 p-4">
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    {/* First Row: Main Locations */}
                    <div className="col-lg-3 col-md-6">
                        <label className="x-small text-muted fw-bold text-uppercase mb-1">Departure Town</label>
                        <Select
                            options={departureCities}
                            value={formData.departureTown}
                            onChange={(val) => setFormData({ ...formData, departureTown: val })}
                            placeholder="Select city..."
                            styles={customStyles}
                        />
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <label className="x-small text-muted fw-bold text-uppercase mb-1">Tour Destination</label>
                        <Select
                            options={tourOptions}
                            value={formData.tour}
                            onChange={(val) => setFormData({ ...formData, tour: val })}
                            placeholder="Select tour..."
                            styles={customStyles}
                        />
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <label className="x-small text-muted fw-bold text-uppercase mb-1">State / Region</label>
                        <Select
                            options={stateOptions}
                            value={formData.state}
                            onChange={(val) => setFormData({ ...formData, state: val })}
                            placeholder="Select state..."
                            styles={customStyles}
                        />
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <label className="x-small text-muted fw-bold text-uppercase mb-1">Departure From</label>
                        <div className="input-group input-group-sm">
                            <span className="input-group-text bg-light border-end-0"><i className="fa fa-calendar-alt text-muted small"></i></span>
                            <DatePicker
                                selected={formData.departureDate}
                                onChange={(date) => setFormData({ ...formData, departureDate: date })}
                                className="form-control form-control-sm border-start-0 ps-0"
                                dateFormat="dd.MM.yyyy"
                            />
                        </div>
                    </div>

                    {/* Second Row: Nights, Guests, Price */}
                    <div className="col-lg-2 col-md-4">
                        <label className="x-small text-muted fw-bold text-uppercase mb-1">Nights (From / Till)</label>
                        <div className="d-flex gap-2">
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                placeholder="Min"
                                value={formData.nightsFrom}
                                onChange={(e) => setFormData({ ...formData, nightsFrom: e.target.value })}
                            />
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                placeholder="Max"
                                value={formData.nightsTill}
                                onChange={(e) => setFormData({ ...formData, nightsTill: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-4">
                        <label className="x-small text-muted fw-bold text-uppercase mb-1">Guests (Adult / Child)</label>
                        <div className="d-flex gap-2">
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                value={formData.adults}
                                onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                                min="1"
                            />
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                value={formData.children}
                                onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                                min="0"
                            />
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-4">
                        <label className="x-small text-muted fw-bold text-uppercase mb-1">Price (From / Till)</label>
                        <div className="d-flex gap-2">
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                placeholder="0"
                                value={formData.priceFrom}
                                onChange={(e) => setFormData({ ...formData, priceFrom: e.target.value })}
                            />
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                placeholder="9999"
                                value={formData.priceTill}
                                onChange={(e) => setFormData({ ...formData, priceTill: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-6">
                        <label className="x-small text-muted fw-bold text-uppercase mb-1">Town</label>
                        <Select
                            options={departureCities}
                            value={formData.town}
                            onChange={(val) => setFormData({ ...formData, town: val })}
                            placeholder="Any Town"
                            styles={customStyles}
                            isClearable
                        />
                    </div>
                    <div className="col-lg-2 col-md-6">
                        <label className="x-small text-muted fw-bold text-uppercase mb-1">Category</label>
                        <Select
                            options={categoryOptions}
                            value={formData.category}
                            onChange={(val) => setFormData({ ...formData, category: val })}
                            placeholder="Star Rating"
                            styles={customStyles}
                            isClearable
                        />
                    </div>
                    <div className="col-lg-2 col-md-12 d-flex align-items-end">
                        <button type="submit" className="btn btn-primary w-100 fw-bold shadow-sm py-2">
                            <i className="fa fa-search me-2"></i>SEARCH
                        </button>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-top d-flex flex-wrap align-items-center gap-4">
                    <div className="d-flex align-items-center" style={{ minWidth: '250px' }}>
                        <span className="x-small text-muted fw-bold text-uppercase me-2">Hotels (Selected):</span>
                        <div className="flex-grow-1">
                            <Select
                                isMulti
                                options={hotelOptions}
                                value={formData.hotels}
                                onChange={(val) => setFormData({ ...formData, hotels: val })}
                                placeholder="Pick Hotels..."
                                styles={customStyles}
                            />
                        </div>
                    </div>
                    <div className="d-flex align-items-center" style={{ minWidth: '200px' }}>
                        <span className="x-small text-muted fw-bold text-uppercase me-2">Meal Type:</span>
                        <div className="flex-grow-1">
                            <Select
                                options={mealTypeOptions}
                                value={formData.mealType}
                                onChange={(val) => setFormData({ ...formData, mealType: val })}
                                placeholder="Any Meal"
                                styles={customStyles}
                                isClearable
                            />
                        </div>
                    </div>
                    <div className="form-check form-switch ms-auto">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="promoSwitch"
                            checked={formData.promotions}
                            onChange={(e) => setFormData({ ...formData, promotions: e.target.checked })}
                        />
                        <label className="form-check-label x-small fw-bold text-uppercase text-muted" htmlFor="promoSwitch">Promotions Only</label>
                    </div>
                    <button type="button" className="btn btn-link btn-sm text-primary text-decoration-none x-small fw-bold p-0">
                        <i className="fa fa-filter me-1"></i>MORE FILTERS
                    </button>
                </div>
            </form>

            <style>{`
                .search-form-card {
                    background: #fff;
                    margin-top: -1px;
                }
                .x-small { font-size: 11px; }
                .form-control-sm {
                    border-radius: 8px;
                    border-color: #e9ecef;
                    padding-top: 5px;
                    padding-bottom: 5px;
                }
                .form-control-sm:focus {
                    border-color: #30c39e;
                    box-shadow: 0 0 0 3px rgba(48, 195, 158, 0.1);
                }
                .input-group-text {
                    border-radius: 8px 0 0 8px;
                    border-color: #e9ecef;
                }
                .rounded-bottom-4 {
                    border-bottom-left-radius: 16px !important;
                    border-bottom-right-radius: 16px !important;
                }
            `}</style>
        </div>
    );
};

const customStyles = {
    control: (base, state) => ({
        ...base,
        minHeight: '34px',
        maxHeight: '100px',
        borderRadius: '8px',
        borderColor: state.isFocused ? '#30c39e' : '#e9ecef',
        boxShadow: state.isFocused ? '0 0 0 3px rgba(48, 195, 158, 0.1)' : 'none',
        '&:hover': {
            borderColor: '#30c39e'
        },
        fontSize: '14px',
        overflow: 'auto'
    }),
    placeholder: (base) => ({
        ...base,
        color: '#adb5bd',
        fontSize: '13px'
    }),
    dropdownIndicator: (base) => ({
        ...base,
        padding: '4px'
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '2px 8px'
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: 'rgba(48, 195, 158, 0.1)',
        borderRadius: '4px',
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: '#30c39e',
        fontWeight: 'bold',
        fontSize: '11px'
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: '#30c39e',
        '&:hover': {
            backgroundColor: '#30c39e',
            color: '#fff'
        }
    })
};

export default TourSearchForm;
