import React from 'react';
import { Bell, MessageSquareText, GitMerge, PiggyBank } from 'lucide-react';

const features = [
  {
    icon: <Bell className="h-10 w-10 text-dearminder-purple" />,
    title: "Smart Reminders",
    description: "Never forget important dates with timely alerts via WhatsApp, Email, or SMS, customized to your preferences."
  },
  {
    icon: <MessageSquareText className="h-10 w-10 text-dearminder-purple" />,
    title: "AI-Powered Personalization",
    description: "Send heartfelt wishes with our AI that crafts personalized messages and beautiful e-cards for any occasion."
  },
  {
    icon: <GitMerge className="h-10 w-10 text-dearminder-purple" />,
    title: "Multi-Channel Integration",
    description: "Seamlessly connect with popular platforms to ensure your wishes reach loved ones through their preferred channels."
  },
  {
    icon: <PiggyBank className="h-10 w-10 text-dearminder-purple" />,
    title: "Affordable Plans",
    description: "Choose from flexible subscription options designed to fit your needs, including a generous free tier to get started."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Thoughtful Features for <span className="text-dearminder-purple">Meaningful</span> Connections
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            DearMinder combines smart technology with human touch to help you maintain the relationships that matter most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 card-hover"
            >
              <div className="h-16 w-16 rounded-xl bg-dearminder-purple/10 flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
