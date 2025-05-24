import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="bg-gradient-to-br from-dearminder-purple to-dearminder-purple-darker rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to surprise your loved ones?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Start strengthening your relationships today with thoughtful, personalized reminders and wishes that show you care.
          </p>
          <Button className="bg-white text-dearminder-purple hover:bg-white/90 text-lg py-6 px-8 rounded-full inline-flex items-center gap-2">
            Get Started Now
            <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
