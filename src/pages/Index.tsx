import React, { useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import { PricingSection } from '@/components/PricingSection';
import AudienceSection from '@/components/AudienceSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  // Don't render the landing page if loading or if user exists (avoids flash)
  if (loading || user) {
    return null; 
  }

  return (
    <div className="min-h-screen">
      {/* Navbar is rendered in App.tsx */}
      <HeroSection />
      <FeaturesSection />
      <PricingSection /> 
      <AudienceSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
