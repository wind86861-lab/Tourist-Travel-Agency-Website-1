import React, { useState, useEffect } from 'react';
import { toursAPI } from '../services/api';
import TourSearchForm from '../components/AdvancedSearch/TourSearchForm';
import B2BSearchResults from '../components/AdvancedSearch/B2BSearchResults';
import { useAuth } from '../context/AuthContext';

const Search = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('tours');
    const { user } = useAuth();

    const isAgent = user?.role === 'agent' || user?.role === 'admin';

    useEffect(() => {
        handleSearch({});
    }, []);

    const handleSearch = async (filters) => {
        setLoading(true);
        setError('');
        try {
            const data = await toursAPI.getAll();
            setResults(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch results');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'tours', label: 'Search Tour', icon: 'fa-map-marked-alt' },
        { id: 'hotels', label: 'Hotels', icon: 'fa-hotel' },
        { id: 'tickets', label: 'Tickets', icon: 'fa-ticket-alt' },
        { id: 'ranking', label: 'Agency Ranking', icon: 'fa-award' },
    ];

    return (
        <div className={`search-page ${isAgent ? 'bg-light min-vh-100' : ''}`}>
            {!isAgent && (
                <div className="container-fluid bg-primary py-5 mb-5 hero-header">
                    <div className="container py-5 text-center">
                        <h1 className="display-3 text-white animated slideInDown">Qidiruv</h1>
                        <p className="text-white opacity-75">Sizga mos sayohatlarni toping</p>
                    </div>
                </div>
            )}

            <div className={`${isAgent ? 'container-fluid py-3' : 'container py-5'}`}>
                {isAgent && (
                    <div className="search-tabs-container mb-0">
                        <ul className="nav nav-tabs border-0 gap-1">
                            {tabs.map(tab => (
                                <li className="nav-item" key={tab.id}>
                                    <button
                                        className={`nav-link border-0 rounded-top-4 px-4 py-3 fw-bold transition-all ${activeTab === tab.id ? 'active bg-white text-primary shadow-sm' : 'bg-light text-muted'}`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        <i className={`fa ${tab.icon} me-2`}></i>
                                        {tab.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="row justify-content-center">
                    <div className="col-12">
                        {activeTab === 'tours' ? (
                            <TourSearchForm onSearch={handleSearch} />
                        ) : (
                            <div className="bg-white p-5 rounded-4 shadow-sm text-center">
                                <i className={`fa ${tabs.find(t => t.id === activeTab)?.icon} fa-4x text-primary opacity-10 mb-4`}></i>
                                <h4>{tabs.find(t => t.id === activeTab)?.label} Service</h4>
                                <p className="text-muted">This specialized search module is currently under development.</p>
                            </div>
                        )}
                    </div>
                </div>

                {error && <div className="alert alert-danger mt-4 rounded-4 shadow-sm">{error}</div>}

                <div className="row mt-4">
                    <div className="col-12">
                        <B2BSearchResults results={results} loading={loading} />
                    </div>
                </div>
            </div>

            <style>{`
                .nav-tabs .nav-link.active {
                    color: #30c39e !important;
                    position: relative;
                }
                .nav-tabs .nav-link.active::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 20%;
                    right: 20%;
                    height: 3px;
                    background: #30c39e;
                    border-radius: 3px 3px 0 0;
                }
                .hero-header {
                    background: linear-gradient(rgba(20, 20, 31, .7), rgba(20, 20, 31, .7)), url(/assets/img/bg-hero.jpg);
                    background-position: center center;
                    background-repeat: no-repeat;
                    background-size: cover;
                }
                .rounded-top-4 { border-radius: 12px 12px 0 0 !important; }
            `}</style>
        </div>
    );
};

export default Search;
