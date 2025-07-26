import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

const businessHours = {
  monday_Friday: '7am - 9pm',
  saturday: '7am - 9pm',
  sunday: '7am - 9pm',
  tuesday:'7am - 1pm'
};

export default function BusinessHours() {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <ClockIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 mr-2" />
        <h3 className="font-extrabold text-gray-900 dark:text-white">Hours</h3>
      </div>
      <ul className="text-gray-600 dark:text-gray-300 font-semibold space-y-2">
        <li>Monday - Friday : {businessHours.monday_Friday}</li>
        <li>1st Tuesday : {businessHours.tuesday}</li>
        <li>Saturday : {businessHours.saturday}</li>
        <li>sunday : {businessHours.sunday}</li>
      </ul>
    </div>
  );
}
  