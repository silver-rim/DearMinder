import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { getUpcomingReceivers, getEventCountsByType } from '@/lib/receiversService';
import QuickStats from '@/components/dashboard/QuickStats';
import EventsList from '@/components/dashboard/EventsList';
import EventsByType from '@/components/dashboard/EventsByType';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NotificationTest } from '@/components/NotificationTest';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [receivers, setReceivers] = useState([]);
  const [eventCounts, setEventCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [countLoading, setCountLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceivers = async () => {
      try {
        setLoading(true);
        const data = await getUpcomingReceivers();
        setReceivers(data);
      } catch (error: any) {
        toast({
          title: "Error fetching events",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchEventCounts = async () => {
      try {
        setCountLoading(true);
        const counts = await getEventCountsByType();
        setEventCounts(counts);
      } catch (error: any) {
        toast({
          title: "Error fetching event counts",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setCountLoading(false);
      }
    };

    fetchReceivers();
    fetchEventCounts();
  }, []);

  const handleAddReceiver = () => {
    navigate('/add-reminder');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">DearMinder Dashboard</h1>
        <div className="flex items-center gap-4">
          <span style={{fontSize: '1.3rem', fontWeight: 'bold'}}>Welcome, {user?.user_metadata?.full_name || user?.email}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Upcoming Events</span>
              <Button onClick={handleAddReceiver} className="flex items-center gap-2">
                <CalendarPlus size={16} />
                <span>Add Event</span>
              </Button>
            </CardTitle>
            <CardDescription>
              Keep track of all your important dates and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EventsList receivers={receivers} loading={loading} />
          </CardContent>
        </Card>
        
        <QuickStats receivers={receivers} />
        <EventsByType 
          eventCounts={eventCounts} 
          loading={countLoading} 
          onAddEvent={handleAddReceiver} 
        />
      </div>

      {/* Add Notification Test Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Test Notifications</CardTitle>
            <CardDescription>
              Send test notifications to verify the system is working
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationTest />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
