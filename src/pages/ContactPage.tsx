import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { api } from '../api/client';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { MapPin, Phone, Mail, Clock, Send, Sparkles, Calculator } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { openBookingModal, addToast } = useAppStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('New Project Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Estimator Widget State
  const [scope, setScope] = useState<'single' | 'full' | 'estate'>('full');
  const [estimatedSqFt, setEstimatedSqFt] = useState<number>(1200);

  const calculateEstimate = () => {
    switch (scope) {
      case 'single':
        return { fee: '$12,000 – $22,000', timeline: '4 – 8 weeks', tier: 'Essential Spatial Styling' };
      case 'full':
        return { fee: '$35,000 – $65,000', timeline: '3 – 6 months', tier: 'Full Residence Transformation' };
      case 'estate':
        return { fee: '$80,000 – $160,000+', timeline: '6 – 14 months', tier: 'Turnkey Architectural Estate' };
    }
  };

  const estimate = calculateEstimate();

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast({ type: 'error', title: 'Please complete name, email, and message' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.inquiries.submit({
        name,
        email,
        phone,
        subject,
        message,
      });

      if (res.success) {
        setSubmitted(true);
        addToast({
          type: 'success',
          title: 'Inquiry Dispatched',
          description: 'Our lead studio registrar will reach out within 24 business hours.',
        });
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'Could not send inquiry', description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
          Communications & Showroom
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-light tracking-tight">
          Inquire or Visit Our Studio
        </h1>
        <p className="text-base text-stone-600 font-light leading-relaxed">
          Whether commissioning a private estate or seeking material samples at our Soho gallery, we invite you to connect with our architectural team.
        </p>
      </div>

      {/* Main Grid: Form + Studio Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left 7 Cols: Inquiry Form */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-stone-200/90 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif text-2xl text-stone-900 font-light">
              Send a Studio Inquiry
            </h3>
            <p className="text-xs text-stone-500 font-light">
              Submit your project scope and our design directors will review feasibility and timelines.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-stone-50 rounded-xl border border-stone-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl text-stone-900 font-medium">Message Received</h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                Thank you, {name}. A member of our architectural team has received your brief and will connect with you at {email}.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="uppercase text-xs tracking-wider"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmitInquiry} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  placeholder="Julian Sterling"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="julian@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Telephone (Optional)"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Subject / Project Nature
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-800"
                  >
                    <option value="Residential Interior Commission">Residential Interior Commission</option>
                    <option value="Full Architectural Remodel">Full Architectural Remodel</option>
                    <option value="Commercial / Boutique Hospitality">Commercial / Boutique Hospitality</option>
                    <option value="Press & Publication Inquiry">Press & Publication Inquiry</option>
                    <option value="General Question">General Inquiry</option>
                  </select>
                </div>
              </div>

              <Textarea
                label="Project Narrative & Scope"
                placeholder="Please describe your property location, square footage, desired design direction, and target timeline..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
              />

              <div className="pt-2 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => openBookingModal()}
                  className="text-xs uppercase tracking-wider text-amber-900"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Or book a consultation directly
                </Button>

                <Button
                  type="submit"
                  variant="luxury"
                  isLoading={isSubmitting}
                  className="uppercase text-xs tracking-wider"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" /> Dispatch Inquiry
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Right 5 Cols: Showroom & Project Estimator */}
        <div className="lg:col-span-5 space-y-6">
          {/* Showroom Card */}
          <div className="bg-stone-900 text-stone-100 p-8 rounded-2xl border border-stone-800 space-y-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                Studio Location
              </span>
              <h3 className="font-serif text-2xl font-light text-white">Soho Design Showroom</h3>
            </div>

            <div className="space-y-4 text-xs text-stone-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Atelier Luxe Headquarters</p>
                  <p className="text-stone-400">74 Mercer Street, 4th Floor</p>
                  <p className="text-stone-400">Soho, New York, NY 10012</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">+1 (212) 840-7200</p>
                  <p className="text-stone-400">Direct studio line & material library</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">inquiries@atelierlux.com</p>
                  <p className="text-stone-400">Client registrar & press desk</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Showroom Viewing Hours</p>
                  <p className="text-stone-400">Monday – Friday: 09:00 – 18:00 EST</p>
                  <p className="text-stone-400">Saturdays: By private invitation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Scope & Fee Estimator Widget */}
          <div className="bg-stone-50 border border-stone-200/90 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-stone-900">
              <Calculator className="w-4 h-4 text-amber-900" />
              <h4 className="font-serif text-lg font-medium">Quick Scope & Fee Estimator</h4>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-stone-600 block">
                Select Scope:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setScope('single')}
                  className={`py-1.5 px-2 text-xs rounded border transition-all cursor-pointer ${
                    scope === 'single'
                      ? 'bg-stone-900 text-stone-50 border-stone-900 font-semibold'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  Single Room
                </button>
                <button
                  type="button"
                  onClick={() => setScope('full')}
                  className={`py-1.5 px-2 text-xs rounded border transition-all cursor-pointer ${
                    scope === 'full'
                      ? 'bg-stone-900 text-stone-50 border-stone-900 font-semibold'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  Multi-Room
                </button>
                <button
                  type="button"
                  onClick={() => setScope('estate')}
                  className={`py-1.5 px-2 text-xs rounded border transition-all cursor-pointer ${
                    scope === 'estate'
                      ? 'bg-stone-900 text-stone-50 border-stone-900 font-semibold'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  Full Estate
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Recommended Tier:</span>
                <strong className="text-stone-900">{estimate.tier}</strong>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Estimated Architectural Fee:</span>
                <strong className="text-amber-950 font-mono text-sm">{estimate.fee}</strong>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Expected Delivery Timeline:</span>
                <span className="font-mono text-stone-800">{estimate.timeline}</span>
              </div>
            </div>

            <Button
              variant="luxury"
              size="sm"
              onClick={() => openBookingModal()}
              className="w-full uppercase text-xs tracking-wider mt-2"
            >
              Book Consultation for this Scope
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
