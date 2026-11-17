import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import { validateInquiryForm } from '../utils/portfolio-logic';

interface ContactSectionProps {
  onSubmitInquiry: (data: any) => Promise<boolean>;
  onOpenAdmin?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onSubmitInquiry }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Office Assistant / Graphic Design Project',
    budget: 'Standard',
    timeline: 'Immediate',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateInquiryForm(formData);
    if (!validation.valid) {
      setErrorMessage(validation.errors[0]?.message || 'Please check form fields');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const ok = await onSubmitInquiry(formData);
      if (ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: 'Office Assistant / Graphic Design Project',
          budget: 'Standard',
          timeline: 'Immediate',
          message: '',
        });
      } else {
        setErrorMessage('Failed to submit message to database. Please try again.');
      }
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-10 w-full py-16 lg:py-24 bg-[#FAF8F5]" id="contact">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-12 text-center items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E5DF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6900]" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#FF6900] font-bold">
              Get In Touch
            </span>
          </div>
          <h2 className="text-[34px] sm:text-[44px] font-extrabold text-[#111318] tracking-tight">
            Let's Work Together
          </h2>
          <p className="text-[16px] text-[#5A606D] max-w-xl">
            Looking for a dedicated individual with IT, office, and creative skills? Let's connect and discuss opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Direct Contact Information Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <a
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#E8E5DF] hover:border-[#FF6900]/40 transition-all duration-150 group shadow-xs"
              href="tel:03129547572"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFF2E5] flex items-center justify-center text-[#FF6900] group-hover:scale-110 transition-transform duration-150 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[11px] text-[#717684] uppercase tracking-wider">
                  Direct Phone / WhatsApp
                </span>
                <span className="text-[17px] font-bold text-[#111318] group-hover:text-[#FF6900] transition-colors">
                  03129547572
                </span>
                <span className="text-[12px] text-[#5A606D]">Click to initiate direct call</span>
              </div>
            </a>

            <a
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#E8E5DF] hover:border-[#FF6900]/40 transition-all duration-150 group shadow-xs"
              href="mailto:munazza.00077@gmail.com"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFF2E5] flex items-center justify-center text-[#FF6900] group-hover:scale-110 transition-transform duration-150 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[11px] text-[#717684] uppercase tracking-wider">
                  Official Email
                </span>
                <span className="text-[16px] font-bold text-[#111318] group-hover:text-[#FF6900] transition-colors truncate">
                  munazza.00077@gmail.com
                </span>
                <span className="text-[12px] text-[#5A606D]">Click to compose email</span>
              </div>
            </a>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#E8E5DF] shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#F5F3EF] flex items-center justify-center text-[#111318] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] text-[#717684] uppercase tracking-wider">
                  Location
                </span>
                <span className="text-[17px] font-bold text-[#111318]">Rawalpindi, Pakistan</span>
                <span className="text-[12px] text-[#5A606D]">
                  Available locally and for remote positions
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E8E5DF] flex items-center gap-3 shadow-xs">
              <Clock className="w-5 h-5 text-[#10B981] shrink-0" />
              <span className="font-mono text-[12px] text-[#111318] font-medium">
                Fast response: typically within 24 hours
              </span>
            </div>
          </div>

          {/* Right: Contact Form Card */}
          <div className="lg:col-span-7 p-7 sm:p-10 rounded-[28px] bg-white border border-[#E8E5DF] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            {submitted ? (
              <div className="py-12 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111318]">Message Sent Successfully!</h3>
                <p className="text-sm text-[#5A606D] max-w-md">
                  Thank you for reaching out. Munazza Irfan has received your inquiry and will review it promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#111318] text-white text-xs font-semibold hover:bg-[#232730]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-mono text-[11px] font-bold text-[#5A606D] uppercase"
                      htmlFor="fullName"
                    >
                      Full Name <span className="text-[#FF6900]">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Ayesha Khan"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD7CD] text-[#111318] placeholder:text-[#8A8F9D] text-[14px] focus:bg-white focus:border-[#FF6900] focus:ring-1 focus:ring-[#FF6900] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-mono text-[11px] font-bold text-[#5A606D] uppercase"
                      htmlFor="emailAddress"
                    >
                      Email Address <span className="text-[#FF6900]">*</span>
                    </label>
                    <input
                      id="emailAddress"
                      name="email"
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD7CD] text-[#111318] placeholder:text-[#8A8F9D] text-[14px] focus:bg-white focus:border-[#FF6900] focus:ring-1 focus:ring-[#FF6900] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-mono text-[11px] font-bold text-[#5A606D] uppercase"
                    htmlFor="subject"
                  >
                    Subject / Opportunity Type <span className="text-[#FF6900]">*</span>
                  </label>
                  <input
                    id="subject"
                    name="service"
                    type="text"
                    required
                    placeholder="Office Assistant / Graphic Design Project / Inquiry"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD7CD] text-[#111318] placeholder:text-[#8A8F9D] text-[14px] focus:bg-white focus:border-[#FF6900] focus:ring-1 focus:ring-[#FF6900] focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-mono text-[11px] font-bold text-[#5A606D] uppercase"
                    htmlFor="message"
                  >
                    Message <span className="text-[#FF6900]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Describe your requirements or job details..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD7CD] text-[#111318] placeholder:text-[#8A8F9D] text-[14px] focus:bg-white focus:border-[#FF6900] focus:ring-1 focus:ring-[#FF6900] focus:outline-none transition-colors resize-y"
                  />
                </div>

                {/* Black Pill Submit Button matching Stitch CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#111318] text-white font-bold text-[15px] hover:bg-[#232730] shadow-md hover:shadow-lg transition-all duration-200 mt-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-[#FF6900]" />
                  <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
