import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom'; // Import useLocation

// Define the structure for a pricing plan
interface Plan {
  id: string;
  title: string;
  yearlyPrice?: number; // Only yearly price now
  features: string[];
}

// Updated plans with new structure and yearly pricing in INR
const subscriptionPlans: Plan[] = [
  {
    id: 'free',
    title: 'Free',
    features: [
      "3 reminders per month",
      "1 free e-card",
      "Basic customization",
      "Email notifications",
    ],
  },
  {
    id: 'premium',
    title: 'Premium',
    yearlyPrice: 50,
    features: [
      "Unlimited reminders",
      "Unlimited wishes & e-cards",
      "Priority notifications",
      "WhatsApp & SMS integration",
      "Advanced AI personalization",
    ],
  }
];


const SubscriptionPage = () => {
  const { user } = useAuth();
  const location = useLocation(); // Get location to read query params
  const queryParams = new URLSearchParams(location.search);
  const initialPlan = queryParams.get('plan'); // Get pre-selected plan from URL

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(initialPlan);
  const [loading, setLoading] = useState(false);

  // If URL specifies a plan, set it initially
  useEffect(() => {
    const planFromUrl = queryParams.get('plan');
    if (planFromUrl && subscriptionPlans.some(p => p.id === planFromUrl && p.id !== 'free')) {
      setSelectedPlanId(planFromUrl);
    }
  }, [location.search]);

  const handlePayment = async () => {
    if (!selectedPlanId || !user || selectedPlanId === 'free') {
      toast({ title: 'Error', description: 'Please select a valid plan (Premium) and ensure you are logged in.', variant: 'destructive' });
      return;
    }

    const selectedPlan = subscriptionPlans.find(p => p.id === selectedPlanId);
    if (!selectedPlan || selectedPlan.yearlyPrice === undefined) {
       toast({ title: 'Error', description: 'Selected plan details not found or invalid.', variant: 'destructive' });
       return;
    }

    setLoading(true);

    const amount = selectedPlan.yearlyPrice;
    const currency = 'INR'; // Set currency to INR
    // IMPORTANT: Use your actual Razorpay Test Key ID from .env
    const razorpayKeyId = "rzp_test_9ggOKsPYIeTZxB";
    if (!razorpayKeyId) {
        console.error("Razorpay Key ID not found in environment variables.");
        toast({ title: 'Configuration Error', description: 'Razorpay Key ID is missing.', variant: 'destructive' });
        setLoading(false);
        return;
    }


    try {
      // --- Step 1: Call backend to create Razorpay Order --- (COMMENTED OUT FOR FRONTEND ONLY TEST)
      // ... (backend order creation code remains commented out) ...
      // --- End of Commented Out Backend Order Creation ---


      // --- Step 2: Open Razorpay Checkout ---
      const options = {
        key: razorpayKeyId, // Use the Test Key ID from .env
        amount: amount * 100, // Amount in paisa (e.g., 5000 for ₹50, 25000 for ₹250)
        currency: currency,
        name: "DearMinder Subscription",
        description: `${selectedPlan.title} - Yearly Plan (Test)`,
        // order_id: order_id, // Remove order_id for client-side only initiation
        handler: async function (response: any){
          // setLoading(true); // No need to set loading true here, it's already true
          console.log('Razorpay Response:', response); // Log the response for testing

          // --- Step 3: Verify Payment on Backend --- (COMMENTED OUT FOR FRONTEND ONLY TEST)
          // Verification is skipped in this frontend-only test setup.
          // ... (backend verification code remains commented out) ...
          // --- End of Commented Out Backend Verification ---

          // Directly treat payment as successful for testing purposes
          toast({ title: 'Payment Successful! (Test - Not Verified)', description: `Subscribed to ${selectedPlan.title} (Yearly)!` });
          // TODO: Add logic to update user's subscription state in AuthContext or redirect
          setLoading(false); // Set loading false after handling success

        },
        prefill: {
            name: user.user_metadata?.full_name || "Test User", // Added default for testing
            email: user.email || "test@example.com", // Added default for testing
            // contact: "9999999999" // Optional: Prefill contact number
        },
        notes: {
            planId: selectedPlanId,
            frequency: 'yearly',
            userId: user.id || 'test-user-id' // Added default for testing
        },
        theme: {
            color: "#6366F1" // Example theme color (Indigo)
        },
        // --- Add modal.ondismiss handler ---
        modal: {
            ondismiss: function() {
                console.log('Checkout form closed by user.');
                setLoading(false); // Reset loading state if modal is dismissed
            }
        }
      };

      // Check if Razorpay is loaded
      if (!(window as any).Razorpay) {
          console.error("Razorpay SDK not loaded. Ensure the script tag is in index.html.");
          throw new Error("Razorpay SDK not loaded. Ensure the script tag is in index.html.");
      }

      const rzp = new (window as any).Razorpay(options);

      rzp.on('payment.failed', function (response: any){
              console.error('Razorpay Payment Failed:', response.error);
              toast({
                  title: 'Payment Failed',
                  description: `${response.error.description || 'Payment could not be processed.'} (Code: ${response.error.code || 'N/A'})`,
                  variant: 'destructive'
              });
              setLoading(false); // Reset loading state on failure
      });

      rzp.open();
      // Note: Do not set loading to false here, wait for handler, failure or dismiss callback

    } catch (error: any) {
      console.error("Payment Initiation Error:", error); 
      toast({ title: 'Error Initializing Payment', description: error.message || 'Could not initiate payment. Check console for details.', variant: 'destructive' });
      setLoading(false); // Also set loading false if initialization fails
    }
  };


  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-4">Choose Your Plan</h1>
      <p className="text-center text-gray-600 mb-8">Select the yearly plan that best suits your needs.</p>

      {/* Remove Frequency Toggle as only yearly plans are paid */}

      <RadioGroup value={selectedPlanId ?? ""} onValueChange={setSelectedPlanId}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {subscriptionPlans.map((plan) => {
            const price = plan.yearlyPrice;
            // Using Unicode escape for Rupee symbol
            const displayPrice = plan.id === 'free' ? '\u20B90' : (price !== undefined ? '\u20B9' + price : 'N/A');
            const perFrequency = plan.id === 'free' ? '/ forever' : '/ year';
            const isSelectable = plan.id !== 'free'; // Only Premium/Business selectable here

            return (
              <Label // Use Label for better accessibility with RadioGroup
                key={plan.id}
                htmlFor={plan.id}
                className={`block border rounded-lg overflow-hidden cursor-pointer 
                            ${selectedPlanId === plan.id ? 'border-dearminder-purple ring-2 ring-dearminder-purple' : 'border-gray-200'}
                            ${!isSelectable ? 'opacity-70 cursor-default' : 'hover:shadow-md'}`}
              >
                <Card className={`flex flex-col border-0 shadow-none`}> {/* Remove internal Card border/shadow */} 
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{plan.title}</span>
                      {isSelectable && (
                        <RadioGroupItem value={plan.id} id={plan.id} className="ml-auto" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      <span className="text-2xl font-bold">{displayPrice}</span>
                      <span className="text-sm text-gray-500">{perFrequency}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  {plan.id === 'free' && (
                    <CardContent className="text-center text-sm text-gray-500 mt-auto py-4 bg-gray-50">
                      Current Plan (or default)
                    </CardContent>
                  )}
                </Card>
              </Label>
            );
          })}
        </div>
      </RadioGroup>

      <div className="mt-8 text-center">
        <Button
          size="lg"
          onClick={handlePayment}
          disabled={!selectedPlanId || selectedPlanId === 'free' || loading}
          className="w-full max-w-xs"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
            </>
          ) : (
            `Proceed to Payment for ${selectedPlanId ? subscriptionPlans.find(p=>p.id === selectedPlanId)?.title : 'Plan'}`
          )}
        </Button>
         {!selectedPlanId && <p className="text-sm text-red-500 mt-2">Please select a Premium plan above.</p>}
         {selectedPlanId === 'free' && <p className="text-sm text-gray-500 mt-2">Cannot subscribe to the Free plan here. Select Premium.</p>}
      </div>
    </div>
  );
};

export default SubscriptionPage;
