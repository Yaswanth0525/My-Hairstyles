import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Use localhost for development, production URL for deployment
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:4000' 
  : 'https://my-hairstyles.onrender.com';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [groupedBookings, setGroupedBookings] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error('Please login to access admin panel');
      navigate('/admin/login');
      return;
    }
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/disco/admin/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          toast.error('Session expired. Please login again.');
          navigate('/admin/login');
          return;
        }
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
        setGroupedBookings(data.groupedBookings || {});
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

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/disco/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Booking status updated to ${newStatus}`);
        fetchBookings(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/disco/admin/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Booking deleted successfully');
        fetchBookings(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700';
      case 'accepted':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700';
      case 'cancelled':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'rejected':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
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

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Bookings</h1>
                <p className="text-gray-600 dark:text-gray-300">View and manage all customer bookings</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Total: {bookings.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: 'all', label: 'All', count: bookings.length },
              { key: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
              { key: 'accepted', label: 'Accepted', count: bookings.filter(b => b.status === 'accepted').length },
              { key: 'rejected', label: 'Rejected', count: bookings.filter(b => b.status === 'rejected').length },
              { key: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {filteredBookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <CalendarIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {filter === 'all' ? 'No bookings' : `No ${filter} bookings`}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {filter === 'all' 
                  ? 'No bookings have been made yet.' 
                  : `No ${filter} bookings found.`
                }
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {Object.keys(groupedBookings).length > 0 ? (
              Object.entries(groupedBookings).map(([date, dateBookings], dateIndex) => {
                // Filter bookings by status if filter is not 'all'
                const filteredDateBookings = filter === 'all' 
                  ? dateBookings 
                  : dateBookings.filter(booking => booking.status === filter);
                
                if (filteredDateBookings.length === 0) return null;
                
                return (
                  <motion.div
                    key={date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: dateIndex * 0.1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <CalendarIcon className="h-6 w-6 text-blue-600" />
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {formatDate(date + 'T00:00:00')}
                      </h2>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {filteredDateBookings.length} booking{filteredDateBookings.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      {filteredDateBookings.map((booking, index) => (
                        <motion.div
                          key={booking._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (dateIndex * 0.1) + (index * 0.05) }}
                          className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-3">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {booking.name}
                                  </h3>
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                                    {getStatusIcon(booking.status)}
                                    <span className="ml-1 capitalize">{booking.status}</span>
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                      <EnvelopeIcon className="h-4 w-4" />
                                      <span>{booking.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                      <PhoneIcon className="h-4 w-4" />
                                      <span>{booking.phone}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                      <UserIcon className="h-4 w-4" />
                                      <span className="font-medium">Service:</span>
                                      <span>{booking.serviceName}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                      <ClockIcon className="h-4 w-4" />
                                      <span className="font-medium">Time:</span>
                                      <span>{formatTime(booking.datetime)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="ml-6 flex flex-col space-y-2">
                                {/* Status Update Buttons */}
                                {booking.status === 'pending' && (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleStatusUpdate(booking._id, 'accepted')}
                                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                                    >
                                      <CheckCircleIcon className="h-4 w-4" />
                                      <span>Accept</span>
                                    </button>
                                    <button
                                      onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                                    >
                                      <XCircleIcon className="h-4 w-4" />
                                      <span>Reject</span>
                                    </button>
                                  </div>
                                )}
                                {booking.status === 'accepted' && (
                                  <button
                                    onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                                  >
                                    Cancel
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteBooking(booking._id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {booking.name}
                            </h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              <span className="ml-1 capitalize">{booking.status}</span>
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                <EnvelopeIcon className="h-4 w-4" />
                                <span>{booking.email}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                <PhoneIcon className="h-4 w-4" />
                                <span>{booking.phone}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                <UserIcon className="h-4 w-4" />
                                <span className="font-medium">Service:</span>
                                <span>{booking.serviceName}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                <ClockIcon className="h-4 w-4" />
                                <span className="font-medium">Date & Time:</span>
                                <span>{formatDateTime(booking.datetime)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-6 flex flex-col space-y-2">
                          {/* Status Update Buttons */}
                          {booking.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStatusUpdate(booking._id, 'accepted')}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                                <span>Accept</span>
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                              >
                                <XCircleIcon className="h-4 w-4" />
                                <span>Reject</span>
                              </button>
                            </div>
                          )}
                          {booking.status === 'accepted' && (
                            <button
                              onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteBooking(booking._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                          >
                            <TrashIcon className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings; 