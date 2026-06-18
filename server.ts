import 'dotenv/config';
import express from 'express';
import nodemailer from 'nodemailer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

interface BookingRequest {
  name?: string;
  email?: string;
  eventType?: string;
  racerCount?: string;
  message?: string;
}

interface GoogleReview {
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: {
    text?: string;
  };
  originalText?: {
    text?: string;
  };
  publishTime?: string;
}

interface GooglePlaceDetailsResponse {
  displayName?: {
    text?: string;
  };
  rating?: number;
  userRatingCount?: number;
  reviews?: GoogleReview[];
  googleMapsUri?: string;
}

interface GoogleTextSearchResponse {
  places?: Array<{
    id?: string;
  }>;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 3000);
const app = express();
const googleReviewsUrl =
  process.env.GOOGLE_REVIEWS_URL ||
  'https://www.google.com/maps?cid=15475330145257075926&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=en-US&source=embed';
const googleReviewsCacheTtlMs = Number(process.env.GOOGLE_REVIEWS_CACHE_MINUTES || 30) * 60 * 1000;
let googleReviewsCache:
  | {
      expiresAt: number;
      payload: {
        placeName: string;
        rating: number | null;
        userRatingCount: number | null;
        reviews: Array<{
          id: string;
          name: string;
          role: string;
          avatar: string;
          text: string;
          rating: number;
          tag: string;
          sourceUrl: string;
          relativeTime: string;
        }>;
        sourceUrl: string;
        source: 'google';
      };
    }
  | null = null;

app.use(express.json({ limit: '1mb' }));

const requiredFields: Array<keyof BookingRequest> = ['name', 'email', 'eventType', 'racerCount'];

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const renderBookingTextEmail = (payload: Required<BookingRequest>) =>
  [
    'New Slide City booking enquiry',
    '==============================',
    '',
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Event/package: ${payload.eventType}`,
    `Racers: ${payload.racerCount}`,
    '',
    'Message:',
    payload.message,
    '',
    'Reply directly to this email to contact the customer.',
  ].join('\n');

const getAppUrl = () => (process.env.APP_URL || 'https://slide-city.co.uk').replace(/\/$/, '');

const getSubmittedAt = () =>
  new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/London',
  }).format(new Date());

const renderEmailRow = (label: string, value: string) => `
  <tr>
    <td style="padding:16px 18px;border-bottom:1px solid #27272a;color:#a1a1aa;font-size:12px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase;width:38%;font-family:Arial,Helvetica,sans-serif;">
      ${escapeHtml(label)}
    </td>
    <td style="padding:16px 18px;border-bottom:1px solid #27272a;color:#ffffff;font-size:15px;font-weight:800;line-height:1.5;font-family:Arial,Helvetica,sans-serif;">
      ${escapeHtml(value)}
    </td>
  </tr>
`;

const renderStatusPill = (label: string, value: string, accent = '#ef4444') => `
  <td width="33.33%" style="padding:0 6px 12px 0;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #27272a;background:#030304;">
      <tr>
        <td style="padding:14px;">
          <div style="font-size:11px;font-weight:900;letter-spacing:1.6px;text-transform:uppercase;color:#a1a1aa;margin-bottom:6px;">
            ${escapeHtml(label)}
          </div>
          <div style="font-size:16px;font-weight:900;line-height:1.25;color:${accent};">
            ${escapeHtml(value)}
          </div>
        </td>
      </tr>
    </table>
  </td>
`;

const renderEmailButton = (href: string, label: string, variant: 'primary' | 'secondary' = 'primary') => {
  const background = variant === 'primary' ? '#dc2626' : '#18181b';
  const border = variant === 'primary' ? '#dc2626' : '#3f3f46';

  return `
    <a href="${escapeHtml(href)}" style="display:inline-block;background:${background};border:1px solid ${border};color:#ffffff;text-decoration:none;padding:14px 20px;font-size:13px;font-weight:900;letter-spacing:1.4px;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">
      ${escapeHtml(label)}
    </a>
  `;
};

const renderEmailShell = ({
  title,
  eyebrow,
  intro,
  children,
  footerNote,
}: {
  title: string;
  eyebrow: string;
  intro: string;
  children: string;
  footerNote: string;
}) => {
  const appUrl = getAppUrl();
  const logoUrl = `${appUrl}/images/slide-city-logo.png`;

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#020203;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#020203;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;background:#09090b;border:1px solid #27272a;overflow:hidden;">
            <tr>
              <td style="background:#030304;padding:22px 24px;border-bottom:4px solid #dc2626;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="${escapeHtml(logoUrl)}" width="92" alt="Slide City" style="display:block;width:92px;max-width:92px;height:auto;border:0;" />
                    </td>
                    <td align="right" style="vertical-align:middle;color:#a1a1aa;font-size:12px;font-weight:900;letter-spacing:1.8px;text-transform:uppercase;">
                      Go Karting • United Kingdom
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="background:#dc2626;padding:26px 24px;color:#ffffff;">
                <div style="font-size:12px;font-weight:900;letter-spacing:2.4px;text-transform:uppercase;color:#fee2e2;margin-bottom:8px;">
                  ${escapeHtml(eyebrow)}
                </div>
                <h1 style="margin:0;font-size:32px;line-height:1.05;font-weight:900;letter-spacing:-1.2px;text-transform:uppercase;font-style:italic;">
                  ${escapeHtml(title)}
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:26px 24px;">
                <p style="margin:0 0 22px;color:#d4d4d8;font-size:15px;line-height:1.75;">
                  ${escapeHtml(intro)}
                </p>

                ${children}

                <div style="border-top:1px solid #27272a;padding-top:18px;color:#71717a;font-size:12px;line-height:1.7;">
                  ${footerNote}
                  <br />
                  <a href="${escapeHtml(appUrl)}" style="color:#ef4444;text-decoration:none;font-weight:800;">${escapeHtml(appUrl)}</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const renderBookingHtmlEmail = (payload: Required<BookingRequest>) => {
  const htmlMessage = escapeHtml(payload.message).replace(/\n/g, '<br />');
  const appUrl = getAppUrl();
  const submittedAt = getSubmittedAt();

  return renderEmailShell({
    eyebrow: 'Slide City Booking Desk',
    title: 'New Race Enquiry',
    intro: 'A customer has submitted a new enquiry from the Slide City website. The summary below is formatted for quick review and direct follow-up.',
    footerNote: 'Sent by the Slide City website enquiry form. Reply directly to contact the customer.',
    children: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 18px;">
        <tr>
          ${renderStatusPill('Request', 'New Lead')}
          ${renderStatusPill('Racers', payload.racerCount, '#ffffff')}
          ${renderStatusPill('Submitted', submittedAt, '#facc15')}
        </tr>
      </table>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #27272a;background:#030304;margin:0 0 22px;">
        ${renderEmailRow('Driver Name', payload.name)}
        ${renderEmailRow('Email', payload.email)}
        ${renderEmailRow('Event / Package', payload.eventType)}
        ${renderEmailRow('Racers', payload.racerCount)}
      </table>

      <div style="border:1px solid #27272a;background:#030304;padding:20px;margin-bottom:22px;">
        <div style="color:#ef4444;font-size:12px;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">
          Customer Message
        </div>
        <div style="color:#f4f4f5;font-size:15px;line-height:1.75;">
          ${htmlMessage}
        </div>
      </div>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:22px;">
        <tr>
          <td style="padding:0 10px 10px 0;">
            ${renderEmailButton(`mailto:${payload.email}`, 'Reply to Customer')}
          </td>
          <td style="padding:0 0 10px 0;">
            ${renderEmailButton(appUrl, 'Open Website', 'secondary')}
          </td>
        </tr>
      </table>
    `,
  });
};

