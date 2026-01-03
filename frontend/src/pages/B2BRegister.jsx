import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useTranslation } from 'react-i18next';

const B2BRegister = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        // Top level fields
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',

        // General Information
        officialName: '',
        latinName: '',
        headName: '',
        city: '',
        phone1: '',
        emailForMailings: '',
        comment: '',
        address: '',
        location: { lat: '', lng: '' },
        tin: '',
        registryNumber: '',
        activityType: '',
        vatRate: '',

        // Registration Certificate
        registrationCertificate: {
            authority: '',
            series: '',
            number: ''
        },

        // Banking Details
        bankingDetails: {
            zipCode: '',
            accountingPhone: '',
            registrationDate: '',
            accountNumber: '',
            ownershipForm: ''
        },

        // Connection
        postalAddress: '',
        actualAddress: '',
        subscribeToNewsletter: false,

        // Login Information
        loginInfo: {
            fullName: '',
            phone: '',
            email: '',
            login: '',
            city: ''
        },

        documents: []
    });

    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleChange = (e, section = null) => {
        const { id, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [id]: val
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [id]: val }));
        }
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const uploadDocuments = async () => {
        const uploadedUrls = [];
        for (const file of files) {
            const formDataFile = new FormData();
            formDataFile.append('document', file);

            const response = await fetch('http://localhost:5000/api/upload/document', {
                method: 'POST',
                body: formDataFile
            });

            if (!response.ok) throw new Error('Failed to upload document: ' + file.name);
            const data = await response.json();
            uploadedUrls.push(data.url);
        }
        return uploadedUrls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            // 1. Upload documents first
            const documentUrls = await uploadDocuments();

            // 2. Register user
            const registrationData = {
                ...formData,
                documents: documentUrls,
                role: 'agent',
                // Map top level email/name/phone from login info if empty
                email: formData.email || formData.loginInfo.email,
                name: formData.name || formData.loginInfo.fullName,
                phone: formData.phone || formData.loginInfo.phone
            };

            await authAPI.register(registrationData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 5000);
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container-xxl py-5">
                <div className="container text-center">
                    <div className="alert alert-success d-inline-block p-5 rounded shadow-lg">
                        <i className="fa fa-check-circle fa-4x mb-3 text-success"></i>
                        <h2>Registration Successful!</h2>
                        <p className="mb-2">Your application has been submitted and is pending administrator approval.</p>
                        <p className="mb-0">Redirecting to login in few seconds...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-xxl py-5 bg-light">
            <div className="container">
                <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                    <h6 className="section-title bg-white text-center text-primary px-3">B2B Partnership</h6>
                    <h1 className="mb-5">Detailed Business Registration</h1>
                </div>

                <form onSubmit={handleSubmit} className="row g-4">
                    {/* General Information */}
                    <div className="col-12 wow fadeInUp" data-wow-delay="0.1s">
                        <div className="bg-white p-4 rounded shadow-sm border-top border-primary border-5">
                            <h4 className="mb-4 text-primary">Общая информация</h4>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="officialName" placeholder="Official Name" value={formData.officialName} onChange={handleChange} required />
                                        <label htmlFor="officialName">Официальное название*</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="latinName" placeholder="Latin Name" value={formData.latinName} onChange={handleChange} />
                                        <label htmlFor="latinName">Название по-латински</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="headName" placeholder="Head Name" value={formData.headName} onChange={handleChange} required />
                                        <label htmlFor="headName">Фио руководителя*</label>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                                        <label htmlFor="city">Город*</label>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <input type="tel" className="form-control" id="phone1" placeholder="Phone 1" value={formData.phone1} onChange={handleChange} required />
                                        <label htmlFor="phone1">Телефон 1*</label>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <input type="email" className="form-control" id="emailForMailings" placeholder="Email" value={formData.emailForMailings} onChange={handleChange} required />
                                        <label htmlFor="emailForMailings">E-mail для рассылок*</label>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="tin" placeholder="TIN" value={formData.tin} onChange={handleChange} required />
                                        <label htmlFor="tin">ИНН / БИН*</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                                        <label htmlFor="address">Адрес*</label>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="registryNumber" placeholder="Registry Number" value={formData.registryNumber} onChange={handleChange} />
                                        <label htmlFor="registryNumber">Реестровый номер</label>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-floating">
                                        <select className="form-select" id="vatRate" value={formData.vatRate} onChange={handleChange}>
                                            <option value="">Select Rate</option>
                                            <option value="0%">0%</option>
                                            <option value="12%">12%</option>
                                            <option value="15%">15%</option>
                                            <option value="20%">20%</option>
                                        </select>
                                        <label htmlFor="vatRate">Ставка НДС</label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-floating">
                                        <textarea className="form-control" id="comment" placeholder="Comment" style={{ height: '80px' }} value={formData.comment} onChange={handleChange}></textarea>
                                        <label htmlFor="comment">Комментарий</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Certificate */}
                    <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.2s">
                        <div className="bg-white p-4 rounded shadow-sm border-top border-secondary border-5 h-100">
                            <h4 className="mb-4 text-secondary">Свидетельство о регистрации</h4>
                            <div className="row g-3">
                                <div className="col-12">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="authority" placeholder="Authority" value={formData.registrationCertificate.authority} onChange={(e) => handleChange(e, 'registrationCertificate')} />
                                        <label htmlFor="authority">Наименование регистрирующего органа</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="series" placeholder="Series" value={formData.registrationCertificate.series} onChange={(e) => handleChange(e, 'registrationCertificate')} />
                                        <label htmlFor="series">Серия</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="number" placeholder="Number" value={formData.registrationCertificate.number} onChange={(e) => handleChange(e, 'registrationCertificate')} />
                                        <label htmlFor="number">Номер</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Banking Details */}
                    <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
                        <div className="bg-white p-4 rounded shadow-sm border-top border-success border-5 h-100">
                            <h4 className="mb-4 text-success">Банковские реквизиты</h4>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="zipCode" placeholder="Zip" value={formData.bankingDetails.zipCode} onChange={(e) => handleChange(e, 'bankingDetails')} />
                                        <label htmlFor="zipCode">Почтовый индекс</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="tel" className="form-control" id="accountingPhone" placeholder="Phone" value={formData.bankingDetails.accountingPhone} onChange={(e) => handleChange(e, 'bankingDetails')} />
                                        <label htmlFor="accountingPhone">Телефон бухгалтерии</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="date" className="form-control" id="registrationDate" value={formData.bankingDetails.registrationDate} onChange={(e) => handleChange(e, 'bankingDetails')} />
                                        <label htmlFor="registrationDate">Дата регистрации</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="accountNumber" placeholder="Account" value={formData.bankingDetails.accountNumber} onChange={(e) => handleChange(e, 'bankingDetails')} />
                                        <label htmlFor="accountNumber">Расчетный счет</label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="ownershipForm" placeholder="Ownership" value={formData.bankingDetails.ownershipForm} onChange={(e) => handleChange(e, 'bankingDetails')} />
                                        <label htmlFor="ownershipForm">Форма собственности</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Login Information */}
                    <div className="col-12 wow fadeInUp" data-wow-delay="0.4s">
                        <div className="bg-white p-4 rounded shadow-sm border-top border-info border-5">
                            <h4 className="mb-4 text-info">Информация по логину (Account Details)</h4>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="fullName" placeholder="Full Name" value={formData.loginInfo.fullName} onChange={(e) => handleChange(e, 'loginInfo')} required />
                                        <label htmlFor="fullName">ФИО*</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-floating">
                                        <input type="tel" className="form-control" id="phone" placeholder="Phone" value={formData.loginInfo.phone} onChange={(e) => handleChange(e, 'loginInfo')} required />
                                        <label htmlFor="phone">Телефон*</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-floating">
                                        <input type="email" className="form-control" id="email" placeholder="Email" value={formData.loginInfo.email} onChange={(e) => handleChange(e, 'loginInfo')} required />
                                        <label htmlFor="email">E-mail*</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="login" placeholder="Username" value={formData.loginInfo.login} onChange={(e) => handleChange(e, 'loginInfo')} required />
                                        <label htmlFor="login">Логин (Username)*</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="city" placeholder="City" value={formData.loginInfo.city} onChange={(e) => handleChange(e, 'loginInfo')} />
                                        <label htmlFor="city">Город</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="password" name="password" className="form-control" id="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                                        <label htmlFor="password">Пароль (Password)*</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="password" name="confirmPassword" className="form-control" id="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                                        <label htmlFor="confirmPassword">Повторите пароль*</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Document Uploads */}
                    <div className="col-12 wow fadeInUp" data-wow-delay="0.5s">
                        <div className="bg-white p-4 rounded shadow-sm border-top border-dark border-5">
                            <h4 className="mb-4 text-dark">Документы для загрузки</h4>
                            <div className="mb-3">
                                <label htmlFor="documents" className="form-label">Прикрепите необходимые файлы (Images, PDF, Word)</label>
                                <input className="form-control" type="file" id="documents" multiple onChange={handleFileChange} />
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="subscribeToNewsletter" checked={formData.subscribeToNewsletter} onChange={handleChange} />
                                <label className="form-check-label" htmlFor="subscribeToNewsletter">
                                    Подписаться на рассылку
                                </label>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="col-12">
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        </div>
                    )}

                    <div className="col-12 text-center">
                        <button className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Processing...
                                </>
                            ) : 'Отправить на регистрацию'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default B2BRegister;
