import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import LanguageSwitcher from './LanguageSwitcher'

function Header() {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <div>
      {/* Spinner Start */}
      {/* <div
      id="spinner"
      className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
    >
      <div
        className="spinner-border text-primary"
        style={{ width: "3rem", height: "3rem" }}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div> */}
      {/* Spinner End */}

      {/* Topbar Start */}
      <div className="container-fluid bg-dark px-5 d-none d-lg-block">
        <div className="row gx-0">
          <div className="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
            <div
              className="d-inline-flex align-items-center"
              style={{ height: 45 }}
            >
              <small className="me-3 text-light">
                <i className="fa fa-map-marker-alt me-2" />
                123 Street, New York, USA
              </small>
              <small className="me-3 text-light">
                <i className="fa fa-phone-alt me-2" />
                77 737 80 20 / 77 727 80 20
              </small>
              <small className="text-light">
                <i className="fa fa-envelope-open me-2" />
                @avocado_tur
              </small>
            </div>
          </div>
          <div className="col-lg-4 text-center text-lg-end">
            <div
              className="d-inline-flex align-items-center"
              style={{ height: 45 }}
            >
              <a
                className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2"
                to=""
              >
                <i className="fab fa-twitter fw-normal" />
              </a>
              <a
                className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2"
                to=""
              >
                <i className="fab fa-facebook-f fw-normal" />
              </a>
              <a
                className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2"
                to=""
              >
                <i className="fab fa-linkedin-in fw-normal" />
              </a>
              <a
                className="btn btn-sm btn-outline-light btn-sm-square rounded-circle me-2"
                to=""
              >
                <i className="fab fa-instagram fw-normal" />
              </a>
              <a
                className="btn btn-sm btn-outline-light btn-sm-square rounded-circle"
                to=""
              >
                <i className="fab fa-youtube fw-normal" />
              </a>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
      {/* Topbar End */}
      {/* Navbar & Hero Start */}
      <div className="container-fluid position-relative p-0">
        <nav className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
          <Link to="/" className="navbar-brand p-0">
            <h1 className="text-primary m-0">
              <i className="fa fa-map-marker-alt me-3" />
              Avocado Tour
            </h1>
            {/* <img src="img/logo.png" alt="Logo"> */}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="fa fa-bars" />
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto py-0">
              <Link to="/" className="nav-item nav-link">
                {t('nav.home')}
              </Link>
              <Link to="/About" className="nav-item nav-link">
                {t('nav.about')}
              </Link>
              <Link to="/Services" className="nav-item nav-link">
                {t('nav.services')}
              </Link>
              <Link to="/Packages" className="nav-item nav-link">
                {t('nav.packages')}
              </Link>
              <div className="nav-item dropdown">
                <Link
                  to="#"
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  {t('nav.pages')}
                </Link>
                <div className="dropdown-menu m-0">
                  <Link to="/Destination" className="dropdown-item">
                    Destination
                  </Link>
                  <Link to="/band-qilish" className="dropdown-item">
                    {t('nav.booking')}
                  </Link>
                  <Link to="/Team" className="dropdown-item">
                    Travel Guides
                  </Link>
                  <Link to="/Testimonial" className="dropdown-item">
                    Testimonial
                  </Link>
                  <Link to="/Error" className="dropdown-item">
                    404 Page
                  </Link>
                </div>
              </div>
              <Link to="/Contact" className="nav-item nav-link">
                {t('nav.contact')}
              </Link>
            </div>
            {isAuthenticated() ? (
              <div className="d-flex align-items-center gap-2">
                {user?.role === 'agent' && (
                  <Link to="/agent" className="btn btn-outline-primary rounded-pill py-2 px-4 shadow-sm" style={{ borderColor: '#30c39e', color: '#30c39e' }}>
                    Cabinet
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="btn btn-outline-primary rounded-pill py-2 px-4 shadow-sm" style={{ borderColor: '#30c39e', color: '#30c39e' }}>
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="btn btn-primary rounded-pill py-2 px-4 shadow-sm"
                >
                  {t('nav.logout') || 'Logout'}
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary rounded-pill py-2 px-4 shadow-sm">
                {t('nav.login') || 'Login / Register'}
              </Link>
            )}
          </div>
        </nav>
      </div>
      {/* Navbar & Hero End */}
    </div>
  )
}

export default Header