const renderCustomerConfirmationTextEmail = (payload: Required<BookingRequest>) =>
  [
    'Thanks for contacting Slide City',
    '================================',
    '',
    `Hi ${payload.name},`,
    '',
    'Thanks for sending your booking enquiry. The Slide City team has received your request and will follow up using the details below.',
    '',
    `Event/package: ${payload.eventType}`,
    `Racers: ${payload.racerCount}`,
    '',
    'Your message:',
    payload.message,
    '',
    'If anything changes, reply to this email or contact info@slide-city.co.uk.',
    '',
    'Slide City',
  ].join('\n');

const renderCustomerConfirmationHtmlEmail = (payload: Required<BookingRequest>) => {
  const htmlMessage = escapeHtml(payload.message).replace(/\n/g, '<br />');
  const appUrl = getAppUrl();

  return renderEmailShell({
    eyebrow: 'Your enquiry is in the pit lane',
    title: 'Request Received',
    intro: `Hi ${payload.name}, thanks for contacting Slide City. We have received your enquiry and the team will follow up using the details below.`,
    footerNote: 'Need to change anything? Reply to this email or contact info@slide-city.co.uk.',
    children: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 18px;">
        <tr>
          ${renderStatusPill('Status', 'Received')}
          ${renderStatusPill('Racers', payload.racerCount, '#ffffff')}
          ${renderStatusPill('Next Step', 'Team Follow-Up', '#facc15')}
        </tr>
      </table>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #27272a;background:#030304;margin:0 0 22px;">
        ${renderEmailRow('Event / Package', payload.eventType)}
        ${renderEmailRow('Racers', payload.racerCount)}
        ${renderEmailRow('Email', payload.email)}
      </table>

      <div style="border:1px solid #27272a;background:#030304;padding:20px;margin-bottom:22px;">
        <div style="color:#ef4444;font-size:12px;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">
          Your Message
        </div>
        <div style="color:#f4f4f5;font-size:15px;line-height:1.75;">
          ${htmlMessage}
        </div>
      </div>

      <div style="background:#18181b;border-left:4px solid #dc2626;padding:16px 18px;margin-bottom:22px;color:#d4d4d8;font-size:14px;line-height:1.7;">
        Please keep this email as your enquiry record. A member of the Slide City team will confirm availability, timings, and the best race format for your group.
      </div>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:22px;">
        <tr>
          <td style="padding:0 10px 10px 0;">
            ${renderEmailButton(appUrl, 'Visit Slide City')}
          </td>
          <td style="padding:0 0 10px 0;">
            ${renderEmailButton('mailto:info@slide-city.co.uk', 'Email the Team', 'secondary')}
          </td>
        </tr>
      </table>
    `,
  });
};

const getSmtpTransport = () => {
  const host = process.env.SMTP_HOST;
  const portValue = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP_HOST, SMTP_USER, and SMTP_PASS must be configured.');
  }

  return nodemailer.createTransport({
    host,
    port: portValue,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });
};

const getGooglePlaceId = async (apiKey: string) => {
  if (process.env.GOOGLE_PLACE_ID) {
    return process.env.GOOGLE_PLACE_ID;
  }

  const query = process.env.GOOGLE_PLACE_QUERY;
  if (!query) {
    throw new Error('GOOGLE_PLACE_ID or GOOGLE_PLACE_QUERY must be configured.');
  }

  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id',
    },
    body: JSON.stringify({ textQuery: query }),
  });

  if (!response.ok) {
    throw new Error(`Google Text Search failed with status ${response.status}.`);
  }

  const data = (await response.json()) as GoogleTextSearchResponse;
  const placeId = data.places?.[0]?.id;

  if (!placeId) {
    throw new Error('Google Text Search did not return a place ID.');
  }

  return placeId;
};

const getGoogleReviews = async () => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error('GOOGLE_PLACES_API_KEY must be configured.');
  }

  const placeId = await getGooglePlaceId(apiKey);
  const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews,googleMapsUri',
    },
  });

  if (!response.ok) {
    throw new Error(`Google Place Details failed with status ${response.status}.`);
  }

  const data = (await response.json()) as GooglePlaceDetailsResponse;
  const sourceUrl = data.googleMapsUri || googleReviewsUrl;

  return {
    placeName: data.displayName?.text || 'Slide City',
    rating: data.rating ?? null,
    userRatingCount: data.userRatingCount ?? null,
    reviews: (data.reviews || [])
      .map((review, index) => {
        const text = review.text?.text || review.originalText?.text || '';
        const name = review.authorAttribution?.displayName || 'Google reviewer';

        return {
          id: `google-${review.publishTime || index}`,
          name,
          role: review.relativePublishTimeDescription || 'Google Review',
          avatar: review.authorAttribution?.photoUri || '',
          text,
          rating: Math.max(1, Math.min(5, Math.round(review.rating || 5))),
          tag: 'Google Review',
          sourceUrl: review.authorAttribution?.uri || sourceUrl,
          relativeTime: review.relativePublishTimeDescription || '',
        };
      })
      .filter((review) => review.text),
    sourceUrl,
    source: 'google' as const,
  };
};

app.post('/api/contact', async (req, res) => {
  const payload = req.body as BookingRequest;

  for (const field of requiredFields) {
    if (!payload[field]?.trim()) {
      return res.status(400).json({ message: `${field} is required.` });
    }
  }

  if (!isValidEmail(payload.email || '')) {
    return res.status(400).json({ message: 'A valid email address is required.' });
  }

  try {
    const transporter = getSmtpTransport();
    const recipient = process.env.SMTP_TO || 'info@slide-city.co.uk';
    const from = process.env.SMTP_FROM || 'Slide City <info@slide-city.co.uk>';
    const emailPayload: Required<BookingRequest> = {
      name: payload.name?.trim() || '',
      email: payload.email?.trim() || '',
      eventType: payload.eventType?.trim() || '',
      racerCount: payload.racerCount?.trim() || '',
      message: payload.message?.trim() || 'No extra message provided.',
    };

    await transporter.sendMail({
      from,
      to: recipient,
      replyTo: emailPayload.email,
      subject: `🏁 Slide City enquiry: ${emailPayload.eventType}`,
      text: renderBookingTextEmail(emailPayload),
      html: renderBookingHtmlEmail(emailPayload),
    });

    await transporter.sendMail({
      from,
      to: emailPayload.email,
      replyTo: recipient,
      subject: `Slide City received your enquiry: ${emailPayload.eventType}`,
      text: renderCustomerConfirmationTextEmail(emailPayload),
      html: renderCustomerConfirmationHtmlEmail(emailPayload),
    });

    return res.json({ message: 'Booking enquiry sent.' });
  } catch (error) {
    console.error('Failed to send booking enquiry:', error);
    return res.status(500).json({ message: 'Unable to send booking enquiry right now.' });
  }
});

app.get('/api/google-reviews', async (_req, res) => {
  if (googleReviewsCache && googleReviewsCache.expiresAt > Date.now()) {
    return res.json(googleReviewsCache.payload);
  }

  try {
    const payload = await getGoogleReviews();
    googleReviewsCache = {
      expiresAt: Date.now() + googleReviewsCacheTtlMs,
      payload,
    };

    return res.json(payload);
  } catch (error) {
    console.error('Failed to fetch Google reviews:', error);
    return res.status(503).json({
      message: 'Google reviews are unavailable right now.',
      sourceUrl: googleReviewsUrl,
    });
  }
});

if (isProduction) {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, () => {
  console.log(`Slide City server running on http://localhost:${port}`);
});
