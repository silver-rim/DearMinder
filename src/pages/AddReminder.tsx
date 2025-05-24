import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const AddReminder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [personName, setPersonName] = useState('');
  const [reminderType, setReminderType] = useState('birthday');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [channels, setChannels] = useState<string[]>(['email']);
  const [isAutoWishEnabled, setIsAutoWishEnabled] = useState(false);
  const [message, setMessage] = useState('');

  const handleChannelToggle = (channel: string) => {
    setChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(ch => ch !== channel) 
        : [...prev, channel]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: "Please select a date",
        variant: "destructive"
      });
      return;
    }

    if (!personName) {
      toast({
        title: "Please enter a name",
        variant: "destructive"
      });
      return;
    }

    if (channels.length === 0) {
      toast({
        title: "Please select at least one notification channel",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('reminders')
        .insert({
          user_id: user?.id,
          person_name: personName,
          type: reminderType,
          reminder_date: format(date, 'yyyy-MM-dd'),
          channels: channels,
          is_auto_wish_enabled: isAutoWishEnabled,
          message: message || null
        });

      if (error) throw error;

      toast({
        title: "Reminder created",
        description: `You'll be reminded about ${personName}'s ${reminderType}`
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error creating reminder",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/dashboard')} 
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Add New Reminder</CardTitle>
          <CardDescription>
            Create a new reminder for an important date
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="personName">Person's Name</Label>
              <Input 
                id="personName" 
                value={personName} 
                onChange={(e) => setPersonName(e.target.value)} 
                placeholder="Enter name" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminderType">Reminder Type</Label>
              <Select value={reminderType} onValueChange={setReminderType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="anniversary">Anniversary</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Notification Channels</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="email" 
                    checked={channels.includes('email')} 
                    onCheckedChange={() => handleChannelToggle('email')} 
                  />
                  <Label htmlFor="email">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sms" 
                    checked={channels.includes('sms')} 
                    onCheckedChange={() => handleChannelToggle('sms')} 
                  />
                  <Label htmlFor="sms">SMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="app" 
                    checked={channels.includes('app')} 
                    onCheckedChange={() => handleChannelToggle('app')} 
                  />
                  <Label htmlFor="app">App Notification</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="autoWish" 
                  checked={isAutoWishEnabled} 
                  onCheckedChange={(checked) => setIsAutoWishEnabled(!!checked)} 
                />
                <Label htmlFor="autoWish">Enable Auto-Wish</Label>
              </div>
              <p className="text-sm text-gray-500">
                We'll automatically send wishes on the special day
              </p>
            </div>

            {isAutoWishEnabled && (
              <div className="space-y-2">
                <Label htmlFor="message">Custom Message (Optional)</Label>
                <Input 
                  id="message" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Enter a custom message for auto-wish" 
                />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Reminder...
                </>
              ) : (
                'Create Reminder'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddReminder;
