import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'bespoke',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sectionData, setSectionData] = useState(null);

  useEffect(() => {
    let active = true;
    api.get('/sections/contact_info')
      .then(res => {
        if (active) {
          setSectionData(res);
        }
      })
      .catch(err => console.error('Failed to load contact info section:', err));

    return () => { active = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    setLoading(true);

    api.post('/contact', {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject,
      message: formData.message.trim()
    })
      .then(res => {
        setSubmitted(true);
        toast.success(res.message || 'Your inquiry was recorded.');
        setFormData({ name: '', email: '', phone: '', subject: 'bespoke', message: '' });
        setLoading(false);
      })
      .catch(err => {
        toast.error(err.message || 'Failed to send message.');
        setLoading(false);
      });
  };

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen select-none">
      <div className="container">

        {/* Header Title */}
        <div className="mb-12 text-center max-w-xl mx-auto flex flex-col gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
            Client Inquiries
          </span>
          <h1 className="font-editorial text-4xl md:text-5xl font-medium text-text-dark">
            Connect With The Studio
          </h1>
          <div className="w-12 h-[1px] bg-accent-gold mt-4 mx-auto" />
        </div>

        {/* Column Splits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-8">

          {/* Left Column: Showroom details */}
          <div className="flex flex-col gap-8">
            {!sectionData ? (
              <div className="flex flex-col gap-6 animate-pulse pr-6">
                <div className="flex flex-col gap-2">
                  <div className="h-6 w-1/2 bg-black/5 rounded-xs" />
                  <div className="h-4 w-full bg-black/5 rounded-xs mt-1" />
                  <div className="h-4 w-5/6 bg-black/5 rounded-xs" />
                </div>
                <div className="flex flex-col gap-5 border-t border-black/5 pt-6 mt-2">
                  <div className="flex gap-4 items-start">
                    <div className="w-5 h-5 bg-black/5 rounded-full" />
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="h-4 w-1/3 bg-black/5 rounded-xs" />
                      <div className="h-3 w-1/2 bg-black/5 rounded-xs" />
                    </div>
                  </div>
                  <div className="flex gap-4 items-start border-t border-black/5 pt-5">
                    <div className="w-5 h-5 bg-black/5 rounded-full" />
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="h-4 w-1/3 bg-black/5 rounded-xs" />
                      <div className="h-3 w-1/2 bg-black/5 rounded-xs" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-editorial text-2xl font-bold mb-2">
                    {sectionData.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {sectionData.description}
                  </p>
                </div>

                <div className="flex flex-col gap-5 border-t border-black/5 pt-6 text-sm">
                  {(sectionData.meta_data?.address_title || sectionData.meta_data?.address_line1) && (
                    <div className="flex items-start gap-4">
                      <MapPin size={18} className="text-accent-gold mt-0.5" />
                      <div>
                        <h4 className="font-bold text-text-dark">
                          {sectionData.meta_data.address_title || 'Atelier Address'}
                        </h4>
                        <p className="text-text-muted mt-1 leading-relaxed">
                          {sectionData.meta_data.address_line1}
                          {sectionData.meta_data.address_line2 && (
                            <>
                              <br />
                              {sectionData.meta_data.address_line2}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {(sectionData.meta_data?.email_title || sectionData.meta_data?.email) && (
                    <div className="flex items-start gap-4 border-t border-black/5 pt-5">
                      <Mail size={18} className="text-accent-gold mt-0.5" />
                      <div>
                        {sectionData.meta_data.email_title && (
                          <h4 className="font-bold text-text-dark">
                            {sectionData.meta_data.email_title}
                          </h4>
                        )}
                        {sectionData.meta_data.email && (
                          <p className="text-text-muted mt-1 font-price-label">
                            {sectionData.meta_data.email}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {(sectionData.meta_data?.phone_title || sectionData.meta_data?.phone) && (
                    <div className="flex items-start gap-4 border-t border-black/5 pt-5">
                      <Phone size={18} className="text-accent-gold mt-0.5" />
                      <div>
                        {sectionData.meta_data.phone_title && (
                          <h4 className="font-bold text-text-dark">
                            {sectionData.meta_data.phone_title}
                          </h4>
                        )}
                        <p className="text-text-muted mt-1 font-price-label">
                          {sectionData.meta_data.phone}
                          {sectionData.meta_data.business_hours && (
                            <>
                              <br />
                              <span className="text-[0.65rem] uppercase tracking-wider font-bold">
                                {sectionData.meta_data.business_hours}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Column: Contact Form */}
          <div className="border border-solid border-black/5 rounded-sm p-6 bg-white shadow-xs">
            {submitted ? (
              <div className="text-center py-12 flex flex-col items-center gap-4 animate-fade-in">
                <CheckCircle size={40} className="text-green-600" />
                <h3 className="font-editorial text-2xl font-bold">Message Transmitted</h3>
                <p className="text-sm text-text-muted max-w-sm leading-relaxed">
                  Thank you for connecting. One of our curator leads will review your inquiry details and get in touch with you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-outline px-6 py-2 text-xs font-bold mt-4"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="font-editorial text-xl font-bold uppercase tracking-wider border-b border-black/5 pb-2 mb-2">
                  Client Request Form
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Full Name</label>
                  <input
                    type="text"
                    required
                    name="name"
                    placeholder="Your Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="py-2 px-3 text-sm rounded-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Email Address</label>
                  <input
                    type="email"
                    required
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="py-2 px-3 text-sm rounded-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Telephone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+880 1XXX-XXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="py-2 px-3 text-sm rounded-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Inquiry Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="py-2 px-3 text-sm rounded-sm"
                  >
                    <option value="bespoke">Bespoke Interior Consulting</option>
                    <option value="custom">Custom Sizing Request</option>
                    <option value="order">Order Logs & Tracking</option>
                    <option value="press">Press & Collaboration</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Inquiry Message</label>
                  <textarea
                    required
                    name="message"
                    rows="5"
                    placeholder="How may our designers assist you?"
                    value={formData.message}
                    onChange={handleChange}
                    className="py-2 px-3 text-sm rounded-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold justify-center py-2.5 font-bold tracking-widest text-xs uppercase mt-2 w-full text-center"
                >
                  {loading ? 'Transmitting...' : 'Transmit Inquiry'}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
export default ContactPage;
