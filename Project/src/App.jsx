import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Statistics from './components/Statistics';
import TopRecruiters from './components/TopRecruiters';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
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
