import React from 'react';

const contactInfo = {
  phone: '91+ 9963738848',
  email: 'discohairstyles@gmail.com',
  address: 'Opposite Court ,Belagam Parvathipuram - 535501'
};

export default function ContactInfo() {
  return (
    <div>
      <h3 className="font-extrabold text-gray-900">Contact</h3>
      <ul className="text-gray-600 font-semibold">
        <li>Phone: {contactInfo.phone}</li>
        <li>Email: {contactInfo.email}</li>
        <li>Address: {contactInfo.address}</li>
      </ul>
    </div>
  );
}