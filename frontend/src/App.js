import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Footer from './components/Footer'
import AirplaneCursor from './components/AirplaneCursor/AirplaneCursor'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Packages from './pages/Packages'
import Destination from './pages/Destination'
import Booking from './pages/Booking'
import BandQilish from './pages/BandQilish'
import Team from './pages/Team'
import Testimonial from './pages/Testimonial'
import Error from './pages/Error'
import Contact from './pages/Contact'
import Search from './pages/Search'
import TourDetails from './pages/TourDetails'
import Login from './pages/Login'
import B2BRegister from './pages/B2BRegister'
import AdminLayout from './components/Admin/AdminLayout'
import AdminLogin from './pages/Admin/AdminLogin'
import Dashboard from './pages/Admin/Dashboard'
import ManageTours from './pages/Admin/ManageTours'
import CreateTour from './pages/Admin/CreateTour'
import B2BCreateTour from './pages/Admin/B2BCreateTour'
import ConfirmRegistrations from './pages/Admin/ConfirmRegistrations'
import SiteSettings from './pages/Admin/SiteSettings'
import TourCalendar from './pages/Admin/TourCalendar'
import PendingApproval from './pages/PendingApproval'
import AgentLayout from './components/Agent/AgentLayout'
import AgentDashboard from './pages/Agent/AgentDashboard'
import AgentHistory from './pages/Agent/AgentHistory'
import AgentSearch from './pages/Agent/AgentSearch'

function AppContent() {
  const location = useLocation();
  const isDashboardPath = location.pathname.startsWith('/admin') || location.pathname.startsWith('/agent');

  useEffect(() => {
    const images = [
      'url(/assets/img/bg-hero.jpg)',
      'url(/assets/img/destination-1.jpg)',
      'url(/assets/img/destination-2.jpg)',
      'url(/assets/img/booking.jpg)',
      'url(/assets/img/package-3.jpg)'
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % images.length;
      document.documentElement.style.setProperty('--hero-bg', images[index]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <AirplaneCursor />
      {!isDashboardPath && <Header />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/services' element={<Services />} />
        <Route path='/packages' element={<Packages />} />
        <Route path='/destination' element={<Destination />} />
        <Route path='/booking' element={<Booking />} />
        <Route path='/band-qilish' element={<BandQilish />} />
        <Route path='/team' element={<Team />} />
        <Route path='/testimonial' element={<Testimonial />} />
        <Route path='/error' element={<Error />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/search' element={<Search />} />
        <Route path='/tour/:id' element={<TourDetails />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register-b2b' element={<B2BRegister />} />
        <Route path='/pending-approval' element={<PendingApproval />} />

        {/* Admin Login (Public) */}
        <Route path='/admin/login' element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path='/admin' element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path='bookings' element={<Dashboard />} />
          <Route path='calendar' element={<TourCalendar />} />
          <Route path='tours' element={<ManageTours />} />
          <Route path='tours/create' element={<CreateTour />} />
          <Route path='tours/create-b2b' element={<B2BCreateTour />} />
          <Route path='tours/edit/:id' element={<CreateTour />} />
          <Route path='confirmations' element={<ConfirmRegistrations />} />
          <Route path='settings' element={<SiteSettings />} />
        </Route>

        {/* Protected Agent Routes */}
        <Route path='/agent' element={
          <ProtectedRoute>
            <AgentLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AgentDashboard />} />
          <Route path='search/tours' element={<Search />} />
          <Route path='history' element={<AgentHistory />} />
        </Route>
      </Routes>
      {!isDashboardPath && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
