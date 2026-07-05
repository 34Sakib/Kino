import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { Button } from '../shared/Button';

export const ShippingForm = ({ onSubmit }) => {
  const { shippingAddress, updateShippingAddress, user } = useUserStore();

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    zip: '',
    country: 'United States',
    phone: '',
    shippingMethod: 'standard'
  });

  // Auto-populate from persisted user storage if exists
  useEffect(() => {
    if (shippingAddress) {
      setFormData((prev) => ({
        ...prev,
        ...shippingAddress
      }));
    }
  }, [shippingAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMethodChange = (method) => {
    setFormData((prev) => ({ ...prev, shippingMethod: method }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save to store
    updateShippingAddress({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      apartment: formData.apartment,
      city: formData.city,
      zip: formData.zip,
      country: formData.country,
      phone: formData.phone
    });

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      
      {/* Contact Section */}
      <div className="flex flex-col gap-3">
        <h4 className="font-editorial text-lg font-bold border-b border-black/5 pb-2 mb-1">
          Contact Details
        </h4>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Email Address</label>
          <input
            type="email"
            name="email"
            required
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            className="py-2 px-3 text-sm rounded-sm"
          />
        </div>
      </div>

      {/* Shipping Address Section */}
      <div className="flex flex-col gap-3">
        <h4 className="font-editorial text-lg font-bold border-b border-black/5 pb-2 mb-1">
          Shipping Address
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">First Name</label>
            <input
              type="text"
              name="firstName"
              required
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              className="py-2 px-3 text-sm rounded-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Last Name</label>
            <input
              type="text"
              name="lastName"
              required
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              className="py-2 px-3 text-sm rounded-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Street Address</label>
          <input
            type="text"
            name="address"
            required
            placeholder="123 Atelier Street"
            value={formData.address}
            onChange={handleChange}
            className="py-2 px-3 text-sm rounded-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Apartment, suite, etc. (optional)</label>
          <input
            type="text"
            name="apartment"
            placeholder="Apt 4B"
            value={formData.apartment}
            onChange={handleChange}
            className="py-2 px-3 text-sm rounded-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">City</label>
            <input
              type="text"
              name="city"
              required
              placeholder="New York"
              value={formData.city}
              onChange={handleChange}
              className="py-2 px-3 text-sm rounded-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">ZIP / Postal Code</label>
            <input
              type="text"
              name="zip"
              required
              placeholder="10001"
              value={formData.zip}
              onChange={handleChange}
              className="py-2 px-3 text-sm rounded-sm font-price-label"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="py-2 px-3 text-sm rounded-sm"
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="France">France</option>
              <option value="Italy">Italy</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="(555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
              className="py-2 px-3 text-sm rounded-sm font-price-label"
            />
          </div>
        </div>
      </div>

      {/* Shipping Method Section */}
      <div className="flex flex-col gap-3">
        <h4 className="font-editorial text-lg font-bold border-b border-black/5 pb-2 mb-1">
          Shipping Method
        </h4>
        
        <div className="flex flex-col gap-3">
          <div
            onClick={() => handleMethodChange('standard')}
            className={`p-4 border rounded-sm flex items-center justify-between cursor-pointer transition-all duration-300 ${
              formData.shippingMethod === 'standard'
                ? 'border-accent-gold bg-bg-light/20 shadow-sm'
                : 'border-black/10 hover:border-black/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={formData.shippingMethod === 'standard'}
                onChange={() => {}}
                className="w-4 h-4 accent-accent-gold"
              />
              <div>
                <p className="text-sm font-bold text-text-dark">Standard Ground Delivery</p>
                <p className="text-xs text-text-muted">Arrives in 4-7 business days</p>
              </div>
            </div>
            <span className="text-sm font-bold font-price-label text-accent-gold uppercase tracking-wide">
              Complimentary
            </span>
          </div>

          <div
            onClick={() => handleMethodChange('express')}
            className={`p-4 border rounded-sm flex items-center justify-between cursor-pointer transition-all duration-300 ${
              formData.shippingMethod === 'express'
                ? 'border-accent-gold bg-bg-light/20 shadow-sm'
                : 'border-black/10 hover:border-black/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={formData.shippingMethod === 'express'}
                onChange={() => {}}
                className="w-4 h-4 accent-accent-gold"
              />
              <div>
                <p className="text-sm font-bold text-text-dark">Priority Express Delivery</p>
                <p className="text-xs text-text-muted">Arrives in 1-2 business days</p>
              </div>
            </div>
            <span className="text-sm font-bold font-price-label text-text-dark">
              $15.00
            </span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="gold"
        fullWidth
        className="py-3 font-bold mt-2"
      >
        Continue to Payment
      </Button>

    </form>
  );
};
export default ShippingForm;
