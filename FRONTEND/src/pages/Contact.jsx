import { motion } from 'framer-motion';
import ContactForm from '../components/ContactForm';
import BusinessHours from '../components/BusinessHours';
import ContactInfo from '../components/ContactInfo';

export default function Contact() {
  return (
    <div className="py-12 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ContactForm />

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Embed the Google Map using the correct embed link */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3922.076153928236!2d83.4230408!3d18.7717998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3b79e25ded448b%3A0xab47bd973d01fcb6!2sDisco%20Hair%20Style!5e0!3m2!1sen!2sin!4v1701234567890!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Visit Us</h2>
            <div className="space-y-4">
              <BusinessHours />
              <ContactInfo />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
</div>
  );
}