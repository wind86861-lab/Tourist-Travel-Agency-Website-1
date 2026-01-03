import React, { useState } from 'react';

const TourCalendar = () => {
    const [viewMode, setViewMode] = useState('Week');
    const [selectedDate, setSelectedDate] = useState(new Date());

    const days = [
        { name: 'Sun', date: 14 },
        { name: 'Mon', date: 15 },
        { name: 'Tue', date: 16 },
        { name: 'Wed', date: 17, current: true },
        { name: 'Thu', date: 18 },
        { name: 'Fri', date: 19 },
        { name: 'Sat', date: 20 },
    ];

    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    const events = [
        { id: 1, title: 'Istanbul Magic Arrival', start: '10:00', end: '11:30', day: 15, color: '#e3f2fd', border: '#2196f3' },
        { id: 2, title: 'B2B: Agency Briefing', start: '12:00', end: '13:30', day: 17, color: '#f1f8e9', border: '#4caf50' },
        { id: 3, title: 'Antalya Group Departure', start: '14:00', end: '16:00', day: 16, color: '#fff3e0', border: '#ff9800' },
        { id: 4, title: 'Samarkand City Tour', start: '09:00', end: '12:00', day: 18, color: '#f3e5f5', border: '#9c27b0' },
    ];

    return (
        <div className="calendar-notion-container d-flex bg-white rounded-4 shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>

            {/* LEFT PANEL: Navigator & Calendars */}
            <div className="left-panel border-end p-3 d-flex flex-column" style={{ width: '220px', backgroundColor: '#fbfbfb' }}>
                <div className="mini-calendar mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2 px-1">
                        <span className="fw-bold small">January 2024</span>
                        <div className="d-flex gap-1">
                            <i className="fa fa-chevron-left x-small cursor-pointer text-muted"></i>
                            <i className="fa fa-chevron-right x-small cursor-pointer text-muted"></i>
                        </div>
                    </div>
                    <div className="grid-mini-days d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-center x-small text-muted fw-bold">{d}</div>)}
                        {Array.from({ length: 31 }).map((_, i) => (
                            <div key={i} className={`text-center x-small py-1 rounded-circle cursor-pointer ${i + 1 === 17 ? 'bg-danger text-white' : 'hover-bg-light'}`}>
                                {i + 1}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="calendar-types mt-2">
                    <h6 className="x-small fw-bold text-muted text-uppercase mb-3">Calendars</h6>
                    <div className="d-flex flex-column gap-2">
                        <div className="d-flex align-items-center gap-2 x-small fw-medium cursor-pointer p-1 rounded hover-bg-light">
                            <div className="rounded-circle bg-primary" style={{ width: '8px', height: '8px' }}></div>
                            <span>B2C Tours</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 x-small fw-medium cursor-pointer p-1 rounded hover-bg-light">
                            <div className="rounded-circle bg-success" style={{ width: '8px', height: '8px' }}></div>
                            <span>B2B Agencies</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 x-small fw-medium cursor-pointer p-1 rounded hover-bg-light">
                            <div className="rounded-circle bg-warning" style={{ width: '8px', height: '8px' }}></div>
                            <span>Personal</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-3 border-top">
                    <button className="btn btn-sm btn-outline-secondary w-100 rounded-pill x-small">+ Add Account</button>
                    <p className="x-small text-muted mt-3 mb-0 text-center">Stephanie's Notion</p>
                </div>
            </div>

            {/* CENTER PANEL: Main Grid */}
            <div className="center-panel flex-grow-1 d-flex flex-column overflow-hidden">
                {/* Header */}
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white sticky-top" style={{ zIndex: 100 }}>
                    <div className="d-flex align-items-center gap-3">
                        <h4 className="fw-bold m-0 mt-1">January 2024</h4>
                        <div className="btn-group shadow-none border rounded-pill overflow-hidden">
                            <button className="btn btn-sm btn-light px-3 py-1 x-small fw-bold">Month</button>
                            <button className="btn btn-sm btn-white border-start px-3 py-1 x-small fw-bold bg-light">Week</button>
                            <button className="btn btn-sm btn-white border-start px-3 py-1 x-small fw-bold">Today</button>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-light rounded-circle shadow-none"><i className="fa fa-chevron-left x-small"></i></button>
                        <button className="btn btn-sm btn-light rounded-circle shadow-none"><i className="fa fa-chevron-right x-small"></i></button>
                    </div>
                </div>

                {/* Grid Header (Days) */}
                <div className="flex-grow-1 d-flex flex-column overflow-auto">
                    <div className="row g-0 border-bottom sticky-top bg-white" style={{ zIndex: 90 }}>
                        <div className="col-auto border-end" style={{ width: '60px' }}></div>
                        {days.map(day => (
                            <div key={day.name} className="col text-center py-2 border-end border-bottom-0">
                                <span className="d-block x-small text-muted fw-bold mb-1">{day.name.toUpperCase()}</span>
                                <span className={`d-inline-block fw-bold fs-5 rounded-circle px-2 py-1 ${day.current ? 'bg-danger text-white' : ''}`}>
                                    {day.date}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Time Grid */}
                    <div className="time-grid-body position-relative">
                        {hours.map(hour => (
                            <div key={hour} className="row g-0 border-bottom" style={{ height: '60px' }}>
                                <div className="col-auto border-end text-end px-2 py-1 text-muted x-small" style={{ width: '60px' }}>
                                    {hour % 12 || 12} {hour >= 12 ? 'PM' : 'AM'}
                                </div>
                                {days.map(day => (
                                    <div key={day.name} className="col border-end position-relative">
                                        {/* Render Events */}
                                        {events.map(event => {
                                            if (event.day === day.date && parseInt(event.start) === hour) {
                                                const startMins = parseInt(event.start.split(':')[1]) || 0;
                                                const endMins = (parseInt(event.end.split(':')[0]) - parseInt(event.start.split(':')[0])) * 60 + (parseInt(event.end.split(':')[1]) || 0);
                                                return (
                                                    <div key={event.id}
                                                        className="event-node p-2 rounded shadow-sm border-start border-3 transition-scale"
                                                        style={{
                                                            position: 'absolute',
                                                            top: `${(startMins / 60) * 100}%`,
                                                            height: `${(endMins / 60) * 100}%`,
                                                            width: '90%',
                                                            left: '5%',
                                                            backgroundColor: event.color,
                                                            borderColor: event.border,
                                                            zIndex: 10
                                                        }}>
                                                        <span className="d-block fw-bold x-small truncate" style={{ color: event.border }}>{event.title}</span>
                                                        <span className="x-small text-muted opacity-75">{event.start}-{event.end}</span>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Details/Actions */}
            <div className="right-panel border-start p-3 bg-white" style={{ width: '250px' }}>
                <div className="search-box mb-4 position-relative">
                    <i className="fa fa-search position-absolute text-muted x-small" style={{ top: '10px', left: '12px' }}></i>
                    <input type="text" className="form-control form-control-sm border-0 bg-light rounded-3 shadow-none ps-4" placeholder="Search" />
                </div>

                <div className="section mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="x-small fw-bold text-muted m-0">Calendar</h6>
                        <i className="fa fa-ellipsis-h text-muted x-small"></i>
                    </div>
                    <p className="x-small fw-medium mb-1">Personal</p>
                    <p className="x-small text-muted mb-3">Manage your tour schedule</p>

                    <div className="form-check form-switch mb-2">
                        <input className="form-check-input" type="checkbox" checked readOnly />
                        <label className="form-check-label x-small">Events included in menu bar</label>
                    </div>
                    <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" readOnly />
                        <label className="form-check-label x-small">Event blocking on 1 calendar</label>
                    </div>
                </div>

                <div className="section mt-4 pt-4 border-top">
                    <div className="d-flex align-items-center gap-2 x-small text-muted cursor-pointer hover-text-primary">
                        <i className="fa fa-share-square"></i>
                        <span>Settings and sharing</span>
                    </div>
                </div>

                {/* Auto-blocking Alert Mock */}
                <div className="alert-mini p-3 bg-white border shadow rounded-3 mt-5 position-relative">
                    <div className="d-flex align-items-start gap-2">
                        <i className="fa fa-info-circle text-primary mt-1"></i>
                        <div className="pe-3">
                            <h6 className="x-small fw-bold m-0">Auto-blocking active</h6>
                            <p className="xx-small text-muted mb-0 mt-1">Global tours are synced with local guides.</p>
                        </div>
                    </div>
                    <i className="fa fa-times position-absolute x-small text-muted cursor-pointer" style={{ top: '10px', right: '10px' }}></i>
                </div>
            </div>

            <style>{`
                .calendar-notion-container {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                .x-small { font-size: 11px; }
                .xx-small { font-size: 10px; }
                .hover-bg-light:hover { background-color: #f0f0f0; }
                .hover-text-primary:hover { color: #30c39e !important; }
                .cursor-pointer { cursor: pointer; }
                .truncate {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .transition-scale {
                    transition: transform 0.2s;
                    cursor: pointer;
                }
                .transition-scale:hover {
                    transform: scale(1.02);
                }
                .event-node {
                    border-radius: 4px !important;
                }
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-thumb {
                    background: #eee;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default TourCalendar;
