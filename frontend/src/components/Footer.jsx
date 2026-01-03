import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation();
  return (
    <div>
      {/* Footer Start */}
      <div
        className="container-fluid bg-dark text-light footer pt-5 mt-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-3">{t('footer.company')}</h4>
              <a className="btn btn-link" href="/">
                {t('footer.about')}
              </a>
              <a className="btn btn-link" href="/">
                {t('footer.contact')}
              </a>
              <a className="btn btn-link" href="/">
                {t('footer.privacy')}
              </a>
              <a className="btn btn-link" href="/">
                {t('footer.terms')}
              </a>
              <a className="btn btn-link" href="/">
                {t('footer.help')}
              </a>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-3">{t('footer.contact_info')}</h4>
              <p className="mb-2">
                <i className="fa fa-map-marker-alt me-3" />
                123 Street, New York, USA
              </p>
              <p className="mb-2">
                <i className="fa fa-phone-alt me-3" />
                <i className="fa fa-phone-alt me-3" />
                77 737 80 20 / 77 727 80 20
              </p>
              <p className="mb-2">
                <i className="fa fa-envelope me-3" />
                @avocado_tur
              </p>
              <div className="d-flex pt-2">
                <a className="btn btn-outline-light btn-social" href="/">
                  <i className="fab fa-twitter" />
                </a>
                <a className="btn btn-outline-light btn-social" href="/">
                  <i className="fab fa-facebook-f" />
                </a>
                <a className="btn btn-outline-light btn-social" href="">
                  <i className="fab fa-youtube" />
                </a>
                <a className="btn btn-outline-light btn-social" href="">
                  <i className="fab fa-linkedin-in" />
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-3">{t('footer.gallery')}</h4>
              <div className="row g-2 pt-2">
                <div className="col-4">
                  <img
                    className="img-fluid bg-light p-1"
                    src="assets/img/package-1.jpg"
                    alt=""
                  />
                </div>
                <div className="col-4">
                  <img
                    className="img-fluid bg-light p-1"
                    src="assets/img/package-2.jpg"
                    alt=""
                  />
                </div>
                <div className="col-4">
                  <img
                    className="img-fluid bg-light p-1"
                    src="assets/img/package-3.jpg"
                    alt=""
                  />
                </div>
                <div className="col-4">
                  <img
                    className="img-fluid bg-light p-1"
                    src="assets/img/package-2.jpg"
                    alt=""
                  />
                </div>
                <div className="col-4">
                  <img
                    className="img-fluid bg-light p-1"
                    src="assets/img/package-3.jpg"
                    alt=""
                  />
                </div>
                <div className="col-4">
                  <img
                    className="img-fluid bg-light p-1"
                    src="assets/img/package-1.jpg"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-3">{t('footer.newsletter')}</h4>
              <p>Dolor amet sit justo amet elitr clita ipsum elitr est.</p>
              <div
                className="position-relative mx-auto"
                style={{ maxWidth: 400 }}
              >
                <input
                  className="form-control border-primary w-100 py-3 ps-4 pe-5"
                  type="text"
                  placeholder={t('footer.newsletter_placeholder')}
                />
                <button
                  type="button"
                  className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2"
                >
                  {t('footer.subscribe')}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="copyright">
            <div className="row">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                ©{" "}
                <a className="border-bottom" href="#">
                  Avocado Tour
                </a>
                , All Right Reserved.
                Designed By{" "}
                <a className="border-bottom" href="https://github.com/ParasSalunke">
                  Paras Salunke
                </a>
              </div>
              <div className="col-md-6 text-center text-md-end">
                <div className="footer-menu">
                  <a href="/">{t('nav.home')}</a>
                  <a href="/">Cookies</a>
                  <a href="/">{t('footer.help')}</a>
                  <a href="/">FAQ</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}
    </div>
  )
}
