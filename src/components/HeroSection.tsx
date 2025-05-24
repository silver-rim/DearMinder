
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Mail, Phone, Calendar, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-dearminder-purple/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-24 left-10 w-64 h-64 bg-dearminder-blue-light/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-40 left-1/3 w-6 h-6 bg-dearminder-purple rounded-full opacity-30"></div>
      <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-dearminder-blue rounded-full"></div>
      <div className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-dearminder-purple/60 rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left text content */}
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Never Miss a <span className="text-dearminder-purple">Special</span> Moment Again
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Celebrate life's special days with smart reminders and AI-generated wishes that feel thoughtful and personal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button 
                className="btn-primary text-lg py-6 px-8 rounded-full bg-dearminder-purple hover:bg-dearminder-purple-dark"
                onClick={() => navigate('/auth')}
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                className="text-lg py-6 px-8 rounded-full group"
                onClick={() => {
                  const featuresSection = document.querySelector('#features');
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                See How It Works
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="pt-6 flex flex-wrap justify-center lg:justify-start gap-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2 text-dearminder-purple" /> Email
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2 text-dearminder-purple" /> WhatsApp & SMS
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2 text-dearminder-purple" /> Calendar
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Heart className="h-4 w-4 mr-2 text-dearminder-purple" /> Personalized
              </div>
            </div>
          </div>
          
          {/* Right illustration */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main phone illustration */}
              <div className="bg-white rounded-3xl shadow-xl p-3 w-72 md:w-80 border-8 border-white">
                <div className="bg-dearminder-purple/10 rounded-2xl p-4">
                  <div className="bg-white rounded-xl shadow-sm p-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-dearminder-purple/20 flex items-center justify-center text-dearminder-purple">
                        🎂
                      </div>
                      <div>
                        <h3 className="font-medium">Mom's Birthday</h3>
                        <p className="text-xs text-gray-500">Tomorrow, May 15th</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-dearminder-blue-light flex items-center justify-center text-dearminder-blue">
                        💍
                      </div>
                      <div>
                        <h3 className="font-medium">Wedding Anniversary</h3>
                        <p className="text-xs text-gray-500">In 3 days, May 18th</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-dearminder-purple/10 flex items-center justify-center">
                        🎓
                      </div>
                      <div>
                        <h3 className="font-medium">Graduation Day</h3>
                        <p className="text-xs text-gray-500">Next week, May 22nd</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <div className="w-1/2 h-1 bg-white/50 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Floating notification */}
              <div className="absolute -right-12 top-10 bg-white rounded-xl shadow-lg p-3 animate-pulse w-48 border border-dearminder-purple/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-dearminder-purple/20 flex items-center justify-center">
                    ✉️
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Wish Ready!</p>
                    <p className="text-xs text-gray-500">For Mom's Birthday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
