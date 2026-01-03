import React from 'react';

const Dashboard = () => {
    const stats = [
        { label: 'Total Bookings', value: '1,280', icon: 'fa-shopping-cart', color: '#4e73df', grow: '+12%' },
        { label: 'Total Revenue', value: '$45,200', icon: 'fa-dollar-sign', color: '#1cc88a', grow: '+8%' },
        { label: 'Active Tours', value: '24', icon: 'fa-globe', color: '#36b9cc', grow: '+2%' },
        { label: 'New Reviews', value: '156', icon: 'fa-star', color: '#f6c23e', grow: '+5%' },
    ];

    const recentBookings = [
        { id: '#BK-9921', user: 'Anvar Toshmatov', tour: 'Samarqand Silk Road', date: 'Oct 12, 2023', status: 'Confirmed', amount: '$1,200' },
        { id: '#BK-9922', user: 'Malika Karimova', tour: 'Bukhara Old City', date: 'Oct 13, 2023', status: 'Pending', amount: '$850' },
        { id: '#BK-9923', user: 'Jasur Aliev', tour: 'Khiva Fortress', date: 'Oct 14, 2023', status: 'Cancelled', amount: '$500' },
        { id: '#BK-9924', user: 'Nigora Saidova', tour: 'Zamin Mountain', date: 'Oct 15, 2023', status: 'Confirmed', amount: '$1,100' },
        { id: '#BK-9925', user: 'Otabek Abdullaev', tour: 'Boysun Adventure', date: 'Oct 16, 2023', status: 'Pending', amount: '$720' },
    ];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0">Dashboard Overview</h3>
                <button className="btn btn-primary rounded-pill px-4 shadow-sm">
                    <i className="fa fa-download me-2"></i>Generate Report
                </button>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                {stats.map((stat, i) => (
                    <div key={i} className="col-md-3">
                        <div className="card border-0 shadow-sm p-3 rounded-4 bg-white hover-up transition-all">
                            <div className="d-flex align-items-center">
                                <div className="rounded-circle p-3 me-3" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                    <i className={`fa ${stat.icon} fs-4`}></i>
                                </div>
                                <div className="flex-grow-1">
                                    <span className="text-muted small fw-bold text-uppercase">{stat.label}</span>
                                    <h4 className="fw-bold m-0">{stat.value}</h4>
                                </div>
                                <div className="text-success small fw-bold">{stat.grow}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                {/* Chart Mockup */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold m-0 text-secondary">Sales Analytics</h5>
                            <select className="form-select form-select-sm border-light shadow-none" style={{ width: '120px' }}>
                                <option>This Month</option>
                                <option>Last Month</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        <div className="chart-placeholder bg-light rounded-4 d-flex align-items-center justify-content-center" style={{ height: '300px', border: '2px dashed #e9ecef' }}>
                            <div className="text-center">
                                <i className="fa fa-chart-area fs-1 text-muted opacity-25 mb-2"></i>
                                <p className="text-muted small">Chart visualization would be integrated here.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                        <h5 className="fw-bold mb-4 text-secondary">Service Status</h5>
                        <div className="d-grid gap-3">
                            <div className="d-flex align-items-center p-2 rounded-3 bg-light border">
                                <div className="bg-success rounded-circle me-3" style={{ width: '10px', height: '10px' }}></div>
                                <span className="small fw-bold">Booking API</span>
                                <span className="ms-auto text-success x-small fw-bold">Operational</span>
                            </div>
                            <div className="d-flex align-items-center p-2 rounded-3 bg-light border">
                                <div className="bg-success rounded-circle me-3" style={{ width: '10px', height: '10px' }}></div>
                                <span className="small fw-bold">Payment Gateway</span>
                                <span className="ms-auto text-success x-small fw-bold">Operational</span>
                            </div>
                            <div className="d-flex align-items-center p-2 rounded-3 bg-light border">
                                <div className="bg-warning rounded-circle me-3" style={{ width: '10px', height: '10px' }}></div>
                                <span className="small fw-bold">Email Service</span>
                                <span className="ms-auto text-warning x-small fw-bold">Slow</span>
                            </div>
                        </div>
                        <hr className="my-4" />
                        <h6 className="fw-bold mb-3 small text-muted">Admin System Log</h6>
                        <ul className="list-unstyled mb-0">
                            <li className="mb-2 x-small text-muted"><i className="fa fa-clock me-2"></i>New booking #BK-9925</li>
                            <li className="mb-2 x-small text-muted"><i className="fa fa-clock me-2"></i>Admin updated #Tour-01</li>
                            <li className="mb-0 x-small text-muted"><i className="fa fa-clock me-2"></i>User Nigora logged in</li>
                        </ul>
                    </div>
                </div>

                {/* Recent Bookings Table */}
                <div className="col-12">
                    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                        <h5 className="fw-bold mb-4 text-secondary">Recent Bookings</h5>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr className="small text-muted">
                                        <th>ID</th>
                                        <th>CUSTOMER</th>
                                        <th>TOUR</th>
                                        <th>DATE</th>
                                        <th>AMOUNT</th>
                                        <th>STATUS</th>
                                        <th className="text-end">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.map((bk, i) => (
                                        <tr key={i}>
                                            <td className="fw-bold small">{bk.id}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="rounded-circle bg-light p-2 me-2 x-small fw-bold text-primary">{bk.user.charAt(0)}</div>
                                                    <span className="small fw-medium">{bk.user}</span>
                                                </div>
                                            </td>
                                            <td className="small">{bk.tour}</td>
                                            <td className="small text-muted">{bk.date}</td>
                                            <td className="fw-bold small text-primary">{bk.amount}</td>
                                            <td>
                                                <span className={`badge rounded-pill x-small ${bk.status === 'Confirmed' ? 'bg-success-subtle text-success border border-success' : bk.status === 'Pending' ? 'bg-warning-subtle text-warning border border-warning' : 'bg-danger-subtle text-danger border border-danger'}`}>
                                                    {bk.status}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <button className="btn btn-sm btn-light rounded-circle shadow-none"><i className="fa fa-ellipsis-v"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .hover-up:hover {
                    transform: translateY(-5px);
                }
                .bg-success-subtle { background-color: #d1e7dd; }
                .bg-warning-subtle { background-color: #fff3cd; }
                .bg-danger-subtle { background-color: #f8d7da; }
            `}</style>
        </div>
    );
};

export default Dashboard;
