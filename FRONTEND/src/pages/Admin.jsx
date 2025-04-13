import { useEffect, useState } from 'react';

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    console.log('Fetching bookings...', bookings);
    try {
      const res = await fetch('http://localhost:4000/disco/bookings/retrieve');
      const data = await res.json();
      
      if (Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else {
        console.error('Unexpected response structure:', data);
        setError('Failed to load booking data');
        setBookings([]);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to connect to the server');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId, index) => {
    // Prevent multiple delete operations at once
    if (deleteLoading !== null) return;
    
    setDeleteLoading(index);
    try {
      const response = await fetch(`http://localhost:4000/disco/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove the booking from the state
        setBookings(prevBookings => 
          prevBookings.filter(booking => booking._id !== bookingId)
        );
      } else {
        const errorData = await response.json();
        console.error('Failed to delete booking:', errorData);
        setError(`Failed to delete booking: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError('Network error while deleting booking');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Helper function to confirm deletion
  const confirmDelete = (booking, index) => {
    if (window.confirm(`Are you sure you want to delete the booking for ${booking.name}?`)) {
      handleDelete(booking._id, index);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Booking Records
          </h1>
          <div className="bg-white rounded-full shadow-md px-4 py-2 text-sm text-indigo-600 font-medium">
            Total: {bookings.length} bookings
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
            <button 
              onClick={() => setError(null)} 
              className="ml-auto text-red-700 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-3"></div>
              <p className="text-gray-500">Fetching booking data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Service</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.length > 0 ? (
                    bookings.map((booking, index) => (
                      <tr key={index} className="hover:bg-indigo-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            {booking.serviceName || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.datetime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => confirmDelete(booking, index)}
                            disabled={deleteLoading === index}
                            className={`text-red-600 hover:text-red-900 focus:outline-none transition-colors duration-150 ${deleteLoading === index ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {deleteLoading === index ? (
                              <span className="inline-block animate-pulse">Deleting...</span>
                            ) : (
                              <span className="flex items-center">
                                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" 
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                                    clipRule="evenodd" 
                                  />
                                </svg>
                                Delete
                              </span>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7" />
                        </svg>
                        <p className="mt-2 text-xl font-medium text-gray-500">No bookings found</p>
                        <p className="mt-1 text-sm text-gray-400">Bookings will appear here when customers make reservations.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;