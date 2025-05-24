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

    // Get today's date
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Get all reminders for today
    const { data: todaysEvents, error: eventsError } = await supabaseClient
      .from('reminders')
      .select('*')
      .eq('reminder_date', todayStr)
      .eq('is_auto_wish_enabled', true);

    if (eventsError) throw eventsError;

    const results = [];
    const userEventMap: Record<string, any[]> = {};

    // Group events by user
    todaysEvents.forEach(event => {
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

        // Send wishes for each event
        for (const receiver of userReceivers) {
          if (receiver.channels.includes('email')) {
            const { error: emailError } = await supabaseClient.functions.invoke('send-email', {
              body: {
                to: userData.email,
                subject: `Happy ${receiver.type}!`,
                html: `
                  <h2>Happy ${receiver.type}!</h2>
                  <p>Hello,</p>
                  <p>Today is ${receiver.person_name}'s ${receiver.type}!</p>
                  ${receiver.message ? `<p>Your custom message: ${receiver.message}</p>` : ''}
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
        message: `Processed ${todaysEvents.length} events for today`,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error in send-wishes function: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}); 