import React, { useState } from 'react';
import TourSearchForm from './TourSearchForm';
import './AdvancedSearch.css';

const AdvancedSearch = () => {
    const [activeTab, setActiveTab] = useState('tours');

    return (
        <div className="advanced-search-container">
            <div className="search-tabs">
                <button
                    className={`search-tab ${activeTab === 'tours' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tours')}
                >
                    <span>🏨</span> Tours
                </button>
                <button
                    className={`search-tab ${activeTab === 'flights' ? 'active' : ''}`}
                    onClick={() => setActiveTab('flights')}
                >
                    <span>✈️</span> Flights
                </button>
                <button
                    className={`search-tab ${activeTab === 'hotels' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hotels')}
                >
                    <span>🏖️</span> Hotels
                </button>
                <button
                    className={`search-tab ${activeTab === 'cruises' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cruises')}
                >
                    <span>🚢</span> Cruises
                </button>
            </div>

            <div className="search-panel">
                {activeTab === 'tours' && <TourSearchForm />}
                {activeTab === 'flights' && <div className="p-5 text-center text-muted">Flight Search Coming Soon</div>}
                {activeTab === 'hotels' && <div className="p-5 text-center text-muted">Hotel Search Coming Soon</div>}
                {activeTab === 'cruises' && <div className="p-5 text-center text-muted">Cruise Search Coming Soon</div>}
            </div>
        </div>
    );
};

export default AdvancedSearch;
