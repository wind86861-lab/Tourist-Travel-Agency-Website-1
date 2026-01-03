import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toursAPI } from '../services/api';

const TourDetails = () => {
    const { id } = useParams();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Scroll to top and fetch tour data on mount
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchTour();
    }, [id]);

    const fetchTour = async () => {
        try {
            setLoading(true);
            const data = await toursAPI.getById(id);
            setTour(data);
        } catch (err) {
            setError(err.message || 'Tour not found');
        } finally {
            setLoading(false);
        }
    };

    // Default images for tours without images
    const defaultImages = [
        '/assets/img/package-1.jpg',
        '/assets/img/package-2.jpg',
        '/assets/img/package-3.jpg',
    ];

    // Generate default itinerary based on duration
    const generateItinerary = (tour) => {
        if (!tour) return [];
        if (tour.itinerary && tour.itinerary.length > 0) {
            return tour.itinerary.sort((a, b) => a.day - b.day).map(item => ({
                day: `${item.day}-kun`,
                title: item.title,
                desc: item.description
            }));
        }
        const days = parseInt(tour.duration) || 7;
        const defaultItinerary = [
            { day: "1-kun", title: "Yetib kelish va joylashish", desc: `${tour.fromCity}dan ${tour.toCity}ga uchish. Aeroportda kutib olish va mehmonxonaga transfer.` },
            { day: "2-kun", title: "Shahar bo'ylab sayohat", desc: `${tour.toCity} shahrining tarixiy joylari va diqqatga sazovor joylarini ko'rish.` },
            { day: "3-kun", title: "Ekskursiya", desc: "Mahalliy bozorlar va turistik markazlarga tashrif." },
        ];

        // Add middle days
        for (let i = 4; i < days; i++) {
            defaultItinerary.push({
                day: `${i}-kun`,
                title: "Dam olish va sayohat",
                desc: "Erkin dam olish yoki qo'shimcha ekskursiyalar."
            });
        }

        // Add last day
        if (days > 3) {
            defaultItinerary.push({
                day: `${days}-kun`,
                title: "Xayrlashuv",
                desc: `Xaridorlar uchun bo'sh vaqt va ${tour.fromCity}ga qaytish uchun aeroportga transfer.`
            });
        }

        return defaultItinerary.slice(0, days);
    };

    // Generate highlights based on tour data
    const generateHighlights = (tour) => {
        if (!tour) return [];
        const highlights = [];

        if (tour.packageType === 'Full') {
            highlights.push("To'liq paket - Barcha xizmatlar kiritilgan");
        }
        if (tour.tourType === 'B2B' && tour.flightVendors?.length > 0) {
            highlights.push(`Aviakompaniyalar: ${tour.flightVendors.join(', ')}`);
        }
        highlights.push(`${tour.capacity} kishilik guruh`);
        highlights.push(`Davomiyligi: ${tour.duration}`);
        if (tour.tourType === 'B2B') {
            highlights.push("B2B Agentlik paketi");
        }
        highlights.push("Professional gid xizmati");
        highlights.push("Mehmonxona transferlari");

        return highlights;
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
                    <p className="text-muted">Loading tour details...</p>
                </div>
            </div>
        );
    }

    if (error || !tour) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <i className="fa fa-exclamation-triangle text-warning fs-1 mb-3"></i>
                    <h3>Tour Not Found</h3>
                    <p className="text-muted mb-4">{error || 'The requested tour could not be found.'}</p>
                    <Link to="/packages" className="btn btn-primary rounded-pill px-4">
                        <i className="fa fa-arrow-left me-2"></i>Back to Packages
                    </Link>
                </div>
            </div>
        );
    }

    const tourImage = tour.images?.[0]
        ? (tour.images[0].startsWith('http') ? tour.images[0] : `http://localhost:5000${tour.images[0]}`)
        : defaultImages[0];
    const itinerary = generateItinerary(tour);
    const highlights = generateHighlights(tour);

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('uz-UZ', options);
    };

    return (
        <div>
            {/* Hero Header */}
            <div className="container-fluid bg-primary py-5 mb-5 hero-header">
                <div className="container py-5">
                    <div className="row justify-content-center py-5">
                        <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
                            <h1 className="display-3 text-white animated slideInDown">
                                {tour.title}
                            </h1>
                            <p className="text-white-50 fs-5 mb-3">
                                <i className="fa fa-route me-2"></i>
                                {tour.fromCity} → {tour.toCity}
                            </p>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb justify-content-center">
                                    <li className="breadcrumb-item"><Link to="/">Bosh sahifa</Link></li>
                                    <li className="breadcrumb-item"><Link to="/packages">Paketlar</Link></li>
                                    <li className="breadcrumb-item text-white active" aria-current="page">Batafsil</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-5">
                        {/* Left Column: Details */}
                        <div className="col-lg-8">
                            <div className="mb-5">
                                <img className="img-fluid rounded mb-4 w-100" src={tourImage} alt={tour.title} style={{ maxHeight: '500px', objectFit: 'cover' }} />

                                <h2 className="mb-4">Sayohat haqida</h2>
                                <p className="text-muted fs-5">
                                    {tour.description || `${tour.fromCity}dan ${tour.toCity}ga unutilmas sayohat. Ushbu ${tour.duration} davom etadigan tur barcha qulayliklarni o'z ichiga olgan bo'lib, sizga haqiqiy dam olish zavqini bag'ishlaydi. ${tour.capacity} kishilik guruhda qatnashish imkoniyatini qo'ldan boy bermang.`}
                                </p>

                                <div className="mt-4 p-3 bg-light rounded border-start border-4 border-warning">
                                    <h6 className="fw-bold mb-1">
                                        <i className={`fa ${tour.isVisaRequired ? 'fa-id-card' : 'fa-check-circle'} me-2`}></i>
                                        Viza haqida ma'lumot:
                                    </h6>
                                    <p className="mb-0 text-muted">
                                        {tour.isVisaRequired
                                            ? (tour.visaInfo || "Ushbu sayohat uchun viza talab qilinadi.")
                                            : "Ushbu sayohat uchun viza talab qilinmaydi."}
                                    </p>
                                </div>

                                {tour.images?.length > 1 && (
                                    <div className="mt-5">
                                        <h3 className="mb-4">Rasmlar galeriyasi</h3>
                                        <div className="row g-2">
                                            {tour.images.map((img, i) => (
                                                <div key={i} className="col-4">
                                                    <img
                                                        src={img.startsWith('http') ? img : `http://localhost:5000${img}`}
                                                        className="img-fluid rounded cursor-pointer border"
                                                        alt="Gallery"
                                                        style={{ height: '120px', width: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Flight Vendor - Show only for B2B */}
                            {tour.tourType === 'B2B' && tour.flightVendors?.length > 0 && (
                                <div className="mb-5">
                                    <h3 className="mb-4">Aviakompaniya</h3>
                                    <div className="d-flex align-items-center bg-light border rounded-3 p-3">
                                        <i className="fa fa-plane text-primary fs-4 me-3"></i>
                                        <div>
                                            <span className="fw-bold fs-5">
                                                {tour.tourType === 'B2B'
                                                    ? tour.flightVendors.join(' / ')
                                                    : tour.flightVendors[0]}
                                            </span>
                                            {tour.tourType === 'B2C' && (
                                                <p className="text-muted small mb-0">To'g'ridan-to'g'ri reys</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {tour.included?.length > 0 ? (
                                <div className="row g-4 mb-5">
                                    <div className="col-12">
                                        <h3 className="mb-4">Narxga kiritilgan</h3>
                                        <div className="row g-2">
                                            {tour.included.map((item, index) => (
                                                <div className="col-sm-6" key={index}>
                                                    <div className="d-flex align-items-center bg-success-subtle border border-success-subtle rounded p-3">
                                                        <i className="fa fa-check-circle text-success me-3 fs-5"></i>
                                                        <span className="fw-medium text-dark">{item}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {tour.notIncluded?.length > 0 && (
                                        <div className="col-12">
                                            <h3 className="mb-4">Narxga kiritilmagan (Qo'shimcha)</h3>
                                            <div className="row g-2">
                                                {tour.notIncluded.map((item, index) => (
                                                    <div className="col-sm-6" key={index}>
                                                        <div className="d-flex align-items-center bg-light border border-secondary-subtle rounded p-3 text-muted">
                                                            <i className="fa fa-times-circle me-3 fs-5"></i>
                                                            <span className="fw-medium">{item}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="mb-5">
                                    <h3 className="mb-4">Asosiy qulayliklar</h3>
                                    <div className="row g-3">
                                        {highlights.map((h, index) => (
                                            <div className="col-sm-6" key={index}>
                                                <div className="d-flex align-items-center bg-light border-start border-5 border-primary p-3">
                                                    <i className="fa fa-check text-primary me-3"></i>
                                                    <span className="fw-bold">{h}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-5">
                                <h3 className="mb-4">Sayohat dasturi (Itinerary)</h3>
                                <div className="itinerary-timeline ms-3 mt-4">
                                    {itinerary.map((item, index) => (
                                        <div className="itinerary-item mb-4 position-relative ps-4" key={index}>
                                            <div className="timeline-dot bg-primary position-absolute start-0 top-0 mt-1" style={{ width: 15, height: 15, borderRadius: '50%', marginLeft: -7 }}></div>
                                            <h5 className="text-primary">{item.day}: {item.title}</h5>
                                            <p className="mb-0 text-muted">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Sidebar */}
                        <div className="col-lg-4">
                            <div className="bg-light p-4 rounded mb-5 sticky-top" style={{ top: '100px' }}>
                                <div className="mb-3">
                                    <h4 className="mb-0">Kattalar uchun</h4>
                                    <h2 className="text-primary fw-bold">${tour.priceAdult}</h2>
                                </div>
                                <div className="mb-4 pb-3 border-bottom">
                                    <small className="text-muted">Bolalar uchun</small>
                                    <h5 className="text-success">${tour.priceChild}</h5>
                                </div>

                                {tour.startDate && (
                                    <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                        <span><i className="fa fa-calendar-check text-primary me-2"></i>Sana:</span>
                                        <span className="fw-bold">{formatDate(tour.startDate)}</span>
                                    </div>
                                )}

                                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                    <span><i className="fa fa-calendar-alt text-primary me-2"></i>Davomiyligi:</span>
                                    <span className="fw-bold">{tour.duration}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                    <span><i className="fa fa-user-friends text-primary me-2"></i>Sig'im:</span>
                                    <span className="fw-bold">{tour.capacity} kishi</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                    <span><i className="fa fa-ticket-alt text-primary me-2"></i>Mavjud:</span>
                                    <span className="fw-bold text-success">{tour.availableSpots || tour.capacity} joy</span>
                                </div>
                                <div className="d-flex justify-content-between mb-4 border-bottom pb-2">
                                    <span><i className="fa fa-map-marker-alt text-primary me-2"></i>Manzil:</span>
                                    <span className="fw-bold">{tour.toCity}</span>
                                </div>

                                <Link
                                    to="/band-qilish"
                                    state={{
                                        id: tour._id,
                                        title: tour.title,
                                        fromCity: tour.fromCity,
                                        toCity: tour.toCity,
                                        duration: tour.duration,
                                        priceAdult: tour.priceAdult,
                                        priceChild: tour.priceChild,
                                        flightVendors: tour.flightVendors || [],
                                        image: tourImage,
                                        included: tour.included || [],
                                        notIncluded: tour.notIncluded || []
                                    }}
                                    className="btn btn-primary w-100 py-3 rounded-pill shadow"
                                >
                                    <i className="fa fa-calendar-check me-2"></i>Hozir band qilish
                                </Link>

                                <div className="mt-4 pt-3 border-top">
                                    <p className="small text-center text-muted mb-0">Savollaringiz bormi? Biz bilan bog'laning:</p>
                                    <h5 className="text-center mt-2">+998 77 737 80 20</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inline Styles for Timeline */}
            <style>{`
        .itinerary-timeline {
            border-left: 2px solid #86b817;
        }
        .itinerary-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 25px;
            bottom: -25px;
            width: 0;
            border-left: 2px solid transparent;
        }
      `}</style>
        </div>
    );
};

export default TourDetails;
