import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Statistics from './components/Statistics';
import TopRecruiters from './components/TopRecruiters';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VerifyOTP from './components/auth/VerifyOTP';
import VerifySuccess from './components/auth/VerifySuccess';
import ForgotPassword from './components/auth/ForgotPassword';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Student Dashboard
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import ProfileSetup from './components/dashboard/ProfileSetup';
import ProfilePage from './components/dashboard/ProfilePage';
import JobsPage from './components/dashboard/JobsPage';
import ApplicationsPage from './components/dashboard/ApplicationsPage';
import InterviewsPage from './components/dashboard/InterviewsPage';
import PracticeTestsPage from './components/dashboard/PracticeTestsPage';
import NotificationsPage from './components/dashboard/NotificationsPage';
import MessagesPage from './components/dashboard/MessagesPage';
import SettingsPage from './components/dashboard/SettingsPage';
import AnalyticsPage from './components/dashboard/AnalyticsPage';

// Company Dashboard
import { CompanyLayout } from './components/company/CompanyLayout';
import CompanyHome from './components/company/CompanyHome';
import CompanyPostJob from './components/company/CompanyPostJob';
import CompanyApplicants from './components/company/CompanyApplicants';
import CompanyInterviews from './components/company/CompanyInterviews';
import CompanyProfile from './components/company/CompanyProfile';

// Admin Dashboard
import { AdminLayout } from './components/admin/AdminLayout';
import AdminHome from './components/admin/AdminHome';
import AdminCompanies from './components/admin/AdminCompanies';
import AdminStudents from './components/admin/AdminStudents';
import AdminJobs from './components/admin/AdminJobs';
import AdminAnalytics from './components/admin/AdminAnalytics';
import AdminAnnouncements from './components/admin/AdminAnnouncements';
import AdminReports from './components/admin/AdminReports';

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Statistics />
      <TopRecruiters />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/verify-success" element={<VerifySuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile-setup" element={<ProtectedRoute role="student"><ProfileSetup /></ProtectedRoute>} />

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute role="student"><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="interviews" element={<InterviewsPage />} />
          <Route path="practice-tests" element={<PracticeTestsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        {/* Company Routes */}
        <Route path="/company" element={<ProtectedRoute role="company"><CompanyLayout /></ProtectedRoute>}>
          <Route index element={<CompanyHome />} />
          <Route path="post-job" element={<CompanyPostJob />} />
          <Route path="applicants" element={<CompanyApplicants />} />
          <Route path="interviews" element={<CompanyInterviews />} />
          <Route path="profile" element={<CompanyProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminHome />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
