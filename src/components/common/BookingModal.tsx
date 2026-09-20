import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../api/client';
import { Service, Booking } from '../../types';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Calendar, CheckCircle2, Clock, DollarSign, Home, Sparkles, Mail } from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { bookingModalOpen, closeBookingModal, bookingPrefill, addToast, navigate } = useAppStore();
  const { user } = useAuthStore();

  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('14:00 - 15:30');
  const [roomType, setRoomType] = useState<string>('Living Room');
  const [approxSqFt, setApproxSqFt] = useState<string>('500');
  const [budget, setBudget] = useState<string>('$50,000 - $75,000');
  const [propertyAddress, setPropertyAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (bookingModalOpen) {
      // Load services
      api.services.getAll().then((res) => {
        if (res.success && res.services.length > 0) {
          setServices(res.services);
          if (bookingPrefill?.serviceId) {
            setSelectedServiceId(bookingPrefill.serviceId);
          } else {
            setSelectedServiceId(res.services[0].id);
          }
        }
      }).catch(console.error);

      // Set defaults from prefill or user
      if (user) {
        setClientName(user.name);
        setClientEmail(user.email);
        setClientPhone(user.phone || '');
      }

      if (bookingPrefill?.roomType) {
        setRoomType(bookingPrefill.roomType);
      }
      if (bookingPrefill?.designTitle) {
        setNotes(`Inspired by portfolio project: ${bookingPrefill.designTitle}`);
      }

      // Default date: 7 days from now
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setDate(d.toISOString().split('T')[0]);
      setConfirmedBooking(null);
    }
  }, [bookingModalOpen, bookingPrefill, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId || !date || !clientName || !clientEmail) {
      addToast({ type: 'error', title: 'Please complete all required fields' });
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedService = services.find((s) => s.id === selectedServiceId);
      const res = await api.bookings.create({
        serviceId: selectedServiceId,
        serviceName: selectedService?.name || 'Interior Design Consultation',
        date,
        timeSlot,
        userName: clientName,
        userEmail: clientEmail,
        userPhone: clientPhone,
        budget,
        notes,
        roomDetails: {
          roomType,
          approxSqFt: Number(approxSqFt) || undefined,
          propertyAddress,
          stylePreference: bookingPrefill?.stylePreference,
        },
      });

      if (res.success && res.booking) {
        setConfirmedBooking(res.booking);
        addToast({
          type: 'success',
          title: 'Consultation Reserved',
          description: 'A confirmation notice has been sent to your email.',
        });
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Booking Submission Failed',
        description: err.message || 'Please verify details and retry.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={bookingModalOpen}
      onClose={closeBookingModal}
      maxWidth="2xl"
      title={confirmedBooking ? 'Consultation Confirmed' : 'Reserve a Design Consultation'}
      description={
        confirmedBooking
          ? 'Your architectural appointment has been registered with our studio team.'
          : 'Meet with our principal architects and interior designers to discuss your project.'
      }
    >
      {confirmedBooking ? (
        <div className="space-y-6 py-2 animate-in fade-in duration-300">
          <div className="p-6 bg-stone-50 border border-stone-200 rounded-xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-serif text-xl font-medium text-stone-900">
              Thank you, {confirmedBooking.userName}
            </h4>
            <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Your consultation for <strong className="text-stone-900">{confirmedBooking.serviceName}</strong> has been scheduled for{' '}
              <strong className="text-stone-900">{confirmedBooking.date}</strong> at <strong className="text-stone-900">{confirmedBooking.timeSlot}</strong>.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-200/60 rounded-full text-xs font-semibold text-stone-700">
              Reference #{confirmedBooking.id}
            </div>
          </div>

          <div className="p-4 bg-amber-50/60 border border-amber-200/70 rounded-lg flex items-start gap-3 text-xs text-amber-950">
            <Mail className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <p>
              An automated confirmation dispatch with prep checklist and studio video link has been forwarded to <strong>{confirmedBooking.userEmail}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="luxury"
              className="flex-1 uppercase text-xs tracking-wider"
              onClick={() => {
                closeBookingModal();
                navigate('dashboard');
              }}
            >
              View in Client Dashboard
            </Button>
            <Button
              variant="outline"
              className="flex-1 uppercase text-xs tracking-wider"
              onClick={closeBookingModal}
            >
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Service Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
              Select Design Offering
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {services.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedServiceId(s.id)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    selectedServiceId === s.id
                      ? 'border-stone-900 bg-stone-900 text-stone-50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-800'
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider leading-snug">{s.name}</p>
                  <p className={`text-xs mt-1 font-mono ${selectedServiceId === s.id ? 'text-amber-200' : 'text-stone-500'}`}>
                    {s.priceRange}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Preferred Date"
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-800"
              >
                <option value="10:00 - 11:30">Morning: 10:00 – 11:30 EST</option>
                <option value="14:00 - 15:30">Afternoon: 14:00 – 15:30 EST</option>
                <option value="16:30 - 18:00">Late Afternoon: 16:30 – 18:00 EST</option>
              </select>
            </div>
          </div>

          {/* Space Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Room Category
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-800"
              >
                <option value="Living Room">Living Room Sanctuary</option>
                <option value="Master Bedroom">Master Bedroom Suite</option>
                <option value="Kitchen">Kitchen & Culinary Island</option>
                <option value="Executive Office">Executive Home Office</option>
                <option value="Primary Bathroom">Spa Bathroom</option>
                <option value="Full Residence">Full Residence / Estate</option>
              </select>
            </div>

            <Input
              label="Approx. Square Footage"
              type="number"
              placeholder="e.g. 650"
              value={approxSqFt}
              onChange={(e) => setApproxSqFt(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Budget Allocation
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-800"
              >
                <option value="$15,000 - $30,000">$15,000 – $30,000</option>
                <option value="$30,000 - $50,000">$30,000 – $50,000</option>
                <option value="$50,000 - $75,000">$50,000 – $75,000</option>
                <option value="$75,000 - $120,000">$75,000 – $120,000</option>
                <option value="$120,000+">$120,000+ (Estate Tier)</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Full Name"
              placeholder="Julian Sterling"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="client@example.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
            />
          </div>

          {/* Location & Vision Notes */}
          <Input
            label="Property Address / Location"
            placeholder="e.g. 74 Mercer St, Penthouse B, New York, NY"
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
          />

          <Textarea
            label="Project Vision & Special Requirements"
            placeholder="Describe your architectural aesthetic, timeline, preferred materials (e.g. natural oak, limewash, travertine), or any specific goals."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <Button type="button" variant="ghost" onClick={closeBookingModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="luxury"
              isLoading={isSubmitting}
              className="px-6 uppercase text-xs tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Confirm Consultation
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
};
