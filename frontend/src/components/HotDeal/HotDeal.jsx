import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toursAPI } from '../../services/api';
import './HotDeal.css';

const HotDeal = () => {
    const calculateTimeLeft = () => {
        const targetDate = new Date();
        // Set target to tomorrow midnight for demo purposes
        targetDate.setHours(24, 0, 0, 0);

        const difference = +targetDate - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [hotTour, setHotTour] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotTour = async () => {
            try {
                const tours = await toursAPI.getAll('status=Active');
                // Find tour with highest discount
                const discountedTours = tours.filter(t => t.discountType !== 'none');
                if (discountedTours.length > 0) {
                    const best = discountedTours.reduce((prev, current) => {
                        const prevValue = prev.discountType === 'percentage' ? prev.discountValue : (prev.discountValue / prev.priceAdult * 100);
                        const currValue = current.discountType === 'percentage' ? current.discountValue : (current.discountValue / current.priceAdult * 100);
                        return (currValue > prevValue) ? current : prev;
                    });
                    setHotTour(best);
                }
            } catch (err) {
                console.error('Failed to fetch hot tour:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHotTour();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    if (loading || !hotTour) return null;

    const discountDisplay = hotTour.discountType === 'percentage'
        ? `-${hotTour.discountValue}%`
        : `-$${hotTour.discountValue}`;

    const discountedPrice = hotTour.discountType === 'percentage'
        ? (hotTour.priceAdult * (1 - hotTour.discountValue / 100)).toFixed(0)
        : hotTour.priceAdult - hotTour.discountValue;

    return (
        <div className="container-xxl py-5 hot-deal-section">
            <div className="container">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                        <div className="position-relative h-100 hot-deal-img-wrapper">
                            <img
                                className="img-fluid rounded w-100 h-100"
                                src={hotTour.images?.[0] ? (hotTour.images[0].startsWith('http') ? hotTour.images[0] : `http://localhost:5000${hotTour.images[0]}`) : "assets/img/package-3.jpg"}
                                alt={hotTour.title}
                                style={{ objectFit: "cover", minHeight: '400px' }}
                            />
                            <div className="promo-badge">
                                <span>{discountDisplay}</span>
                                <small>Chegirma</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
                        <h6 className="section-title bg-white text-start text-danger pe-3">
                            QAYNOQ TAKLIF 🔥
                        </h6>
                        <h1 className="mb-4">{hotTour.title}</h1>
                        <p className="mb-4 text-justify">
                            {hotTour.description || "Faqat bugun! Ushbu ajoyib sayohat imkoniyatini qo'ldan boy bermang. Narx ichiga barcha xizmatlar kiritilgan."}
                        </p>

                        <div className="countdown-container mb-4">
                            <div className="countdown-item">
                                <span className="number">{timeLeft.hours || '00'}</span>
                                <span className="label">Soat</span>
                            </div>
                            <div className="countdown-item">
                                <span className="number">{timeLeft.minutes || '00'}</span>
                                <span className="label">Daqiqa</span>
                            </div>
                            <div className="countdown-item">
                                <span className="number">{timeLeft.seconds || '00'}</span>
                                <span className="label">Soniya</span>
                            </div>
                        </div>

                        <div className="price-tag mb-4">
                            <span className="old-price">${hotTour.priceAdult}</span>
                            <span className="new-price text-primary">${discountedPrice}</span>
                            <small className="ms-2">/ kishi boshiga</small>
                        </div>

                        <Link to={`/tour/${hotTour._id}`} className="btn btn-primary py-3 px-5 mt-2 rounded-pill shadow">
                            Hozir Band Qiling
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotDeal;
