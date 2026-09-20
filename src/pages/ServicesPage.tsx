import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { api } from '../api/client';
import { Service } from '../types';
import { Button } from '../components/ui/Button';
import { CheckCircle, Sparkles, Clock, HelpCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { openBookingModal } = useAppStore();
  const [services, setServices] = useState<Service[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    api.services.getAll().then((res) => {
      if (res.success) setServices(res.services);
    }).catch(console.error);
  }, []);

  const faqs = [
    {
      q: 'How does Atelier Luxe source furniture and materials?',
      a: 'We maintain direct relationships with master stonemasons in France and Italy, Japanese joiners, and bespoke European textile mills. All trade concessions (typically 15–35% below retail) are transparently passed through to our clients.',
    },
    {
      q: 'Can consultations occur remotely for international estates?',
      a: 'Yes. While our headquarters are in New York and Paris, over 40% of our commissions are international. We conduct 3D spatial walkthroughs via video conference and perform site visits during framing and final millwork installation.',
    },
    {
      q: 'Do you manage contractor bidding and construction administration?',
      a: 'For our Full Room and Turnkey Estate packages, we provide comprehensive construction documentation, review contractor bids, and conduct scheduled site inspections to ensure our drawings are realized with zero deviation.',
    },
    {
      q: 'What is the standard payment schedule for design services?',
      a: 'Design fees are structured into an initial 50% retainer upon agreement, 25% at schematic design sign-off, and 25% upon final procurement handover.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
          Tailored Engagements
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-light tracking-tight">
          Design Services & Architectural Offerings
        </h1>
        <p className="text-base text-stone-600 font-light leading-relaxed">
          From curated spatial refreshes to complete ground-up interior architecture and custom millwork realization, every package is executed with obsessive precision.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className={`p-8 sm:p-10 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative ${
              service.popular
                ? 'border-stone-900 bg-stone-900 text-stone-50 shadow-xl'
                : 'border-stone-200 bg-white text-stone-900 hover:border-stone-300 shadow-2xs'
            }`}
          >
            {service.popular && (
              <span className="absolute -top-3 left-8 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-300 text-stone-950">
                Most Requested
              </span>
            )}

            <div className="space-y-6">
              <div className="space-y-1">
                <span className={`text-xs uppercase tracking-wider font-semibold ${service.popular ? 'text-amber-200' : 'text-stone-500'}`}>
                  {service.tier}
                </span>
                <h3 className="font-serif text-3xl font-light">{service.name}</h3>
                <p className={`text-xs leading-relaxed font-light ${service.popular ? 'text-stone-300' : 'text-stone-600'}`}>
                  {service.description}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-500/10 border border-stone-500/20 space-y-1">
                <span className="text-[11px] uppercase tracking-wider opacity-75">Estimated Investment</span>
                <p className="font-serif text-2xl font-medium">{service.priceRange}</p>
                <p className="text-xs font-mono opacity-80 flex items-center gap-1.5 pt-1">
                  <Clock className="w-3.5 h-3.5" /> Typical Timeline: {service.duration}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs uppercase tracking-wider font-semibold">Included Deliverables:</h4>
                <ul className="space-y-2 text-xs font-light">
                  {service.deliverables.map((del, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${service.popular ? 'text-amber-300' : 'text-stone-700'}`} />
                      <span className="leading-relaxed">{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Button
                variant={service.popular ? 'luxury' : 'primary'}
                size="lg"
                onClick={() => openBookingModal({ serviceId: service.id, serviceName: service.name })}
                className="w-full uppercase text-xs tracking-wider font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" /> Book This Service
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add-ons Section */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200/90 p-8 sm:p-12 space-y-8">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
            Specialized Additions
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-light">
            Bespoke Architectural Add-Ons
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
            <h4 className="font-serif text-base text-stone-900 font-medium">Bespoke Lighting Schematics</h4>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Circuit-by-circuit cove, accent, and circadian lighting plans for master electricians.
            </p>
            <p className="text-xs font-mono text-stone-800 font-semibold pt-1">From $3,500</p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
            <h4 className="font-serif text-base text-stone-900 font-medium">Custom Millwork Fabrication</h4>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Shop drawings, joinery specs, and hardware schedules for bespoke cabinetry.
            </p>
            <p className="text-xs font-mono text-stone-800 font-semibold pt-1">From $5,000</p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
            <h4 className="font-serif text-base text-stone-900 font-medium">Photorealistic 3D VR Renders</h4>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Ray-traced lighting walkthroughs depicting exact stone, fabric, and sun angles.
            </p>
            <p className="text-xs font-mono text-stone-800 font-semibold pt-1">From $2,800 / room</p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
            <h4 className="font-serif text-base text-stone-900 font-medium">Private Art Advisory</h4>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Access to gallery acquisitions, sculpture placement, and framing curation.
            </p>
            <p className="text-xs font-mono text-stone-800 font-semibold pt-1">From $4,500</p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
            Clarifications
          </span>
          <h2 className="font-serif text-3xl text-stone-900 font-light">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-stone-200 rounded-xl overflow-hidden bg-white"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50"
              >
                <span className="font-serif text-base text-stone-900 font-medium">{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 pt-1 text-xs text-stone-600 font-light leading-relaxed border-t border-stone-100 bg-stone-50/30">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
