import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toursAPI } from '../services/api'
import { useTranslation } from 'react-i18next'

function Packages() {
  const { t, i18n } = useTranslation();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await toursAPI.getAll('status=Active');
        setTours(data);
      } catch (err) {
        console.error('Failed to load tours:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const defaultImages = [
    '/assets/img/package-1.jpg',
    '/assets/img/package-2.jpg',
    '/assets/img/package-3.jpg',
  ];

  const formatDate = (dateString) => {
    if (!dateString) return t('packages.no_date') || 'No date';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    try {
      return new Date(dateString).toLocaleDateString(i18n.language === 'uz' ? 'uz-UZ' : (i18n.language === 'ru' ? 'ru-RU' : 'en-US'), options);
    } catch (e) {
      return dateString;
    }
  };

  const getImageUrl = (tour, index) => {
    if (tour.images && tour.images.length > 0) {
      const img = tour.images[0];
      return img.startsWith('http') ? img : `http://localhost:5000${img}`;
    }
    return defaultImages[index % 3];
  };

  return (
    <div>
      <div className="container-fluid bg-primary py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white animated slideInDown">
                {t('packages.title')}
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item">
                    <Link to="/">{t('packages.breadcrumb_home')}</Link>
                  </li>
                  <li
                    className="breadcrumb-item text-white active"
                    aria-current="page"
                  >
                    {t('packages.title')}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* Package Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">
              {t('packages.title')}
            </h6>
            <h1 className="mb-5">{t('packages.awesome_packages')}</h1>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
              <p className="text-muted">{t('packages.loading')}</p>
            </div>
          ) : tours.length === 0 ? (
            <div className="text-center py-5">
              <i className="fa fa-suitcase-rolling fs-1 text-muted mb-3"></i>
              <h4>{t('packages.no_tours')}</h4>
              <p className="text-muted">{t('packages.check_back')}</p>
            </div>
          ) : (
            <div className="row g-4 justify-content-center">
              {tours.map((tour, index) => (
                <div key={tour._id} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay={`${0.1 + index * 0.2}s`}>
                  <div className="package-item">
                    <div className="overflow-hidden position-relative">
                      <img
                        className="img-fluid"
                        src={getImageUrl(tour, index)}
                        alt={tour.title}
                        style={{ height: '250px', width: '100%', objectFit: 'cover' }}
                      />
                      <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-2">
                        {tour.isPopular && <span className="badge bg-danger">{t('home.popular')}</span>}
                        {tour.isGreatPackage && <span className="badge bg-success">{t('home.great')}</span>}
                      </div>
                      {tour.discountType !== 'none' && (
                        <div className="position-absolute top-0 end-0 m-3">
                          <span className="badge bg-warning text-dark fw-bold shadow-sm py-2 px-3">
                            -{tour.discountType === 'percentage' ? `${tour.discountValue}%` : `$${tour.discountValue}`}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="d-flex border-bottom align-items-center">
                      <small className="flex-fill text-center border-end py-2">
                        <i className="fa fa-map-marker-alt text-primary me-2" />
                        {tour.toCity}
                      </small>
                      <small className="flex-fill text-center border-end py-2">
                        <i className="fa fa-calendar-alt text-primary me-2" />{tour.duration}
                      </small>
                      <small className="flex-fill text-center border-end py-2">
                        <i className="fa fa-calendar-check text-primary me-2" />{formatDate(tour.startDate)}
                      </small>
                      <small className="flex-fill text-center py-2">
                        <i className="fa fa-user text-primary me-2" />{tour.capacity} {t('packages.spots')}
                      </small>
                    </div>
                    <div className="text-center p-4">
                      {tour.discountType !== 'none' ? (
                        <div className="mb-2">
                          <span className="h5 text-muted text-decoration-line-through me-2">${tour.priceAdult}</span>
                          <h3 className="mb-0 d-inline-block text-primary">${tour.discountType === 'percentage'
                            ? (tour.priceAdult * (1 - tour.discountValue / 100)).toFixed(0)
                            : tour.priceAdult - tour.discountValue}</h3>
                        </div>
                      ) : (
                        <h3 className="mb-0">${tour.priceAdult}</h3>
                      )}
                      <p className="text-muted small mb-2">{tour.fromCity} → {tour.toCity}</p>
                      <div className="mb-3">
                        <small className="fa fa-star text-primary" />
                        <small className="fa fa-star text-primary" />
                        <small className="fa fa-star text-primary" />
                        <small className="fa fa-star text-primary" />
                        <small className="fa fa-star text-primary" />
                      </div>
                      <h5 className="fw-bold mb-2">{tour.title}</h5>
                      <p className="small text-muted">
                        {tour.description?.substring(0, 80) || 'Experience an amazing journey with our premium tour package.'}
                        {tour.description?.length > 80 ? '...' : ''}
                      </p>
                      <div className="d-flex justify-content-center mb-2">
                        <Link
                          to={`/tour/${tour._id}`}
                          className="btn btn-sm btn-primary px-3 border-end"
                          style={{ borderRadius: "30px 0 0 30px" }}
                        >
                          {t('packages.details')}
                        </Link>
                        <Link
                          to="/band-qilish"
                          state={{ id: tour._id, title: tour.title, fromCity: tour.fromCity, toCity: tour.toCity, priceAdult: tour.priceAdult }}
                          className="btn btn-sm btn-primary px-3"
                          style={{ borderRadius: "0 30px 30px 0" }}
                        >
                          {t('packages.book')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Package End */}
      {/* Booking Start */}
      <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container">
          <div className="booking p-5">
            <div className="row g-5 align-items-center">
              <div className="col-md-6 text-white">
                <h6 className="text-white text-uppercase">{t('booking.title')}</h6>
                <h1 className="text-white mb-4">{t('booking.online_booking')}</h1>
                <p className="mb-4">
                  Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit.
                  Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit.
                </p>
                <p className="mb-4">
                  Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit.
                  Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit,
                  sed stet lorem sit clita duo justo magna dolore erat amet
                </p>
                <Link className="btn btn-outline-light py-3 px-5 mt-2" to="/packages">
                  {t('nav.packages')}
                </Link>
              </div>
              <div className="col-md-6">
                <h1 className="text-white mb-4">{t('booking.book_tour')}</h1>
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control bg-transparent"
                          id="name"
                          placeholder={t('booking.name_label')}
                        />
                        <label htmlFor="name">{t('booking.name_label')}</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control bg-transparent"
                          id="email"
                          placeholder={t('booking.email_label')}
                        />
                        <label htmlFor="email">{t('booking.email_label')}</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="form-floating date"
                        id="date3"
                        data-target-input="nearest"
                      >
                        <input
                          type="text"
                          className="form-control bg-transparent datetimepicker-input"
                          id="datetime"
                          placeholder={t('booking.datetime_label')}
                          data-target="#date3"
                          data-toggle="datetimepicker"
                        />
                        <label htmlFor="datetime">{t('booking.datetime_label')}</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          className="form-select bg-transparent"
                          id="select1"
                        >
                          {tours.map(t => (
                            <option key={t._id} value={t._id}>{t.toCity}</option>
                          ))}
                        </select>
                        <label htmlFor="select1">{t('booking.destination_label')}</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          className="form-control bg-transparent"
                          placeholder={t('booking.request_label')}
                          id="message"
                          style={{ height: 100 }}
                          defaultValue={""}
                        />
                        <label htmlFor="message">{t('booking.request_label')}</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        className="btn btn-outline-light w-100 py-3"
                        type="submit"
                      >
                        {t('booking.submit')}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Booking Start */}
      {/* Process Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center pb-4 wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">
              {t('process.title')}
            </h6>
            <h1 className="mb-5">{t('process.subtitle')}</h1>
          </div>
          <div className="row gy-5 gx-4 justify-content-center">
            <div
              className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp"
              data-wow-delay="0.1s"
            >
              <div className="position-relative border border-primary pt-5 pb-4 px-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle position-absolute top-0 start-50 translate-middle shadow"
                  style={{ width: 100, height: 100 }}
                >
                  <i className="fa fa-globe fa-3x text-white" />
                </div>
                <h5 className="mt-4">{t('process.step1_title')}</h5>
                <hr className="w-25 mx-auto bg-primary mb-1" />
                <hr className="w-50 mx-auto bg-primary mt-0" />
                <p className="mb-0">
                  {t('process.step1_desc')}
                </p>
              </div>
            </div>
            <div
              className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp"
              data-wow-delay="0.3s"
            >
              <div className="position-relative border border-primary pt-5 pb-4 px-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle position-absolute top-0 start-50 translate-middle shadow"
                  style={{ width: 100, height: 100 }}
                >
                  <i className="fa fa-dollar-sign fa-3x text-white" />
                </div>
                <h5 className="mt-4">{t('process.step2_title')}</h5>
                <hr className="w-25 mx-auto bg-primary mb-1" />
                <hr className="w-50 mx-auto bg-primary mt-0" />
                <p className="mb-0">
                  {t('process.step2_desc')}
                </p>
              </div>
            </div>
            <div
              className="col-lg-4 col-sm-6 text-center pt-4 wow fadeInUp"
              data-wow-delay="0.5s"
            >
              <div className="position-relative border border-primary pt-5 pb-4 px-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle position-absolute top-0 start-50 translate-middle shadow"
                  style={{ width: 100, height: 100 }}
                >
                  <i className="fa fa-plane fa-3x text-white" />
                </div>
                <h5 className="mt-4">{t('process.step3_title')}</h5>
                <hr className="w-25 mx-auto bg-primary mb-1" />
                <hr className="w-50 mx-auto bg-primary mt-0" />
                <p className="mb-0">
                  {t('process.step3_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Process Start */}
    </div >
  )
}

export default Packages