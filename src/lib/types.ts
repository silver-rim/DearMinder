
// Types shared across the application
export type Receiver = {
  receiver_id?: string;
  user_id?: string;
  name: string;
  email?: string;
  phone_number?: string;
  relation: string;
  event_type: string;
  event_date: string;
  preferred_channels: string[];
  custom_message?: string;
  card_url?: string;
  created_at?: string;
};

export type WishLog = {
  log_id: string;
  receiver_id: string;
  channel: string;
  sent_at: string;
  status: string;
  message?: string;
  error_details?: string;
};

export type Notification = {
  notification_id: string;
  user_id: string;
  receiver_id?: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};
