import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import AdvancedSearch from '../components/AdvancedSearch/AdvancedSearch'
import HotDeal from '../components/HotDeal/HotDeal'
import { toursAPI } from '../services/api'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation();
  const [greatPackages, setGreatPackages] = React.useState([]);
  const [popularTours, setPopularTours] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const tours = await toursAPI.getAll('status=Active');
        setGreatPackages(tours.filter(t => t.isGreatPackage));
        setPopularTours(tours.filter(t => t.isPopular));
      } catch (err) {
        console.error('Failed to fetch home tours:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const packageCarouselRef = useRef(null);
  const testimonialCarouselRef = useRef(null);

  // Carousel Initialization and Cleanup
  useEffect(() => {
    if (loading || greatPackages.length === 0) return;

    let timer;
    const initCarousels = () => {
      if (window.$ && window.$.fn && window.$.fn.owlCarousel) {
        // Destroy existing instance if any
        const $package = window.$(packageCarouselRef.current);
        if ($package.data('owl.carousel')) {
          $package.owlCarousel('destroy');
        }

        $package.owlCarousel({
          autoplay: true,
          smartSpeed: 1000,
          margin: 24,
          dots: false,
          loop: greatPackages.length > 3,
          nav: true,
          navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
          ],
          responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
          }
        });

        const $testimonial = window.$(".testimonial-carousel");
        if ($testimonial.data('owl.carousel')) {
          $testimonial.owlCarousel('destroy');
        }
        $testimonial.owlCarousel({
          autoplay: true,
          smartSpeed: 1000,
          center: true,
          margin: 24,
          dots: true,
          loop: true,
          nav: false,
          responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
          }
        });

        return true;
      }
      return false;
    };

    if (!initCarousels()) {
      timer = setInterval(() => {
        if (initCarousels()) {
          clearInterval(timer);
        }
      }, 500);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (window.$ && packageCarouselRef.current) {
        window.$(packageCarouselRef.current).owlCarousel('destroy');
      }
      if (window.$) {
        window.$(".testimonial-carousel").owlCarousel('destroy');
      }
    };
  }, [loading, greatPackages]);

  return (
    <div>
      <div className="container-fluid bg-primary py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white mb-3 animated slideInDown">
                {t('hero.title')}
              </h1>
              <p className="fs-4 text-white mb-4 animated slideInDown">
                {t('hero.subtitle')}
              </p>
              <div className="position-relative w-75 mx-auto animated slideInDown">
                <input
                  className="form-control border-0 rounded-pill w-100 py-3 ps-4 pe-5"
                  type="text"
                  placeholder={t('hero.search_placeholder')}
                  readOnly // Make it read-only for now if we just want it to act as a button, or let user type and pass query
                />
                <Link
                  to="/search"
                  className="btn btn-primary rounded-pill py-2 px-4 position-absolute top-0 end-0 me-2"
                  style={{ marginTop: 7 }}
                >
                  {t('hero.search_btn')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Package Start */}
      {!loading && greatPackages.length > 0 && (
        <div className="container-xxl py-5">
          <div className="container">
            <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
              <h6 className="section-title bg-white text-center text-primary px-3">
                {t('home.packages_title')}
              </h6>
              <h1 className="mb-5">{t('home.awesome_packages')}</h1>
            </div>
            <div className="owl-carousel package-carousel" ref={packageCarouselRef}>
              {greatPackages.map((tour, index) => (
                <div key={tour._id} className="package-item">
                  <div className="overflow-hidden position-relative">
                    <img
                      className="img-fluid"
                      src={tour.images?.[0] ? (tour.images[0].startsWith('http') ? tour.images[0] : `http://localhost:5000${tour.images[0]}`) : `/assets/img/package-${(index % 3) + 1}.jpg`}
                      alt={tour.title}
                      style={{ height: '250px', width: '100%', objectFit: 'cover' }}
                    />
                    {tour.discountType !== 'none' && (
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge bg-warning text-dark fw-bold">
                          -{tour.discountType === 'percentage' ? `${tour.discountValue}%` : `$${tour.discountValue}`}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="d-flex border-bottom">
                    <small className="flex-fill text-center border-end py-2">
                      <i className="fa fa-map-marker-alt text-primary me-2" />
                      {tour.toCity}
                    </small>
                    <small className="flex-fill text-center border-end py-2">
                      <i className="fa fa-calendar-alt text-primary me-2" />{tour.duration}
                    </small>
                    <small className="flex-fill text-center py-2">
                      <i className="fa fa-user text-primary me-2" />{tour.capacity} Spots
                    </small>
                  </div>
                  <div className="text-center p-4">
                    {tour.discountType !== 'none' ? (
                      <div className="mb-2">
                        <small className="text-muted text-decoration-line-through me-2">${tour.priceAdult}</small>
                        <h3 className="mb-0 d-inline-block text-primary">
                          ${tour.discountType === 'percentage'
                            ? (tour.priceAdult * (1 - tour.discountValue / 100)).toFixed(0)
                            : tour.priceAdult - tour.discountValue}
                        </h3>
                      </div>
                    ) : (
                      <h3 className="mb-0">${tour.priceAdult}</h3>
                    )}
                    <div className="mb-3">
                      <small className="fa fa-star text-primary" />
                      <small className="fa fa-star text-primary" />
                      <small className="fa fa-star text-primary" />
                      <small className="fa fa-star text-primary" />
                      <small className="fa fa-star text-primary" />
                    </div>
                    <h5 className="mb-2">{tour.title}</h5>
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
                        {t('home.details')}
                      </Link>
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
                          image: tour.images?.[0] || `/assets/img/package-${(index % 3) + 1}.jpg`,
                          included: tour.included || [],
                          notIncluded: tour.notIncluded || []
                        }}
                        className="btn btn-sm btn-primary px-3"
                        style={{ borderRadius: "0 30px 30px 0" }}
                      >
                        {t('home.book_now')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Package End */}
      {/* Package End */}
      {/* Hot Deal Start */}
      <HotDeal />
      {/* Hot Deal End */}
      {/* Service Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">
              Xizmatlar
            </h6>
            <h1 className="mb-5">Bizning xizmatlar</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-globe text-primary mb-4" />
                  <h5>WorldWide Tours</h5>
                  <p>
                    Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita
                    amet diam
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-hotel text-primary mb-4" />
                  <h5>Hotel Reservation</h5>
                  <p>
                    Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita
                    amet diam
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-user text-primary mb-4" />
                  <h5>Travel Guides</h5>
                  <p>
                    Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita
                    amet diam
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-cog text-primary mb-4" />
                  <h5>Event Management</h5>
                  <p>
                    Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita
                    amet diam
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-globe text-primary mb-4" />
                  <h5>WorldWide Tours</h5>
                  <p>
                    Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita
                    amet diam
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-hotel text-primary mb-4" />
                  <h5>Hotel Reservation</h5>
                  <p>
                    Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita
                    amet diam
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-user text-primary mb-4" />
                  <h5>Travel Guides</h5>
                  <p>
                    Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita
                    amet diam
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-cog text-primary mb-4" />
                  <h5>Event Management</h5>
                  <p>
                    Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita
                    amet diam
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Service End */}
      {/* Destination Start */}
      {!loading && popularTours.length > 0 && (
        <div className="container-xxl py-5 destination">
          <div className="container">
            <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
              <h6 className="section-title bg-white text-center text-primary px-3">
                {t('home.popular_destinations')}
              </h6>
              <h1 className="mb-5">{t('home.popular_destinations')}</h1>
            </div>
            <div className="row g-3">
              <div className="col-lg-7 col-md-6">
                <div className="row g-3">
                  {popularTours.slice(0, 3).map((tour, idx) => (
                    <div key={tour._id} className={`col-lg-${idx === 0 ? '12' : '6'} col-md-12 wow zoomIn`} data-wow-delay={`${0.1 + idx * 0.2}s`}>
                      <Link className="position-relative d-block overflow-hidden" to={`/tour/${tour._id}`}>
                        <img
                          className="img-fluid"
                          src={tour.images?.[0] ? (tour.images[0].startsWith('http') ? tour.images[0] : `http://localhost:5000${tour.images[0]}`) : `/assets/img/destination-${idx + 1}.jpg`}
                          alt={tour.toCity}
                          style={{ width: '100%', height: idx === 0 ? '350px' : '200px', objectFit: 'cover' }}
                        />
                        {tour.discountType !== 'none' && (
                          <div className="bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">
                            {tour.discountType === 'percentage' ? `${tour.discountValue}% OFF` : `$${tour.discountValue} OFF`}
                          </div>
                        )}
                        <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">
                          {tour.toCity}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              {popularTours[3] && (
                <div className="col-lg-5 col-md-6 wow zoomIn" data-wow-delay="0.7s" style={{ minHeight: 350 }}>
                  <Link className="position-relative d-block h-100 overflow-hidden" to={`/tour/${popularTours[3]._id}`}>
                    <img
                      className="img-fluid position-absolute w-100 h-100"
                      src={popularTours[3].images?.[0] ? (popularTours[3].images[0].startsWith('http') ? popularTours[3].images[0] : `http://localhost:5000${popularTours[3].images[0]}`) : "/assets/img/destination-4.jpg"}
                      alt={popularTours[3].toCity}
                      style={{ objectFit: "cover" }}
                    />
                    {popularTours[3].discountType !== 'none' && (
                      <div className="bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">
                        {popularTours[3].discountType === 'percentage' ? `${popularTours[3].discountValue}% OFF` : `$${popularTours[3].discountValue} OFF`}
                      </div>
                    )}
                    <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">
                      {popularTours[3].toCity}
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Destination End */}
      {/* Destination Start */}

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
                <Link className="btn btn-outline-light py-3 px-5 mt-2" to="/tour/1">
                  {t('home.details')}
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
                          <option value={1}>Destination 1</option>
                          <option value={2}>Destination 2</option>
                          <option value={3}>Destination 3</option>
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
      {/* Team and Testimonial Start - Hidden until real data is available */}
      {/* Team and Testimonial End */}
    </div>
  )
}
