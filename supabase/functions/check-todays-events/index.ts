
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create a Supabase client with the Auth context of the function
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}-${today.getDate()}`; // MM-DD format

    // Query for receivers with events today (matching month and day)
    const { data: receivers, error: receiversError } = await supabase
      .from("receivers")
      .select("*")
      .filter("event_date", "neq", null)
      .filter("preferred_channels", "neq", "{}");

    if (receiversError) {
      throw receiversError;
    }

    console.log(`Found ${receivers.length} total receivers to check`);
    
    const todaysEvents = receivers.filter(receiver => {
      const eventDate = new Date(receiver.event_date);
      const eventFormatted = `${eventDate.getMonth() + 1}-${eventDate.getDate()}`;
      return eventFormatted === formattedDate;
    });

    console.log(`Found ${todaysEvents.length} receivers with events today`);

    // Process each receiver with an event today
    const results = await Promise.all(todaysEvents.map(async (receiver) => {
      try {
        // For each preferred channel, send a wish
        for (const channel of receiver.preferred_channels) {
          let status = 'pending';
          let errorDetails = null;

          try {
            if (channel === 'email' && receiver.email) {
              // Call the send-email function
              const emailResponse = await fetch(
                `${supabaseUrl}/functions/v1/send-email`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseKey}`,
                  },
                  body: JSON.stringify({
                    to: receiver.email,
                    subject: `Happy ${receiver.event_type}!`,
                    message: receiver.custom_message || `Wishing you a wonderful ${receiver.event_type}!`,
                    card_url: receiver.card_url,
                    receiver_id: receiver.receiver_id
                  })
                }
              );

              if (emailResponse.ok) {
                status = 'success';
              } else {
                status = 'failed';
                errorDetails = await emailResponse.text();
              }
            } 
            else if (channel === 'sms' && receiver.phone_number) {
              // SMS implementation would go here
              // This is where you would integrate with an SMS provider
              status = 'not_implemented';
              errorDetails = 'SMS sending not yet implemented';
            }
          } catch (e) {
            status = 'error';
            errorDetails = e.message;
          }

          // Log the wish attempt
          const { error: logError } = await supabase
            .from('wish_logs')
            .insert({
              receiver_id: receiver.receiver_id,
              channel,
              status,
              message: receiver.custom_message || `Wishing you a wonderful ${receiver.event_type}!`,
              error_details: errorDetails
            });

          if (logError) {
            console.error(`Error logging wish: ${logError.message}`);
          }
        }

        return { receiver_id: receiver.receiver_id, success: true };
      } catch (error) {
        console.error(`Error processing receiver ${receiver.receiver_id}: ${error.message}`);
        return { receiver_id: receiver.receiver_id, success: false, error: error.message };
      }
    }));

    return new Response(
      JSON.stringify({
        message: `Processed ${todaysEvents.length} events for today`,
        results
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error(`Error in check-todays-events function: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
