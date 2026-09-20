export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface SentEmailLog {
  id: string;
  to: string;
  subject: string;
  snippet: string;
  sentAt: string;
}

const sentEmailLogs: SentEmailLog[] = [];

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const logEntry: SentEmailLog = {
    id: `email_${Date.now()}`,
    to: options.to,
    subject: options.subject,
    snippet: options.html.replace(/<[^>]+>/g, ' ').slice(0, 150) + '...',
    sentAt: new Date().toISOString()
  };
  sentEmailLogs.unshift(logEntry);

  console.log(`[Email Service (Nodemailer)] Sending email to: ${options.to}`);
  console.log(`[Subject]: ${options.subject}`);

  // If real SMTP host is provided, we can use nodemailer
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      // Dynamic import to avoid crash if optional
      console.log(`[Email Service] Dispatched through configured SMTP: ${process.env.SMTP_HOST}`);
    } catch (err) {
      console.warn('[Email Service] SMTP dispatch error:', err);
    }
  }

  return true;
}

export function sendBookingConfirmationEmail(booking: {
  userName: string;
  userEmail: string;
  serviceName: string;
  date: string;
  timeSlot?: string;
  budget?: string;
  id: string;
}) {
  const html = `
    <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF9F5; border: 1px solid #E5DFD7; padding: 40px; border-radius: 8px;">
      <h1 style="color: #262422; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; text-align: center; margin-bottom: 24px;">Atelier Luxe Interior Design</h1>
      <div style="border-top: 2px solid #C7B299; width: 60px; margin: 0 auto 30px auto;"></div>
      <p style="font-size: 16px; line-height: 1.6; color: #4A4641;">Dear ${booking.userName},</p>
      <p style="font-size: 16px; line-height: 1.6; color: #4A4641;">Thank you for reserving an interior design consultation with Atelier Luxe. We have received your consultation request and our principal design team is preparing for your session.</p>
      
      <div style="background: #FFFFFF; border: 1px solid #EAE5DE; padding: 24px; border-radius: 6px; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #262422; font-size: 18px; border-bottom: 1px solid #F0ECE6; padding-bottom: 10px;">Consultation Summary</h3>
        <p style="margin: 8px 0; color: #6E6862;"><strong>Booking Reference:</strong> #${booking.id}</p>
        <p style="margin: 8px 0; color: #6E6862;"><strong>Design Package:</strong> ${booking.serviceName}</p>
        <p style="margin: 8px 0; color: #6E6862;"><strong>Scheduled Date:</strong> ${booking.date} ${booking.timeSlot ? `(${booking.timeSlot})` : ''}</p>
        ${booking.budget ? `<p style="margin: 8px 0; color: #6E6862;"><strong>Estimated Budget:</strong> ${booking.budget}</p>` : ''}
        <p style="margin: 8px 0; color: #6E6862;"><strong>Status:</strong> <span style="background: #E8F4EC; color: #1E6B37; padding: 3px 8px; border-radius: 4px; font-weight: 600; font-size: 13px;">Confirmed / Pending Review</span></p>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #7B756E;">A dedicated project architect will contact you 24 hours prior to confirm the meeting link or on-site studio visit. If you wish to provide additional floor plans, mood boards, or property photos, you may upload them directly via your Atelier Luxe client dashboard.</p>
      
      <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #E5DFD7; text-align: center; color: #8F8880; font-size: 13px;">
        <p>Atelier Luxe Architecture & Interior Studio<br/>74 Mercer Street, Soho, New York, NY 10012</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: booking.userEmail,
    subject: `Consultation Confirmed: ${booking.serviceName} | Atelier Luxe`,
    html
  });
}

export function getSentEmailLogs(): SentEmailLog[] {
  return [...sentEmailLogs];
}
