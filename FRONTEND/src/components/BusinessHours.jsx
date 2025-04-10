import React from 'react';

const businessHours = {
  monday_Friday: '7am - 9pm',
  saturday: '7am - 9pm',
  sunday: '7am - 9pm',
  tuesday:'7am - 1pm'
};

export default function BusinessHours() {
  return (
    <div>
      <h3 className="font-extrabold text-gray-900 ">Hours</h3>
      <ul className="text-gray-600 font-semibold">
        <li>Monday - Friday : {businessHours.monday_Friday}</li>
        <li>1st Tuesday : {businessHours.tuesday}</li>
        <li>Saturday : {businessHours.saturday}</li>
        <li>sunday : {businessHours.sunday}</li>
      </ul>
    </div>
  );
}
  