import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const services = [
  {
    id: 1,
    name: 'Classic Haircut',
    description: 'Traditional haircut with modern styling',
    price: 70,
    duration: '30 min',
  },
  {
    id: 2,
    name: 'Beard Trim',
    description: 'Professional beard grooming and shaping',
    price: 50,
    duration: '20 min',
  },
  {
    id: 3,
    name: 'Hot Towel Shave',
    description: 'Traditional straight razor shave with hot towel treatment',
    price: 60,
    duration: '25 min',
  },
  {
    id: 4,
    name: 'Hair & Beard Combo',
    description: 'Complete grooming package with haircut and beard trim',
    price: 120,
    duration: '1 hour',
  },
];

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // Create a ref for the booking form
  const bookingFormRef = useRef(null);
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    }).format(date);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Service validation
    if (!selectedService) {
      newErrors.service = 'Please select a service';
      return false;
    }
    
    // Name validation
    if (!bookingForm.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!bookingForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation - Match backend schema validation for Indian numbers
    if (!bookingForm.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(bookingForm.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid Indian phone number (10 digits starting with 6-9)';
    }
    
    // Date validation
    if (!selectedDate) {
      newErrors.date = 'Please select a date and time';
    } else {
      const now = new Date();
      if (selectedDate < now) {
        newErrors.date = 'Please select a future date and time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Format data according to backend expectations
      const bookingData = {
        datetime: selectedDate.toISOString(),
        name: bookingForm.name.trim(),
        email: bookingForm.email.trim(),
        phone: bookingForm.phone.trim(),
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        price: selectedService.price
      };
      
      console.log("Sending booking data:", bookingData);
      
      const res = await fetch('http://localhost:4000/disco/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
        credentials: 'include',
      });
      
      const responseText = await res.text();
      console.log(`Server response (${res.status}):`, responseText);
      
      if (!res.ok) {
        let errorMessage = 'Failed to confirm booking. Please try again.';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }
        
        toast.error(errorMessage);
        setSubmitStatus({ 
          type: 'error', 
          message: errorMessage
        });
        return;
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        const errorMessage = 'Invalid response format from server. Please contact support.';
        toast.error(errorMessage);
        setSubmitStatus({ 
          type: 'error', 
          message: errorMessage 
        });
        return;
      }
  
      if (data.success) {
        toast.success(`Thank you! Your booking for ${selectedService.name} on ${formatDate(selectedDate)} has been confirmed.`);
        setSubmitStatus({ 
          type: 'success'
        });
        // Reset form
        setSelectedService(null);
        setSelectedDate(null);
        setBookingForm({ name: '', email: '', phone: '' });
      } else {
        const errorMessage = data.message || 'Failed to confirm booking. Please try again.';
        toast.error(errorMessage);
        setSubmitStatus({ 
          type: 'error', 
          message: errorMessage 
        });
      }
    } catch (err) {
      const errorMessage = `Connection error: ${err.message}. Please check your internet connection or try again later.`;
      toast.error(errorMessage);
      console.error("Fetch error:", err);
      setSubmitStatus({ 
        type: 'error', 
        message: errorMessage 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: null }));
    }
  };
  
  // Function to determine if a time slot should be disabled
  const filterTimeSlots = (time) => {
    const day = time.getDay();
    const hours = time.getHours();
    
    // Disable Sundays (0) and time slots outside business hours (9 AM - 6 PM)
    return day !== 0 && hours >= 7 && hours <= 20;
  };

  // Function to scroll to the booking form
  const scrollToBookingForm = () => {
    if (bookingFormRef.current) {
      // Add a slight delay to ensure the form is rendered before scrolling
      setTimeout(() => {
        bookingFormRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  // Handle service selection and scroll to form
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setErrors({});
    
    // Scroll to the form after rendering
    setTimeout(scrollToBookingForm, 100);
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center mb-12">Our Services</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
            {services.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{service.name}</h3>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">Rs/- {service.price}</p>
                      <p className="text-sm text-gray-500">{service.duration}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleServiceSelect(service)}
                    className="w-full bg-cyan-500 text-white py-2 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {selectedService && (
            <motion.div
              ref={bookingFormRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Book {selectedService.name}</h2>
              
              {submitStatus && (
                <div className={`mb-4 p-3 rounded-md ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {submitStatus.message}
                </div>
              )}
              
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Date and Time
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeIntervals={30}
                    filterTime={filterTimeSlots}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select appointment date and time"
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500 outline-none ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                  {selectedDate && (
                    <p className="mt-1 text-sm text-gray-600">
                      Your appointment: {formatDate(selectedDate)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={bookingForm.name}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500 outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    aria-invalid={errors.name ? "true" : "false"}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={bookingForm.email}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={bookingForm.phone}
                    onChange={handleChange}
                    placeholder="10 digits, starting with 6-9"
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500 outline-none ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    aria-invalid={errors.phone ? "true" : "false"}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-cyan-500 text-white py-2 rounded-md hover:bg-cyan-600 focus:bg-cyan-600 focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:outline-none transition-colors disabled:bg-cyan-300 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
                <div className="text-center">
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedService(null);
                      setErrors({});
                      setSubmitStatus(null);
                    }}
                    className="text-cyan-600 hover:text-cyan-800 text-sm font-medium"
                  >
                    Cancel and go back
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}