import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, UserIcon, PhoneIcon, EnvelopeIcon, TagIcon } from '@heroicons/react/24/outline';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use localhost for development, production URL for deployment
  const API_BASE_URL = import.meta.env.DEV 
    ? 'http://localhost:4000' 
    : 'https://my-hairstyles.onrender.com';

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/disco/bookings`);

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      case 'cancelled':
        return '🚫';
      default:
        return '📋';
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300">Loading bookings...</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please wait while we fetch your data</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-white/20 dark:border-gray-700"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Bookings</h1>
            </div>
                          <p className="text-gray-600 dark:text-gray-300 text-lg">View all current and past bookings</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20 dark:border-gray-700">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 text-sm font-semibold">📋</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20 dark:border-gray-700">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-300 text-sm font-semibold">⏳</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.filter(b => b.status === 'pending').length}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-8">
        {bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 text-center py-16"
          >
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <CalendarIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No bookings yet</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              No bookings have been made yet. When customers book appointments, they will appear here.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{booking.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                            <span className="mr-1">{getStatusIcon(booking.status)}</span>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{booking.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{booking.phone}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <TagIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{booking.serviceName}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{formatDate(booking.datetime)}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{formatTime(booking.datetime)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings; 