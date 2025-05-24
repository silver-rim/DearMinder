
import { supabase } from "@/integrations/supabase/client";
import { Receiver, WishLog, Notification } from "./types";
import { mapReminderToReceiver, mapReceiverToReminder, mapDbLogToWishLog, executeQuery } from "./dbHelpers";
import { getAdjustedEventDate, calculateDaysBetween } from "./utils";

/**
 * Get all receivers for the current user
 */
export const getReceivers = async () => {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .order('person_name', { ascending: true });

  if (error) {
    console.error('Error fetching receivers:', error);
    throw error;
  }

  // Map the data from reminders table to our Receiver type
  return (data || []).map(mapReminderToReceiver);
};

/**
 * Get upcoming receivers (within the next month)
 */
export const getUpcomingReceivers = async (days: number = 30) => {
  // Get current date
  const today = new Date();
  
  // Get all receivers
  const { data, error } = await supabase
    .from('reminders')
    .select('*');

  if (error) {
    console.error('Error fetching receivers:', error);
    throw error;
  }

  // Map data to our Receiver type
  const receivers = (data || []).map(mapReminderToReceiver);

  // Filter receivers to find those with upcoming events
  return receivers.filter(receiver => {
    const eventDate = getAdjustedEventDate(receiver.event_date);
    const diffDays = calculateDaysBetween(eventDate, today);
    
    return diffDays >= 0 && diffDays <= days;
  }).sort((a, b) => {
    // Sort by date (accounting for year change)
    const dateA = getAdjustedEventDate(a.event_date);
    const dateB = getAdjustedEventDate(b.event_date);
    
    return dateA.getTime() - dateB.getTime();
  });
};

/**
 * Create a new receiver
 */
export const createReceiver = async (receiver: Receiver) => {
  // Convert to reminders schema
  const reminderData = mapReceiverToReminder(receiver);
  
  const { data, error } = await supabase
    .from('reminders')
    .insert([reminderData])
    .select();

  if (error) {
    console.error('Error creating receiver:', error);
    throw error;
  }

  // Map back to our Receiver type
  return mapReminderToReceiver(data[0]);
};

/**
 * Update an existing receiver
 */
export const updateReceiver = async (receiver: Receiver) => {
  if (!receiver.receiver_id) {
    throw new Error('Receiver ID is required for updates');
  }
  
  // Convert to reminders schema
  const reminderData = mapReceiverToReminder(receiver);
  
  const { data, error } = await supabase
    .from('reminders')
    .update(reminderData)
    .eq('id', receiver.receiver_id)
    .select();

  if (error) {
    console.error('Error updating receiver:', error);
    throw error;
  }

  // Map back to our Receiver type
  return mapReminderToReceiver(data[0]);
};

/**
 * Delete a receiver
 */
export const deleteReceiver = async (receiverId: string) => {
  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', receiverId);

  if (error) {
    console.error('Error deleting receiver:', error);
    throw error;
  }

  return true;
};

/**
 * Get wish logs for a receiver
 */
export const getWishLogs = async (receiverId: string) => {
  const { data, error } = await supabase
    .from('wish_logs')
    .select('*')
    .eq('reminder_id', receiverId)
    .order('sent_at', { ascending: false });

  if (error) {
    console.error('Error fetching wish logs:', error);
    throw error;
  }

  // Map database fields to our WishLog type
  return (data || []).map(mapDbLogToWishLog);
};

// Exporting these functions from types.ts for backward compatibility
export type { Receiver, WishLog, Notification };

/**
 * Get user notifications
 */
export const getNotifications = async (isRead?: boolean) => {
  // For now, return an empty array since the notifications table
  // might not exist yet
  return [] as Notification[];
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  // This is a placeholder until we add the notifications table
  return {
    notification_id: notificationId,
    user_id: "",
    type: "",
    title: "",
    message: "",
    is_read: true,
    created_at: new Date().toISOString()
  } as Notification;
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId: string) => {
  // This is a placeholder until we add the notifications table
  return true;
};

/**
 * Manually trigger wish sending for a receiver
 */
export const sendWishManually = async (receiverId: string) => {
  // Get the URL from the environment
  const supabaseUrl = "https://ujiprjxtabqmhrisrwzb.supabase.co";
  
  try {
    // This would call the check-todays-events function with a specific receiver ID
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;

    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/check-todays-events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ receiver_id: receiverId })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send wish: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending wish manually:', error);
    throw error;
  }
};

/**
 * Get event counts by type
 */
export const getEventCountsByType = async () => {
  const { data, error } = await supabase
    .from('reminders')
    .select('type');

  if (error) {
    console.error('Error fetching event counts:', error);
    throw error;
  }

  // Count events by type
  const counts: Record<string, number> = {};
  (data || []).forEach(event => {
    const type = event.type;
    counts[type] = (counts[type] || 0) + 1;
  });

  return counts;
};

/**
 * Get events for a specific month
 */
export const getEventsForMonth = async (month: number, year: number) => {
  // Get all receivers
  const { data, error } = await supabase
    .from('reminders')
    .select('*');

  if (error) {
    console.error('Error fetching events for month:', error);
    throw error;
  }

  // Map and filter data for the specified month
  const receivers = (data || []).map(mapReminderToReceiver);

  // Filter for events in the specified month
  return receivers.filter(receiver => {
    const eventDate = new Date(receiver.event_date);
    return eventDate.getMonth() === month && 
           (year === undefined || eventDate.getFullYear() === year);
  });
};

/**
 * Check if an event exists for a specific date
 */
export const checkEventExists = async (date: Date) => {
  const formattedDate = date.toISOString().split('T')[0];
  
  // Get all receivers
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('reminder_date', formattedDate);

  if (error) {
    console.error('Error checking event existence:', error);
    throw error;
  }

  return (data || []).length > 0;
};
