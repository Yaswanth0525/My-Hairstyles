import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Use localhost for development, production URL for deployment
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:4000'
  : 'https://my-hairstyles.onrender.com';

const services = [
  {
    id: 1,
    name: 'Classic Haircut',
    description: 'Traditional haircut with modern styling',
    price: 70,
    duration: 30,
  },
  {
    id: 2,
    name: 'Beard Trim',
    description: 'Professional beard grooming and shaping',
    price: 50,
    duration: 20,
  },
  {
    id: 3,
    name: 'Hot Towel Shave',
    description: 'Traditional straight razor shave with hot towel treatment',
    price: 60,
    duration: 30,
  },
  {
    id: 4,
    name: 'Hair & Beard Combo',
    description: 'Complete grooming package with haircut and beard trim',
    price: 120,
    duration: 60,
  },
];

function generateSlots(startHour, endHour, intervalMinutes, date) {
  const slots = [];
  const start = new Date(date + 'T' + String(startHour).padStart(2, '0') + ':00:00');
  const end = new Date(date + 'T' + String(endHour).padStart(2, '0') + ':00:00');
  for (let d = new Date(start); d < end; d.setMinutes(d.getMinutes() + intervalMinutes)) {
    slots.push(new Date(d));
  }
  return slots;
}

function isSlotAvailable(slotStart, duration, blocked) {
  const slotEnd = new Date(slotStart.getTime() + duration * 60000);
  return !blocked.some(({ start, end }) => {
    const blockStart = new Date(start);
    const blockEnd = new Date(end);
    return slotStart < blockEnd && slotEnd > blockStart;
  });
}

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const bookingFormRef = useRef(null);

  // Test backend connectivity
  useEffect(() => {
    const testBackend = async () => {
      try {
        console.log('Testing backend connectivity...');
        const response = await fetch(`${API_BASE_URL}/disco/test`);
        const data = await response.json();
        console.log('Backend test response:', data);
      } catch (error) {
        console.error('Backend test failed:', error);
      }
    };
    
    testBackend();
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    }).format(date);
  };

  // Fetch available slots when service or date changes
  useEffect(() => {
    if (!selectedService || !selectedDate) {
      setAvailableSlots([]);
      setSelectedTime(null);
      return;
    }
    const dateStr = selectedDate.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const url = `${API_BASE_URL}/disco/unavailable-slots?date=${dateStr}&serviceName=${encodeURIComponent(selectedService.name)}`;
    
    console.log('Fetching unavailable slots from:', url);
    
    fetch(url)
      .then(res => {
        console.log('Response status:', res.status);
        console.log('Response headers:', res.headers);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Received data:', data);
        if (!data.success) {
          console.log('No success in response, setting empty slots');
          return setAvailableSlots([]);
        }
        const allSlots = generateSlots(7, 20, 30, dateStr); // 7:00 to 20:00, every 30 min
        const filtered = allSlots.filter(slot =>
          isSlotAvailable(slot, selectedService.duration, data.blocked)
        );
        console.log('Filtered available slots:', filtered);
        setAvailableSlots(filtered);
        setSelectedTime(null);
      })
      .catch(err => {
        console.error('Error fetching unavailable slots:', err);
        toast.error('Failed to load available time slots. Please try again.');
        setAvailableSlots([]);
      });
  }, [selectedService, selectedDate]);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedService) {
      newErrors.service = 'Please select a service';
      return false;
    }
    if (!bookingForm.name.trim()) newErrors.name = 'Name is required';
    if (!bookingForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!bookingForm.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(bookingForm.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid Indian phone number (10 digits starting with 6-9)';
    }
    if (!selectedDate) {
      newErrors.date = 'Please select a date';
    }
    if (!selectedTime) {
      newErrors.time = 'Please select a time slot';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const bookingData = {
        datetime: selectedTime, // Use the selected slot
        name: bookingForm.name.trim(),
        email: bookingForm.email.trim(),
        phone: bookingForm.phone.trim(),
        serviceName: selectedService.name,
        serviceDuration: selectedService.duration // <-- Added for backend validation
      };

      const res = await fetch(`${API_BASE_URL}/disco/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
        credentials: 'include',
      });

      const responseText = await res.text();
      if (!res.ok) {
        let errorMessage = 'Failed to confirm booking.';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch {}
        toast.error(errorMessage);
        setSubmitStatus({ type: 'error', message: errorMessage });
        return;
      }

      const data = JSON.parse(responseText);
      if (data.success) {
        toast.success(`Booking for ${selectedService.name} on ${formatDate(new Date(selectedTime))} confirmed!`);
        setSubmitStatus({ type: 'success' });
        setSelectedService(null);
        setSelectedDate(null);
        setBookingForm({ name: '', email: '', phone: '' });
        setAvailableSlots([]);
        setSelectedTime(null);
      } else {
        const errorMessage = data.message || 'Booking failed.';
        toast.error(errorMessage);
        setSubmitStatus({ type: 'error', message: errorMessage });
      }
    } catch (err) {
      toast.error(`Connection error: ${err.message}`);
      setSubmitStatus({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (errors.date) setErrors(prev => ({ ...prev, date: null }));
  };

  const scrollToBookingForm = () => {
    setTimeout(() => {
      bookingFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setErrors({});
    setTimeout(scrollToBookingForm, 100);
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Our Services</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
            {services.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">Rs/- {service.price}</p>
                                              <p className="text-sm text-gray-500 dark:text-gray-400">{service.duration} min</p>
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
              className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
                              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Book {selectedService.name}</h2>

              {submitStatus && (
                <div className={`mb-4 p-3 rounded-md ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select appointment date"
                    className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                </div>
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Available Time Slots</label>
                    {availableSlots.length > 0 ? (
                      <select
                        value={selectedTime || ''}
                        onChange={e => setSelectedTime(e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      >
                        <option value="" disabled>Select a time</option>
                        {availableSlots.map(slot => (
                          <option key={slot.toISOString()} value={slot.toISOString()}>
                            {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-red-600">No available slots for this day.</div>
                    )}
                    {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder='Ex..Yashu'
                    value={bookingForm.name}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder='Ex..yashu@gmail.com'
                    value={bookingForm.email}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={bookingForm.phone}
                    onChange={handleChange}
                    placeholder="10 digits, valid phone number"
                    className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-cyan-500 text-white py-2 rounded-md disabled:bg-cyan-300"
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
                      setAvailableSlots([]);
                      setSelectedTime(null);
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
