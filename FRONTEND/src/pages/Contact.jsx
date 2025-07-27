import { motion } from 'framer-motion';
import ContactForm from '../components/ContactForm';
import BusinessHours from '../components/BusinessHours';
import ContactInfo from '../components/ContactInfo';

export default function Contact() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Get in touch with us for appointments, questions, or feedback. We're here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ContactForm />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
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

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Visit Us</h2>
            <div className="space-y-4">
              <BusinessHours />
              <ContactInfo />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  </div>
</div>
  );
}