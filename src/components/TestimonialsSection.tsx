
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

const testimonials = [
  {
    quote: "DearMinder has saved my relationships! I'm terrible with dates but now I never miss an important occasion.",
    name: "Priya S.",
    title: "Marketing Manager"
  },
  {
    quote: "The AI-generated wishes are surprisingly personal and heartfelt. My family thinks I've become much more thoughtful!",
    name: "Raj K.",
    title: "Software Engineer"
  },
  {
    quote: "As a business owner, this helps me maintain relationships with clients. The personal touch has increased our customer loyalty.",
    name: "Neha T.",
    title: "Boutique Owner"
  }
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="section-padding bg-gradient-to-br from-dearminder-purple/5 to-dearminder-blue-light/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover how DearMinder is helping people strengthen their connections.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-md bg-white">
              <CardContent className="pt-6">
                <div className="mb-4 text-dearminder-purple">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
                <p className="mb-6 italic text-gray-700">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-dearminder-gray-light rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-dearminder-gray" />
                  </div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
