import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Settings as SettingsIcon, CreditCard, Lock, Mail } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">Settings</h1>
        
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input value={user?.email} disabled />
              </div>
              <div>
                <Label>Full Name</Label>
                <Input value={user?.user_metadata?.full_name} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Section */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Manage your subscription plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Current Plan: Free</p>
                <p className="text-sm text-gray-500">Basic features included</p>
              </div>
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => navigate('/subscription')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Subscription
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/update-password')}
              >
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/forgot-password')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Reset Password via Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;