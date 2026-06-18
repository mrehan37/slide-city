import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Phone, MapPin, Mail, Clock, Ticket, AlertCircle, RefreshCw, Flag, Download } from 'lucide-react';

interface ContactFormProps {
  selectedPackage: string;
  onClearSelectedPackage: () => void;
}

const escapePdfText = (value: string) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\r?\n/g, ' ');

const sanitizeFilename = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'slide-city-pass';

const truncatePdfText = (value: string, maxLength: number) =>
  value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;

const loadLogoAsJpegHex = async () => {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = '/images/slide-city-logo.png';

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Unable to load logo'));
  });

  const size = 180;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  if (!context) return null;

  context.fillStyle = '#030304';
  context.fillRect(0, 0, size, size);
  context.drawImage(image, 0, 0, size, size);

  const base64 = canvas.toDataURL('image/jpeg', 0.92).split(',')[1];
  const binary = atob(base64);

  return Array.from(binary, (char) => char.charCodeAt(0).toString(16).padStart(2, '0')).join('').toUpperCase();
};

const pdfText = (text: string, x: number, y: number, size = 12, font = 'F1', color = '1 1 1') =>
  `${color} rg\nBT /${font} ${size} Tf ${x} ${y} Td (${escapePdfText(text)}) Tj ET`;

const pdfRect = (x: number, y: number, width: number, height: number, color: string) =>
  `${color} rg\n${x} ${y} ${width} ${height} re f`;

const pdfStrokeRect = (x: number, y: number, width: number, height: number, color: string, lineWidth = 1) =>
  `${color} RG\n${lineWidth} w\n${x} ${y} ${width} ${height} re S`;

const pdfLine = (x1: number, y1: number, x2: number, y2: number, color: string, lineWidth = 1) =>
  `${color} RG\n${lineWidth} w\n${x1} ${y1} m ${x2} ${y2} l S`;

const renderPdfField = (label: string, value: string, x: number, y: number, width = 236) => [
  pdfRect(x, y, width, 72, '0.035 0.035 0.045'),
  pdfStrokeRect(x, y, width, 72, '0.18 0.18 0.2'),
  pdfText(label.toUpperCase(), x + 14, y + 47, 9, 'F1', '0.72 0.72 0.76'),
  pdfText(truncatePdfText(value, 26), x + 14, y + 22, 14, 'F1', '1 1 1'),
].join('\n');

