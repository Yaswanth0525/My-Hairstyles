import React from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

const contactInfo = {
  phone: '91+ 9963738848',
  email: 'discohairstyles@gmail.com',
  address: 'Opposite Court ,Belagam Parvathipuram - 535501'
};

export default function ContactInfo() {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <PhoneIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 mr-2" />
        <h3 className="font-extrabold text-gray-900 dark:text-white">Contact</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center">
          <PhoneIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
          <span className="text-gray-600 dark:text-gray-300 font-semibold">{contactInfo.phone}</span>
        </div>
        <div className="flex items-center">
          <EnvelopeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
          <span className="text-gray-600 dark:text-gray-300 font-semibold">{contactInfo.email}</span>
        </div>
        <div className="flex items-start">
          <MapPinIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
          <span className="text-gray-600 dark:text-gray-300 font-semibold">{contactInfo.address}</span>
        </div>
      </div>
    </div>
  );
}