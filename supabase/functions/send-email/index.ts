import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SendEmailRequest {
  to: string;
  subject: string;
  headline?: string;
  message: string;
  buttonText?: string;
  buttonLink?: string;
  emailType?: string;
}

function buildBrandedEmail(opts: {
  subject: string;
  headline?: string;
  message: string;
  buttonText?: string;
  buttonLink?: string;
}): string {
  const { subject, headline, message, buttonText, buttonLink } = opts;
  const displayHeadline = headline || subject;
  const messageHtml = message.replace(/\n/g, "<br>");
  const buttonHtml = buttonText && buttonLink
    ? `<a href="${buttonLink}" style="display:inline-block; background:#4B176F; color:#FFFFFF; padding:14px 24px; border-radius:30px; font-size:11px; font-weight:bold; letter-spacing:1px; text-decoration:none;">${buttonText}</a>`
    : "";

  return `<!-- WEE INITIATIVE EMAIL TEMPLATE -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F1F7; font-family:Arial,Helvetica,sans-serif;">
<tr>
<td align="center" style="padding:24px 10px;">
<table role="presentation" width="620" cellpadding="0" cellspacing="0" style="width:100%; max-width:620px; background:#FFFFFF; border-radius:24px; overflow:hidden;">
<tr>
<td align="center" style="padding:28px 24px 25px; background:#FFFFFF;">
  <div style="font-family:Georgia,'Times New Roman',serif; font-size:23px; line-height:1.3; color:#4B176F;">WOMEN ELEVATION</div>
  <div style="font-size:10px; line-height:1.8; letter-spacing:2px; color:#6C6170; margin-top:3px;">&amp; EMPOWERMENT INITIATIVE</div>
  <div style="height:2px; width:58px; background:#D4AF37; margin:15px auto 0;"></div>
</td>
</tr>
<tr>
<td align="center" style="background:#4B176F; padding:28px 24px;">
  <div style="font-size:10px; letter-spacing:2.2px; font-weight:bold; color:#E8CF75; margin-bottom:10px;">WEE INITIATIVE</div>
  <div style="font-family:Georgia,'Times New Roman',serif; font-size:30px; line-height:1.25; color:#FFFFFF;">${displayHeadline}</div>
</td>
</tr>
<tr>
<td style="padding:32px 38px 38px; color:#5C5062; font-size:14px; line-height:1.85;">
  ${messageHtml}
  ${buttonHtml ? `<div style="margin-top:22px;">${buttonHtml}</div>` : ""}
</td>
</tr>
<tr>
<td align="center" style="background:#4B176F; padding:30px 24px 27px;">
  <div style="font-family:Georgia,'Times New Roman',serif; font-size:16px; line-height:1.5; color:#FFFFFF; margin-bottom:8px;">Women Elevation &amp; Empowerment Initiative</div>
  <div style="font-size:9px; letter-spacing:2px; line-height:1.8; color:#E8CF75; margin-bottom:17px;">EDUCATING &bull; EMPOWERING &bull; ADVOCATING</div>
  <div style="font-size:11px; line-height:1.8; color:#E9DFF0;">Thank you for being part of our work to educate, empower, and advocate for women and girls.</div>
  <div style="margin-top:13px;">
    <a href="https://weeinitiative.org/unsubscribe" style="font-size:10px; color:#E8CF75; text-decoration:underline;">Unsubscribe</a>
  </div>
  <div style="height:2px; width:70px; background:#D4AF37; margin:22px auto 0;"></div>
</td>
</tr>
</table>
</td>
</tr>
</table>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { to, subject, headline, message, buttonText, buttonLink, emailType }: SendEmailRequest = await req.json();

    if (!to || !subject || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields: to, subject, message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "info@weeinitiative.org";

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const htmlBody = buildBrandedEmail({ subject, headline, message, buttonText, buttonLink });
    const textBody = message;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html: htmlBody,
        text: textBody,
      }),
    });

    let resendId: string | null = null;
    let sendStatus = "sent";

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!res.ok) {
      const errText = await res.text();
      sendStatus = "failed";
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase.from("email_log").insert({
          recipient: to,
          subject,
          body: textBody,
          html_body: htmlBody,
          form_type: emailType || null,
          status: "failed",
        });
      }
      return new Response(JSON.stringify({ error: `Resend API error: ${errText}` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resData = await res.json();
    resendId = resData.id || null;

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      await supabase.from("email_log").insert({
        recipient: to,
        subject,
        body: textBody,
        html_body: htmlBody,
        form_type: emailType || null,
        status: sendStatus,
        resend_id: resendId,
      });
    }

    return new Response(JSON.stringify({ success: true, resendId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
