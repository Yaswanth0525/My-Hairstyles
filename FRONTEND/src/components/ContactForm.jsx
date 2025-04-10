import React, { useState } from 'react';
import { toast } from 'sonner';
export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  // const [debugInfo, setDebugInfo] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    // setDebugInfo(null);
    
    try {
      
      const res = await fetch('http://localhost:4000/disco/feedback', {
        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        // Adding credentials for cookies if needed
        credentials: 'include',
      });
      
      // setDebugInfo(prev => `${prev}\nServer responded with status: ${res.status}`);
      
      if (!res.ok) {
        let errorText;
        try {
          errorText = await res.text();
          // setDebugInfo(prev => `${prev}\nError response: ${errorText}`);
        } catch (textError) {
          errorText = "Unable to get error details";
          // setDebugInfo(prev => `${prev}\nFailed to read error response: ${textError}`);
        }
        
        setSubmitStatus({ 
          type: 'error', 
          message: `Server error (${res.status}): ${res.statusText}. Please try again later.` 
        });
        return;
      }
      
      let data;
      try {
        data = await res.json();
        // setDebugInfo(prev => `${prev}\nResponse data: ${JSON.stringify(data)}`);
      } catch (jsonError) {
        // setDebugInfo(prev => `${prev}\nFailed to parse JSON response: ${jsonError}`);
        setSubmitStatus({ 
          type: 'error', 
          message: 'Invalid response from server. Please contact support.' 
        });
        return;
      }
  
      if (data.success) {
        toast.success('Thank you! Your feedback has been submitted successfully.');
        setSubmitStatus({ type: 'success', message: 'Thank you! Your feedback has been submitted successfully.' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data.message || 'Failed to submit feedback. Please try again.' });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      // setDebugInfo(prev => `${prev}\nConnection error: ${err.message}`);
      setSubmitStatus({ 
        type: 'error', 
        message: `Connection error: ${err.message}. Please check if the server is running.` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // For testing without a backend server
  const handleSimulatedSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    // Simulate server delay
    setTimeout(() => {
      setSubmitStatus({ 
        type: 'success', 
        message: 'Form submitted successfully (simulated mode)' 
      });
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
      
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500 outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500 outline-none ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={errors.message ? "true" : "false"}
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
        </div>
        
        <div className="flex flex-col space-y-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyan-500 text-white py-2 rounded-md hover:bg-cyan-600 focus:bg-cyan-600 focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:outline-none transition-colors disabled:bg-cyan-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
}