
import React, { useState, useEffect } from 'react'; // Import useEffect
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast'; // Import toast
import { supabase } from '@/integrations/supabase/client'; // Import supabase for password reset

const Auth = () => {
  const location = useLocation(); // Get location object
  const params = new URLSearchParams(location.search); // Get search params
  const initialMode = params.get('mode'); // Check for 'mode' param

  const [isLogin, setIsLogin] = useState(initialMode !== 'signup'); // Set initial state based on mode
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State for Forgot Password
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Effect to update isLogin state if the URL query param changes
  useEffect(() => {
    const mode = params.get('mode');
    setIsLogin(mode !== 'signup');
  }, [location.search]); // Re-run effect when search params change

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        // Navigation is handled within signIn
      } else {
        await signUp(email, password, fullName);
        setIsLogin(true); // Switch to login view after successful sign up
        setEmail(''); // Clear fields
        setPassword('');
        setFullName('');
        // Confirmation toast is handled in signUp
      }
    } catch (error) {
      console.error('Auth error:', error);
      // Error toast is handled in signIn/signUp
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`, // Need to create this page
      });
      if (error) throw error;
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for instructions to reset your password.",
      });
      setShowForgotPassword(false); // Hide the form
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Password Reset Failed",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6">
        <Card>
          {!showForgotPassword ? (
            <> {/* Main Login/Signup Form */} 
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  {isLogin ? 'Login to DearMinder' : 'Create an Account'}
                </CardTitle>
                <CardDescription className="text-center">
                  {isLogin 
                    ? 'Enter your email and password to access your reminders' 
                    : 'Fill in the details to create your DearMinder account'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-1">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required={!isLogin}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  {isLogin && (
                    <div className="text-right">
                      <Button 
                        type="button"
                        variant="link"
                        size="sm"
                        className="p-0 h-auto text-sm text-dearminder-purple hover:underline"
                        onClick={() => setShowForgotPassword(true)}
                        disabled={isSubmitting}
                      >
                        Forgot password?
                      </Button>
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isLogin ? 'Logging in...' : 'Signing up...'}
                      </>
                    ) : (
                      isLogin ? 'Login' : 'Sign Up'
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <Button 
                  type="button"
                  variant="link" 
                  className="w-full"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setEmail('');
                    setPassword('');
                    setFullName('');
                    // Update URL for potential refresh/bookmarking
                    navigate(isLogin ? '/auth?mode=signup' : '/auth', { replace: true });
                  }}
                  disabled={isSubmitting}
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </Button>
              </CardFooter>
            </>
          ) : (
            <> {/* Forgot Password Form */} 
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                <CardDescription className="text-center">Enter your email to receive reset instructions.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email} // Reuse email state
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Instructions'
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <Button 
                  type="button"
                  variant="link" 
                  className="w-full"
                  onClick={() => setShowForgotPassword(false)}
                  disabled={isSubmitting}
                >
                  Back to Login
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Auth;
