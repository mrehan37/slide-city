# Slide City

Responsive website for Slide City, a UK-based go-kart racing company.

## Business Details

- Domain: `slide-city.co.uk`
- Email: `info@slide-city.co.uk`
- Location: United Kingdom

## Run Locally

Prerequisite: Node.js

1. Install dependencies:
   `npm install`
2. Create `.env` from `.env.example` and add your SMTP details.
3. Start the development server:
   `npm run dev`
4. Build for production:
   `npm run build`
5. Run the production server:
   `npm start`

## SMTP

The booking form posts to `/api/contact` and sends enquiries to `SMTP_TO`.

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `SMTP_TO`
