
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Define the new plan structure
const plans = [
  {
    id: 'free',
    title: "Free",
    price: "₹0",
    frequency: "/ forever",
    description: "Perfect for getting started",
    features: [
      "3 reminders per month",
      "1 free e-card",
      "Basic customization",
      "Email notifications",
    ],
    buttonText: "Get Started",
    buttonAction: () => navigate('/auth?mode=signup'),
    popular: false,
  },
  {
    id: 'premium',
    title: "Premium",
    price: "₹50",
    frequency: "/ per year",
    description: "Most popular for individuals",
    features: [
      "Unlimited reminders",
      "Unlimited wishes & e-cards",
      "Priority notifications",
      "WhatsApp & SMS integration",
      "Advanced AI personalization",
    ],
    buttonText: "Choose Premium",
    buttonAction: () => navigate('/subscription?plan=premium'),
    popular: true,
  }
];

export const PricingSection = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Need to redefine button actions here because hooks can only be called inside components
  const planActions = {
    free: () => navigate('/auth?mode=signup'),
    premium: () => navigate('/subscription?plan=premium'),
    business: () => navigate('/subscription?plan=business'), // Keeping placeholder for consistency
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-gradient-to-b from-white to-dearminder-blue/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-playfair">Find the Perfect Plan</h2>
        <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
          Choose the plan that fits your needs, from personal use to business solutions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`flex flex-col ${plan.popular ? 'border-dearminder-purple ring-2 ring-dearminder-purple shadow-lg' : 'border-gray-200'}`}
            >
              <CardHeader className="text-center">
                 {plan.popular && (
                   <div className="mb-2">
                     <span className="inline-block bg-dearminder-purple text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
                   </div>
                 )}
                <CardTitle className="text-2xl font-semibold">{plan.title}</CardTitle>
                <CardDescription className="mt-2">
                  <span className="text-4xl font-bold text-black">{plan.price}</span>
                  <span className="text-gray-500">{plan.frequency}</span>
                </CardDescription>
                <p className="text-sm text-gray-600 mt-3">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-grow space-y-3 pt-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardContent className="mt-auto">
                <Button 
                  className={`w-full rounded-full ${plan.popular ? 'bg-dearminder-purple hover:bg-dearminder-purple-dark' : 'bg-dearminder-blue hover:bg-dearminder-blue-dark'}`}
                  variant={plan.popular ? 'default' : 'default'} // Ensure solid background
                  onClick={planActions[plan.id as keyof typeof planActions]}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
