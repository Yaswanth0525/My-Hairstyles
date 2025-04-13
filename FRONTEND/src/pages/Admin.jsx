import { useEffect, useState } from 'react';

function Admin() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('http://localhost:4000/disco/bookings/retive');
        const data = await res.json();
        console.log('Fetched response:', data); 

        // Fix: check for data.bookings
        if (Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else {
          console.error('Unexpected response structure:', data);
          setBookings([]);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setBookings([]);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Booking Records</h1>
      <table className="w-full border border-gray-300 rounded shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Service</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((b, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border p-2">{b.name}</td>
                <td className="border p-2">{b.email}</td>
                <td className="border p-2">{b.serviceName || "N/A"}</td>
                <td className="border p-2">
                  {new Date(b.datetime).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