const buildPdfDocument = (ticket: {
  ticketCode: string;
  racerName: string;
  packageType: string;
  count: string;
  date: string;
}, logoHex: string | null) => {
  const content = [
    'q',
    '0.01 0.01 0.015 rg',
    '0 0 612 792 re f',
    pdfRect(0, 670, 612, 122, '0.86 0.03 0.05'),
    pdfRect(0, 650, 612, 20, '0.03 0.03 0.035'),
    pdfRect(42, 688, 78, 64, '0.01 0.01 0.015'),
    pdfStrokeRect(42, 688, 78, 64, '1 1 1', 1),
    logoHex ? 'q\n76 0 0 76 43 682 cm\n/Logo Do\nQ' : pdfText('SC', 62, 711, 25, 'F1', '1 1 1'),
    pdfText('SLIDE CITY', 144, 735, 32, 'F1', '1 1 1'),
    pdfText('BOOKING REQUEST PASS', 146, 705, 14, 'F1', '1 1 1'),
    pdfText('UNITED KINGDOM', 146, 684, 10, 'F1', '1 1 1'),
    pdfRect(432, 704, 134, 36, '0.01 0.01 0.015'),
    pdfStrokeRect(432, 704, 134, 36, '1 1 1', 1),
    pdfText('REQUEST SENT', 446, 716, 13, 'F1', '1 1 1'),
    pdfRect(38, 610, 536, 42, '0.05 0.05 0.06'),
    pdfStrokeRect(38, 610, 536, 42, '0.28 0.28 0.32'),
    pdfText('REFERENCE', 58, 632, 9, 'F1', '0.72 0.72 0.76'),
    pdfText(ticket.ticketCode, 150, 628, 18, 'F1', '1 1 1'),
    pdfText('Booking request reference', 360, 629, 10, 'F2', '0.82 0.82 0.86'),
    renderPdfField('Driver', ticket.racerName, 54, 504),
    renderPdfField('Package', ticket.packageType, 322, 504),
    renderPdfField('Racers', `${ticket.count} racer(s)`, 54, 408),
    renderPdfField('Issued', ticket.date, 322, 408),
    pdfRect(54, 286, 504, 82, '0.035 0.035 0.045'),
    pdfStrokeRect(54, 286, 504, 82, '0.18 0.18 0.2'),
    pdfText('WHAT HAPPENS NEXT', 72, 336, 11, 'F1', '1 1 1'),
    pdfText('1. The Slide City team reviews your enquiry.', 72, 314, 12, 'F2', '0.86 0.86 0.88'),
    pdfText('2. Availability, timings, and race format are confirmed by email.', 72, 294, 12, 'F2', '0.86 0.86 0.88'),
    pdfRect(54, 148, 504, 82, '0.86 0.03 0.05'),
    pdfText('PASS REFERENCE', 72, 204, 10, 'F1', '1 1 1'),
    pdfText(ticket.ticketCode, 72, 174, 28, 'F1', '1 1 1'),
    pdfText('Use this code when speaking', 330, 190, 11, 'F2', '1 1 1'),
    pdfText('with the bookings team.', 330, 170, 11, 'F2', '1 1 1'),
    pdfRect(54, 74, 504, 40, '0.05 0.05 0.06'),
    pdfStrokeRect(54, 74, 504, 40, '0.18 0.18 0.2'),
    pdfText('Email: info@slide-city.co.uk', 72, 94, 12, 'F2', '1 1 1'),
    pdfText('Website: slide-city.co.uk', 352, 94, 12, 'F2', '1 1 1'),
    pdfLine(54, 60, 558, 60, '0.86 0.03 0.05', 2),
    pdfText('This is a booking request reference, not a confirmed admission ticket.', 122, 40, 10, 'F2', '0.72 0.72 0.76'),
    'Q',
  ].join('\n');

  const logoObject = logoHex
    ? `<< /Type /XObject /Subtype /Image /Width 180 /Height 180 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ${
        logoHex.length + 1
      } >>\nstream\n${logoHex}>\nendstream`
    : null;
  const contentObjectNumber = logoObject ? 7 : 6;
  const xObjectResource = logoObject ? ' /XObject << /Logo 6 0 R >>' : '';
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >>${xObjectResource} >> /Contents ${contentObjectNumber} 0 R >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    ...(logoObject ? [logoObject] : []),
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.slice(1).forEach((offset) => {
    pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdf;
};

export default function ContactForm({ selectedPackage, onClearSelectedPackage }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventType: selectedPackage || 'Single Race Pass',
    racerCount: '1',
    message: '',
    agreed: false,
  });

  // Sync state if selectedPackage props changes
  React.useEffect(() => {
    if (selectedPackage) {
      setFormData((prev) => ({ ...prev, eventType: selectedPackage }));
    }
  }, [selectedPackage]);

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isPassSaved, setIsPassSaved] = useState(false);
  const [ticketVoucher, setTicketVoucher] = useState<{
    ticketCode: string;
    racerName: string;
    packageType: string;
    count: string;
    date: string;
  } | null>(null);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Racer name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please provide a valid email structure';
    }
    if (!formData.agreed) errors.agreed = 'You must accept the safety regulations and waivers';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          eventType: formData.eventType,
          racerCount: formData.racerCount,
          message: formData.message,
        }),
      });

      const result = await response.json().catch(() => ({ message: 'Unable to send booking enquiry.' }));

      if (!response.ok) {
        throw new Error(result.message || 'Unable to send booking enquiry.');
      }

      setIsSubmitting(false);
      const generatedCode = `SLC-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketVoucher({
        ticketCode: generatedCode,
        racerName: formData.name,
        packageType: formData.eventType,
        count: formData.racerCount,
        date: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
      });
      setIsPassSaved(false);
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError(error instanceof Error ? error.message : 'Unable to send booking enquiry.');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      eventType: 'Single Race Pass',
      racerCount: '1',
      message: '',
      agreed: false,
    });
    setTicketVoucher(null);
    setSubmitError('');
    setIsPassSaved(false);
    onClearSelectedPackage();
  };

  const handleSavePass = async () => {
    if (!ticketVoucher) return;

    const logoHex = await loadLogoAsJpegHex().catch(() => null);
    const pdf = buildPdfDocument(ticketVoucher, logoHex);
    const blob = new Blob([pdf], { type: 'application/pdf' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = downloadUrl;
    link.download = `${sanitizeFilename(ticketVoucher.ticketCode)}-${sanitizeFilename(ticketVoucher.racerName)}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);

    setIsPassSaved(true);
    setTimeout(() => {
      setIsPassSaved(false);
    }, 3000);
  };

  return (
    <section id="contact" className="relative py-24 bg-zinc-950 overflow-hidden border-t border-zinc-900 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Banner Quick Link heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-red-500 text-xs font-black uppercase tracking-[0.2em] font-mono border border-zinc-850 px-3.5 py-1 bg-zinc-950/40 inline-block">
            READY TO JOIN THE SPEEDWAY?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-display mt-3 italic">
            START YOUR BOOKING
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3 font-sans">
            Submit a booking request or event enquiry and the Slide City team will follow up from info@slide-city.co.uk.
          </p>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left panel: Info cards & Address details */}
          <div className="col-span-1 lg:col-span-4 space-y-6">
            
            {/* Opening Hours Bento card */}
            <div className="bg-zinc-950/25 border border-zinc-855 p-6 rounded-none space-y-4">
              <h3 className="text-white text-xs font-black uppercase tracking-wider font-display flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" /> Opening Track Hours
              </h3>
              
              <div className="space-y-3.5 text-xs text-zinc-350">
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-550 font-bold uppercase text-xs font-mono">MON - THU:</span>
                  <span className="font-medium text-right">12:00 - 22:00</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-red-500 font-black uppercase text-xs font-mono">// FRI - SAT:</span>
                  <span className="font-black text-right text-white">10:00 - Midnight</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-550 font-bold uppercase text-xs font-mono">SUNDAY:</span>
                  <span className="font-medium text-right font-semibold">10:00 - 22:00</span>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-none text-sm text-zinc-400 leading-relaxed font-sans">
                ⚠️ <strong className="text-white">NOTICE:</strong> Advanced race formats run on selected evenings from 20:00. Pro driver checks and safety briefings are completed before track access.
              </div>
            </div>

            {/* Quick Contact Links card */}
            <div className="bg-zinc-950/25 border border-zinc-855 p-6 rounded-none space-y-5">
              <h3 className="text-white text-xs font-black uppercase tracking-wider font-display flex items-center gap-2">
                <Ticket className="w-4 h-4 text-red-500" /> Contact Details
              </h3>

              <div className="space-y-4 text-xs text-zinc-300">
                {/* Address block */}
                <div className="flex items-start gap-4">
                  <div className="bg-zinc-950 p-2.5 rounded-none border border-zinc-850 flex-shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-xs text-zinc-550 font-bold uppercase tracking-widest leading-none font-mono">UK VENUE</h4>
                    <p className="text-zinc-300 mt-1.5 font-medium leading-relaxed font-sans">
                      Slide City, United Kingdom<br />Full venue address coming soon
                    </p>
                  </div>
                </div>

                {/* Telephone block */}
                <div className="flex items-start gap-4">
                  <div className="bg-zinc-950 p-2.5 rounded-none border border-zinc-850 flex-shrink-0">
                    <Phone className="w-3.5 h-3.5 text-red-550" />
                  </div>
                  <div>
                    <h4 className="text-xs text-zinc-550 font-bold uppercase tracking-widest leading-none font-mono">PHONE</h4>
                    <p className="text-zinc-300 mt-1.5 font-medium select-all font-mono text-sm">
                      Phone number coming soon
                    </p>
                  </div>
                </div>

                {/* Email block */}
                <div className="flex items-start gap-4">
                  <div className="bg-zinc-950 p-2.5 rounded-none border border-zinc-850 flex-shrink-0">
                    <Mail className="w-3.5 h-3.5 text-red-550" />
                  </div>
                  <div>
                    <h4 className="text-xs text-zinc-550 font-bold uppercase tracking-widest leading-none font-mono">EMAIL</h4>
                    <a href="mailto:info@slide-city.co.uk" className="text-zinc-300 mt-1.5 font-medium select-all truncate font-mono text-xs block hover:text-red-500 transition-colors">
                      info@slide-city.co.uk
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right panel: Form Input or Ticket result */}
          <div className="col-span-1 lg:col-span-8 bg-zinc-950/20 border border-zinc-855 rounded-none p-6 md:p-8 relative min-h-[460px] flex items-center justify-center">
            
            <AnimatePresence mode="wait">
              {!ticketVoucher ? (
                // BOOKING FORM COMPONENT
                <motion.form
                  key="form-inputs"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleSubmit}
                  className="w-full space-y-5"
                  noValidate
                >
                  <div className="text-left mb-6">
                    <h3 className="text-white text-base font-black uppercase tracking-wider font-display italic">
                      DRIFTER BOOKING DESK
                    </h3>
                    <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed">
                      Provide your details below to request a race slot. Final booking confirmation is sent by the Slide City team.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name-input" className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 font-mono">
                        Racer Full Name:
                      </label>
                      <input
                        type="text"
                        id="name-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full bg-zinc-950 border rounded-none py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 ${
                          formErrors.name ? 'border-red-500 focus:ring-red-550' : 'border-zinc-850 focus:ring-red-650'
                        }`}
                        placeholder="John Smith"
                        disabled={isSubmitting}
                      />
                      {formErrors.name && (
                        <span className="text-xs text-red-550 mt-1.5 block font-bold flex items-center gap-1 font-mono">
                          <AlertCircle className="w-3.5 h-3.5" /> {formErrors.name}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email-input" className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 font-mono">
                        Email Address:
                      </label>
                      <input
                        type="email"
                        id="email-input"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full bg-zinc-950 border rounded-none py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 ${
                          formErrors.email ? 'border-red-500 focus:ring-red-550' : 'border-zinc-850 focus:ring-red-650'
                        }`}
                        placeholder="john@example.co.uk"
                        disabled={isSubmitting}
                      />
                      {formErrors.email && (
                        <span className="text-xs text-red-550 mt-1.5 block font-bold flex items-center gap-1 font-mono">
                          <AlertCircle className="w-3.5 h-3.5" /> {formErrors.email}
                        </span>
                      )}
                    </div>

                    {/* Event Type / Selected Package dropdown */}
                    <div>
                      <label htmlFor="event-type-select" className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 font-mono">
                        Selected Package / Event Type:
                      </label>
                      <select
                        id="event-type-select"
                        value={formData.eventType}
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-none py-3 px-4 text-sm text-white uppercase focus:outline-none focus:ring-1 focus:ring-red-650 cursor-pointer font-mono"
                        disabled={isSubmitting}
                      >
                        <option value="Single Race Pass">Single Race Pass (£25)</option>
                        <option value="Double Race Pack">Double Race Pack (£45)</option>
                        <option value="Group Party Package">Group Party Package (£320)</option>
                        <option value="Corporate Grand Prix">Corporate Grand Prix (£599)</option>
                        <option value="Birthday Parties">Birthday Parties Enquiry</option>
                        <option value="Team Building">Team Building Corporate Day</option>
                        <option value="School Trips / Youth Groups">School / STEM Field Trip</option>
                        <option value="League Competitive Nights">League Night Entry</option>
                        <option value="Private Track Rentals">Exclusive Track Rental</option>
                      </select>
                    </div>

                    {/* Racer Count */}
                    <div>
                      <label htmlFor="racer-count-select" className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 font-mono">
                        Estimated Racers:
                      </label>
                      <select
                        id="racer-count-select"
                        value={formData.racerCount}
                        onChange={(e) => setFormData({ ...formData, racerCount: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-none py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-650 cursor-pointer font-mono"
                        disabled={isSubmitting}
                      >
                        <option value="1">1 Racer</option>
                        <option value="2-4">2 - 4 Racers</option>
                        <option value="5-9">5 - 9 Racers</option>
                        <option value="10-14">10 - 14 Racers</option>
                        <option value="15-24">15 - 24 Racers</option>
                        <option value="25+">25+ Racers (Private Bracket)</option>
                      </select>
                    </div>
                  </div>

                  {/* Message (Optional) */}
                  <div>
                    <label htmlFor="message-area" className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 font-mono">
                      Special requests or driver notes (Optional):
                    </label>
                    <textarea
                      id="message-area"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-none py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-650 min-h-[90px]"
                      placeholder="Let us know of any cake storage, catering additions, or specific timing priorities."
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  {/* Safety Regulation Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-sm select-none">
                      <input
                        type="checkbox"
                        checked={formData.agreed}
                        onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                        className="mt-1 rounded-none border-zinc-850 bg-zinc-950 text-red-600 focus:ring-0 cursor-pointer accent-red-650"
                        disabled={isSubmitting}
                        id="agreed-checkbox"
                      />
                      <span className="text-zinc-400 text-sm leading-relaxed font-medium font-sans">
                        I agree to Slide City’s safety guidelines, including mandatory helmet wear, zero-alcohol rules, closed-toe footwear, and signed safety waivers on arrival.
                      </span>
                    </label>
                    {formErrors.agreed && (
                      <span className="text-xs text-red-550 mt-1.5 block font-bold flex items-center gap-1 font-mono">
                        <AlertCircle className="w-3.5 h-3.5" /> {formErrors.agreed}
                      </span>
                    )}
                  </div>

                  {submitError && (
                    <div className="bg-red-950/30 border border-red-600/40 p-3 text-xs text-red-100 font-medium flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Submit Button console */}
                  <div className="pt-4 border-t border-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {selectedPackage && (
                      <span className="text-xs text-red-500 font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse font-mono">
                        🎯 Selected: "{selectedPackage}"
                      </span>
                    )}
                    
                    <button
                      type="submit"
                      id="contact-form-submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-red-600 hover:bg-red-750 text-white text-xs sm:text-sm font-black uppercase tracking-wide sm:tracking-widest rounded-none transition-all cursor-pointer flex items-center justify-center gap-2 transform -skew-x-12"
                    >
                      <span className="inline-flex skew-x-12 items-center justify-center gap-2 text-center leading-tight font-mono">
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 flex-shrink-0 animate-spin" /> Verifying...
                          </>
                        ) : (
                          <>
                            Reserve My Slot <Send className="w-3.5 h-3.5 flex-shrink-0" />
                          </>
                        )}
                      </span>
                    </button>
                  </div>

                </motion.form>
              ) : (
                // SUCCESS: DIGITAL INTERACTIVE BOOKING REQUEST CONFIRMATION
                <motion.div
                  key="form-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full py-2 space-y-6 text-left"
                >
                  
                  {/* Digital Ticket Container */}
                  <div className="bg-zinc-950 border border-red-655 rounded-none p-6 relative shadow-2xl overflow-hidden text-left bg-checkered bg-blend-soft-light">
                    
                    {/* Glowing aesthetic overlays */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-none border-b border-l border-zinc-900"></div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-red-500 animate-bounce" />
                        <div>
                          <h4 className="text-white text-xs font-black uppercase tracking-widest font-display italic">
                            SLIDE CITY PIT PASS
                          </h4>
                          <span className="text-xs text-zinc-550 font-bold uppercase font-mono">
                            Booking request received
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-white font-mono text-sm font-black text-red-500">
                          {ticketVoucher.ticketCode}
                        </div>
                        <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest block font-mono mt-0.5">
                          ● REQUEST SENT
                        </span>
                      </div>
                    </div>

                    {/* Grid data */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2 text-xs">
                      <div>
                        <span className="text-zinc-[555] font-bold uppercase text-xs tracking-widest block font-mono">
                          CHAMPION DRIVER:
                        </span>
                        <span className="text-white font-black font-display uppercase block mt-1 truncate">
                          {ticketVoucher.racerName}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-[555] font-bold uppercase text-xs tracking-widest block font-mono">
                          LOCKED PACKAGE:
                        </span>
                        <span className="text-red-500 font-black uppercase font-display block mt-1 truncate italic text-xs">
                          {ticketVoucher.packageType}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-[555] font-bold uppercase text-xs tracking-widest block font-mono">
                          DRIVERS QTY:
                        </span>
                        <span className="text-white font-black block text-xs mt-1 font-racing italic">
                          {ticketVoucher.count} RACER(S)
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-[555] font-bold uppercase text-xs tracking-widest block font-mono">
                          ISSUED ON:
                        </span>
                        <span className="text-zinc-300 font-mono font-bold block mt-1">
                          {ticketVoucher.date}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-zinc-900 pt-5 mt-5 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="w-full md:w-3/5 bg-red-600 px-4 py-3 rounded-none text-left">
                        <span className="text-xs text-white/80 font-mono uppercase tracking-wide block">
                          Pass Reference
                        </span>
                        <span className="text-white text-xl sm:text-2xl font-black font-display tracking-tight break-all">
                          {ticketVoucher.ticketCode}
                        </span>
                      </div>

                      <div className="w-full md:w-auto bg-zinc-950 text-left px-3 py-2 rounded-none border border-zinc-900 font-mono text-sm text-zinc-400 leading-relaxed">
                        Use this reference when speaking with the Slide City bookings team.
                      </div>
                    </div>

                  </div>

                  {/* Checklist advice */}
                  <div className="bg-emerald-950/20 border border-emerald-950/30 p-4 rounded-none flex gap-3 text-left">
                    <Flag className="w-4 h-4 text-emerald-450 flex-shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h5 className="text-white text-xs font-black uppercase tracking-wider font-display italic">
                        RESERVATION QUEUED!
                      </h5>
                      <p className="text-zinc-[450] text-sm leading-relaxed mt-0.5 font-sans">
                        Your booking request has been queued. Please arrive <strong>15 minutes before</strong> your confirmed slot to fit helmets, complete the safety briefing, and prepare your driver profile.
                      </p>
                    </div>
                  </div>

                  {/* Control elements */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={handleReset}
                      id="pass-reset-btn"
                      className="py-3.5 px-5 sm:px-6 w-full bg-zinc-900 hover:bg-zinc-850 text-white rounded-none text-xs sm:text-sm uppercase font-extrabold tracking-wide sm:tracking-widest transition-colors flex items-center justify-center gap-1.5 cursor-pointer transform -skew-x-12"
                    >
                      <span className="inline-flex skew-x-12 items-center justify-center gap-1.5 text-center leading-tight font-mono">
                        <RefreshCw className="w-3.5 h-3.5 flex-shrink-0" /> Book Another Pass
                      </span>
                    </button>
                    <button
                      onClick={handleSavePass}
                      id="pass-dl-btn"
                      className={`py-3.5 px-5 sm:px-6 w-full rounded-none text-xs sm:text-sm uppercase font-black tracking-wide transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer transform -skew-x-12 ${
                        isPassSaved 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-red-600 hover:bg-red-750 text-white'
                      }`}
                    >
                      <span className="inline-flex skew-x-12 items-center justify-center gap-1.5 text-center leading-tight font-mono">
                        <Download className="w-3.5 h-3.5 flex-shrink-0" /> {isPassSaved ? 'PASS DOWNLOADED ✓' : 'Save PDF Pass'}
                      </span>
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
}
