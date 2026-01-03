import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function BandQilish() {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedPackage = location.state || {
        id: 0,
        title: "Maxsus Paket",
        fromCity: "Toshkent",
        toCity: "Noma'lum",
        duration: "Kelishiladi",
        priceAdult: 0,
        priceChild: 0,
        flightVendors: [],
        image: "/assets/img/booking.jpg",
        included: [],
        notIncluded: []
    };

    const [isConfirmed, setIsConfirmed] = useState(false);
    const [bookingId, setBookingId] = useState('');
    const [activeStep, setActiveStep] = useState(1);
    const stageRefs = useRef([]);

    const [formData, setFormData] = useState({
        travelDate: '',
        adults: 1,
        children: 0,
        rooms: 1,
        addons: {
            transfer: false,
            hotelUpgrade: false,
            guide: false,
            meals: false,
            insurance: false
        },
        travelers: [
            { firstName: '', lastName: '', dob: '', gender: 'Male', nationality: '', passport: '' }
        ],
        contact: {
            phone: '',
            email: '',
            city: '',
            notes: ''
        },
        paymentMethod: 'Card'
    });

    const [totalPrice, setTotalPrice] = useState(selectedPackage.price);

    useEffect(() => {
        let price = selectedPackage.priceAdult * formData.adults;
        price += selectedPackage.priceChild * formData.children;
        if (formData.addons.transfer) price += 50;
        if (formData.addons.hotelUpgrade) price += 100;
        if (formData.addons.guide) price += 80;
        if (formData.addons.meals) price += 60;
        if (formData.addons.insurance) price += 30;
        setTotalPrice(price);

        const totalPeople = formData.adults + formData.children;
        if (formData.travelers.length !== totalPeople) {
            const newTravelers = [...formData.travelers];
            if (newTravelers.length < totalPeople) {
                for (let i = newTravelers.length; i < totalPeople; i++) {
                    newTravelers.push({ firstName: '', lastName: '', dob: '', gender: 'Male', nationality: '', passport: '' });
                }
            } else {
                newTravelers.splice(totalPeople);
            }
            setFormData(prev => ({ ...prev, travelers: newTravelers }));
        }
    }, [formData.adults, formData.children, formData.addons, selectedPackage.price]);

    const handleInputChange = (stepKey, field, value) => {
        if (stepKey === 'direct') {
            setFormData(prev => ({ ...prev, [field]: value }));
        } else {
            setFormData(prev => ({
                ...prev,
                [stepKey]: { ...prev[stepKey], [field]: value }
            }));
        }
    };

    const handleTravelerChange = (index, field, value) => {
        const updatedTravelers = formData.travelers.map((t, i) =>
            i === index ? { ...t, [field]: value } : t
        );
        setFormData(prev => ({ ...prev, travelers: updatedTravelers }));
    };

    const handleAddonChange = (addon) => {
        setFormData(prev => ({
            ...prev,
            addons: { ...prev.addons, [addon]: !prev.addons[addon] }
        }));
    };

    const nextStep = (currentStep) => {
        const next = currentStep + 1;
        setActiveStep(next);
        setTimeout(() => {
            stageRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleFinalSubmit = (e) => {
        e.preventDefault();
        setBookingId(`AT-${Math.floor(Math.random() * 1000000)}`);
        setIsConfirmed(true);
        window.scrollTo(0, 0);
    };

    const StageWrapper = ({ num, title, children, isLast }) => {
        const isActive = activeStep === num;
        const isCompleted = activeStep > num;

        return (
            <div className="d-flex mb-2" ref={el => stageRefs.current[num] = el}>
                <div className="d-flex flex-column align-items-center me-3" style={{ width: '40px' }}>
                    <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold transition ${isCompleted ? 'bg-success text-white border-success' : isActive ? 'bg-primary text-white border-primary shadow' : 'bg-white text-muted border border-light'}`}
                        style={{ width: '36px', height: '36px', zIndex: 2, borderWidth: '2px', borderStyle: 'solid' }}
                        onClick={() => isCompleted && setActiveStep(num)}>
                        {isCompleted ? <i className="fa fa-check small"></i> : num}
                    </div>
                    {!isLast && (
                        <div className={`flex-grow-1 border-start border-2 border-dotted my-1 transition ${isCompleted ? 'border-success' : 'border-primary'}`} style={{ width: '0' }}></div>
                    )}
                </div>
                <div className="flex-grow-1 pb-5" style={{ opacity: isActive || isCompleted ? 1 : 0.5 }}>
                    <div className={`card border-0 shadow-sm p-4 transition-all ${isActive ? 'bg-white scale-up' : 'bg-light curson-pointer'}`}
                        style={{ borderRadius: '12px' }}
                        onClick={() => isCompleted && setActiveStep(num)}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className={`m-0 fw-bold ${isActive ? 'text-primary' : ''}`}>{title}</h5>
                            {isCompleted && <span className="badge bg-success shadow-sm">Bajarildi</span>}
                        </div>

                        {(isActive || isCompleted) && (
                            <div className={`stage-content transition-fadeIn ${isActive ? '' : 'd-none'}`}>
                                {children}
                                {!isLast && isActive && (
                                    <div className="mt-4 pt-3 border-top text-end">
                                        <button type="button" className="btn btn-primary px-5 py-2 rounded-pill fw-bold shadow-sm" onClick={() => nextStep(num)}>
                                            Davom etish <i className="fa fa-arrow-down ms-2"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {isCompleted && !isActive && (
                            <div className="text-muted small">Tahrirlash uchun bosing...</div>
                        )}
                        {!isActive && !isCompleted && (
                            <div className="text-muted small italic">Oldingi qadamlarni yakunlang...</div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (isConfirmed) {
        return (
            <div className="container py-5 text-center">
                <div className="bg-white shadow p-5 rounded">
                    <div className="mb-4">
                        <div className="bg-success text-white d-inline-block rounded-circle p-4 shadow">
                            <i className="fa fa-check fa-4x"></i>
                        </div>
                    </div>
                    <h2 className="mb-3">Tabriklaymiz!</h2>
                    <h5 className="text-muted mb-4">Sizning sayohatingiz muvaffaqiyatli band qilindi.</h5>
                    <div className="bg-light p-3 rounded mb-4 d-inline-block px-5">
                        <span className="text-muted small d-block">BUYURTMA RAQAMI</span>
                        <span className="fw-bold h4">{bookingId}</span>
                    </div>
                    <p className="text-center mb-5">Barcha ma'lumotlar emailingizga yuborildi. Tez orada menejerimiz siz bilan bog'lanadi.</p>
                    <button className="btn btn-primary btn-lg rounded-pill px-5" onClick={() => navigate('/packages')}>Paketlar sahifasiga qaytish</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-5 bg-light" style={{ minHeight: '100vh' }}>
            <div className="container">
                <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary text-white rounded p-2 me-3 shadow-sm">
                        <i className="fa fa-file-invoice"></i>
                    </div>
                    <h2 className="m-0 fw-bold">Buyurtma yaratish</h2>
                </div>

                <div className="row g-4">
                    {/* Left & Middle: Progressive Stages */}
                    <div className="col-lg-8 offset-lg-1">
                        <form onSubmit={handleFinalSubmit}>
                            <StageWrapper num={1} title="Sayohat tafsilotlari">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-muted">SAYOHAT SANASI</label>
                                        <input type="date" className="form-control border-light bg-light py-2" required value={formData.travelDate} onChange={(e) => handleInputChange('direct', 'travelDate', e.target.value)} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-muted">KATTALAR SONI</label>
                                        <input type="number" min="1" className="form-control border-light bg-light py-2" value={formData.adults} onChange={(e) => handleInputChange('direct', 'adults', parseInt(e.target.value))} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-muted">BOLALAR SONI</label>
                                        <input type="number" min="0" className="form-control border-light bg-light py-2" value={formData.children} onChange={(e) => handleInputChange('direct', 'children', parseInt(e.target.value))} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-muted">XONALAR SONI</label>
                                        <input type="number" min="1" className="form-control border-light bg-light py-2" value={formData.rooms} onChange={(e) => handleInputChange('direct', 'rooms', parseInt(e.target.value))} />
                                    </div>
                                </div>
                            </StageWrapper>

                            <StageWrapper num={2} title="Paket ma'lumotlari">
                                <div className="bg-light p-3 rounded d-flex align-items-center border border-light">
                                    <img src={selectedPackage.image} alt={selectedPackage.title} className="rounded me-3" style={{ width: '120px', height: '80px', objectFit: 'cover' }} />
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1 fw-bold">{selectedPackage.title}</h6>
                                        <p className="text-muted small mb-0">
                                            <i className="fa fa-route text-primary me-2"></i>
                                            {selectedPackage.fromCity} <i className="fa fa-long-arrow-alt-right mx-1"></i> {selectedPackage.toCity}
                                        </p>
                                        {selectedPackage.flightVendors && selectedPackage.flightVendors.length > 0 && (
                                            <p className="x-small text-muted mt-1 mb-0">
                                                <i className="fa fa-plane me-1"></i> Aviakompaniyalar: {selectedPackage.flightVendors.join(', ')}
                                            </p>
                                        )}
                                        <p className="small mb-0 mt-1 fw-bold text-primary">${selectedPackage.priceAdult} / asosi</p>
                                    </div>
                                </div>
                            </StageWrapper>

                            <StageWrapper num={3} title="Qo'shimcha xizmatlar">
                                <div className="row g-2">
                                    {[
                                        { id: 'transfer', label: 'Aeroport transferi ($50)', key: 'transfer' },
                                        { id: 'upgrade', label: 'Mehmonxona yangilanishi ($100)', key: 'hotelUpgrade' },
                                        { id: 'guide', label: 'Gid xizmati ($80)', key: 'guide' },
                                        { id: 'meals', label: 'Ovqatlanish ($60)', key: 'meals' },
                                        { id: 'insurance', label: "Sug'urta ($30)", key: 'insurance' }
                                    ].map((addon) => (
                                        <div className="col-md-6" key={addon.id}>
                                            <div className="form-check p-2 border rounded border-light bg-light h-100 d-flex align-items-center">
                                                <input className="form-check-input ms-0 shadow-none" type="checkbox" id={addon.id} checked={formData.addons[addon.key]} onChange={() => handleAddonChange(addon.key)} />
                                                <label className="form-check-label ms-3 small fw-bold" htmlFor={addon.id}>{addon.label}</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </StageWrapper>

                            <StageWrapper num={4} title="Sayohatchilar ma'lumotlari">
                                {formData.travelers.map((traveler, index) => (
                                    <div key={index} className="mb-3 p-3 border-light border rounded bg-light">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '24px', height: '24px', fontSize: '12px' }}>{index + 1}</div>
                                            <h6 className="m-0 fw-bold small text-uppercase">Sayohatchi</h6>
                                        </div>
                                        <div className="row g-2">
                                            <div className="col-md-6">
                                                <input type="text" className="form-control border-0 shadow-sm small" placeholder="Ism" required value={traveler.firstName} onChange={(e) => handleTravelerChange(index, 'firstName', e.target.value)} />
                                            </div>
                                            <div className="col-md-6">
                                                <input type="text" className="form-control border-0 shadow-sm small" placeholder="Familiya" required value={traveler.lastName} onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)} />
                                            </div>
                                            <div className="col-md-6">
                                                <input type="date" className="form-control border-0 shadow-sm small" required value={traveler.dob} onChange={(e) => handleTravelerChange(index, 'dob', e.target.value)} />
                                            </div>
                                            <div className="col-md-6">
                                                <select className="form-select border-0 shadow-sm small" value={traveler.gender} onChange={(e) => handleTravelerChange(index, 'gender', e.target.value)}>
                                                    <option value="Male">Erkak</option>
                                                    <option value="Female">Ayol</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </StageWrapper>

                            <StageWrapper num={5} title="Bog'lanish ma'lumotlari">
                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <input type="tel" className="form-control border-light bg-light py-2 small" placeholder="Telefon" required value={formData.contact.phone} onChange={(e) => handleInputChange('contact', 'phone', e.target.value)} />
                                    </div>
                                    <div className="col-md-6">
                                        <input type="email" className="form-control border-light bg-light py-2 small" placeholder="Email" required value={formData.contact.email} onChange={(e) => handleInputChange('contact', 'email', e.target.value)} />
                                    </div>
                                    <div className="col-12">
                                        <textarea className="form-control border-light bg-light py-2 small" rows="2" placeholder="Maxsus so'rovlar" value={formData.contact.notes} onChange={(e) => handleInputChange('contact', 'notes', e.target.value)}></textarea>
                                    </div>
                                </div>
                            </StageWrapper>

                            <StageWrapper num={6} title="Buyurtmani tekshirish">
                                <div className="bg-light p-3 rounded small">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Sayohatchilar:</span>
                                        <span className="fw-bold">{formData.adults}ta katta, {formData.children}ta bola</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Sana:</span>
                                        <span className="fw-bold">{formData.travelDate || 'Belgilanmagan'}</span>
                                    </div>
                                    <div className="d-flex justify-content-between pt-2 border-top">
                                        <span className="fw-bold">Jami:</span>
                                        <span className="fw-bold text-primary fs-5">${totalPrice}</span>
                                    </div>
                                </div>
                            </StageWrapper>

                            <StageWrapper num={7} title="To'lov va yakunlash" isLast={true}>
                                <div className="row g-3">
                                    <div className="col-md-12">
                                        <select className="form-select border-light bg-light py-2 small" value={formData.paymentMethod} onChange={(e) => handleInputChange('direct', 'paymentMethod', e.target.value)}>
                                            <option value="Card">Kredit / Debet karta</option>
                                            <option value="Bank">Bank o'tkazmasi</option>
                                            <option value="Online">Onlayn to'lov</option>
                                        </select>
                                    </div>
                                    <div className="col-md-12">
                                        <button type="submit" className="btn btn-primary btn-lg w-100 py-3 rounded-pill fw-bold shadow-sm">
                                            BUYURTMA BERISH
                                        </button>
                                    </div>
                                </div>
                            </StageWrapper>
                        </form>
                    </div>

                    {/* Right: Tour Info Sidebar */}
                    <div className="col-lg-3">
                        <div className="sticky-top" style={{ top: '20px' }}>
                            <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
                                <img src={selectedPackage.image} className="card-img-top" alt={selectedPackage.title} style={{ height: '140px', objectFit: 'cover' }} />
                                <div className="card-body p-3">
                                    <h6 className="fw-bold mb-3 border-bottom pb-2">🏷️ {selectedPackage.title}</h6>

                                    <div className="mb-3 x-small">
                                        <p className="mb-1 text-dark">
                                            <span className="me-2">📍</span>
                                            {selectedPackage.fromCity} → {selectedPackage.toCity}
                                        </p>
                                        <p className="mb-1 text-dark"><span className="me-2">⏳</span> {selectedPackage.duration}</p>
                                        <p className="mb-1 text-dark"><span className="me-2">📅</span> {formData.travelDate || "..."}</p>
                                    </div>

                                    <div className="bg-light p-2 rounded mb-3 shadow-none border-start border-4 border-warning x-small">
                                        <p className="mb-1 fw-bold">128 ta bandlov</p>
                                        <p className="mb-0 text-danger fw-bold">🔥 Faol tur</p>
                                    </div>

                                    <div className="price-breakdown mb-3 x-small">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Kattalar: {formData.adults}x</span>
                                            <span className="fw-bold">${formData.adults * selectedPackage.priceAdult}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Bolalar: {formData.children}x</span>
                                            <span className="fw-bold">${formData.children * selectedPackage.priceChild}</span>
                                        </div>
                                    </div>

                                    <div className="bg-primary text-white p-2 rounded-pill text-center shadow-sm">
                                        <span className="small fw-bold">JAMI: ${totalPrice}</span>
                                    </div>

                                    {selectedPackage.included?.length > 0 && (
                                        <div className="mt-3 pt-3 border-top x-small">
                                            <p className="fw-bold mb-2">Narxga kiritilgan:</p>
                                            <ul className="list-unstyled mb-0">
                                                {selectedPackage.included.map((item, idx) => (
                                                    <li key={idx} className="mb-1 text-success d-flex align-items-start">
                                                        <i className="fa fa-check-circle me-2 mt-1"></i> {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {selectedPackage.notIncluded?.length > 0 && (
                                        <div className="mt-3 pt-3 border-top x-small">
                                            <p className="fw-bold mb-2">Narxga kiritilmagan:</p>
                                            <ul className="list-unstyled mb-0">
                                                {selectedPackage.notIncluded.map((item, idx) => (
                                                    <li key={idx} className="mb-1 text-muted d-flex align-items-start">
                                                        <i className="fa fa-times-circle me-2 mt-1"></i> {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .border-dotted {
                    border-style: dotted !important;
                }
                .transition {
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .transition-all {
                    transition: all 0.5s ease;
                }
                .x-small {
                    font-size: 12px;
                }
                .curson-pointer {
                    cursor: pointer;
                }
                .scale-up {
                    transform: scale(1.02);
                }
                .stage-content {
                    overflow: hidden;
                }
                .transition-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .sidebar-sticky {
                    top: 100px;
                }
                .step-circle {
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    cursor: pointer;
                }
                .btn-primary {
                    background: linear-gradient(45deg, #30c39e, #10b981);
                    border: none;
                    transition: transform 0.2s;
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);
                }
            `}</style>
        </div>
    );
}

export default BandQilish;
