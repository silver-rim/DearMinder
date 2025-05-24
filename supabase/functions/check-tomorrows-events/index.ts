import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Get all reminders for tomorrow
    const { data: tomorrowsEvents, error: eventsError } = await supabaseClient
      .from('reminders')
      .select('*')
      .eq('reminder_date', tomorrowStr);

    if (eventsError) throw eventsError;

    const results = [];
    const userEventMap: Record<string, any[]> = {};

    // Group events by user
    tomorrowsEvents.forEach(event => {
      if (!userEventMap[event.user_id]) {
        userEventMap[event.user_id] = [];
      }
      userEventMap[event.user_id].push(event);
    });

    for (const [userId, userReceivers] of Object.entries(userEventMap)) {
      try {
        // Get user's email
        const { data: userData, error: userError } = await supabaseClient
          .from('profiles')
          .select('email')
          .eq('id', userId)
          .single();

        if (userError) throw userError;

        // Create notifications and send emails for each user
        for (const receiver of userReceivers) {
          // Create notification
          const { error: notifError } = await supabaseClient
            .from('notifications')
            .insert({
              user_id: userId,
              receiver_id: receiver.id,
              type: 'reminder',
              title: `Upcoming ${receiver.type} Reminder`,
              message: `${receiver.person_name}'s ${receiver.type} is tomorrow!`,
              is_read: false
            });

          if (notifError) {
            console.error(`Error creating notification: ${notifError.message}`);
          }

          // Send email if email is in channels
          if (receiver.channels.includes('email')) {
            const { error: emailError } = await supabaseClient.functions.invoke('send-email', {
              body: {
                to: userData.email,
                subject: `Upcoming ${receiver.type} Reminder`,
                html: `
                  <h2>Upcoming ${receiver.type} Reminder</h2>
                  <p>Hello,</p>
                  <p>This is a reminder that ${receiver.person_name}'s ${receiver.type} is tomorrow!</p>
                  <p>Don't forget to send your wishes!</p>
                  <p>Best regards,<br>DearMinder Team</p>
                `
              }
            });

            if (emailError) {
              console.error(`Error sending email: ${emailError.message}`);
            }
          }

          results.push({
            user_id: userId,
            receiver_id: receiver.id,
            success: true
          });
        }
      } catch (error) {
        console.error(`Error processing user ${userId}: ${error.message}`);
        results.push({ user_id: userId, success: false, error: error.message });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${tomorrowsEvents.length} events for tomorrow`,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error in check-tomorrows-events function: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
