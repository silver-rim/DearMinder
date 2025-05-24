import React from 'react';
import { Briefcase, GraduationCap, Store, User } from 'lucide-react';

const AudienceSection = () => {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Uses DearMinder?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform helps people from all walks of life stay connected with those who matter most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-dearminder-purple/10 rounded-full flex items-center justify-center mb-5">
              <User className="h-10 w-10 text-dearminder-purple" />
            </div>
            <h3 className="text-xl font-bold mb-3">Individuals</h3>
            <p className="text-muted-foreground">
              Never miss important dates and send personalized wishes to your loved ones with our easy-to-use reminder system.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
