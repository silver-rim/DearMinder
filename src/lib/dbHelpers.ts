
import { supabase } from "@/integrations/supabase/client";
import { Receiver, WishLog } from "./types";

/**
 * Maps database reminder record to Receiver type
 */
export const mapReminderToReceiver = (reminder: any): Receiver => {
  return {
    receiver_id: reminder.id,
    user_id: reminder.user_id,
    name: reminder.person_name,
    email: reminder?.email,
    phone_number: reminder?.phone_number,
    relation: reminder?.relation || 'friend',
    event_type: reminder.type,
    event_date: reminder.reminder_date,
    preferred_channels: reminder.channels || [],
    custom_message: reminder.message,
    card_url: reminder.card_url,
    created_at: reminder.created_at
  };
};

/**
 * Maps Receiver type to database reminder record
 */
export const mapReceiverToReminder = (receiver: Receiver) => {
  return {
    id: receiver.receiver_id,
    user_id: receiver.user_id,
    person_name: receiver.name,
    type: receiver.event_type,
    reminder_date: receiver.event_date,
    channels: receiver.preferred_channels,
    email: receiver.email,
    phone_number: receiver.phone_number,
    relation: receiver.relation,
    message: receiver.custom_message,
    card_url: receiver.card_url
  };
};

/**
 * Maps database log record to WishLog type
 */
export const mapDbLogToWishLog = (log: any): WishLog => {
  return {
    log_id: log.id,
    receiver_id: log.reminder_id,
    channel: log.channel,
    sent_at: log.sent_at,
    status: log.status,
    // Fix for TypeScript errors - use optional chaining and default undefined
    message: log?.message || undefined,
    error_details: log?.error_details || undefined
  };
};

/**
 * Execute a Supabase query with error handling
 */
export const executeQuery = async <T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<T> => {
  const { data, error } = await queryFn();
  
  if (error) {
    console.error('Error executing database query:', error);
    throw error;
  }
  
  return data as T;
};
