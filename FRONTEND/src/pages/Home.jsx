import { motion } from 'framer-motion'
import { Link } from 'react-router-dom';
import barbershopImg from '../images/ShopImage.jpeg';
import { 
  CheckCircleIcon,
  StarIcon,
  ArrowRightIcon,
  CalendarIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const testimonials = [
  {
    name: 'Krishna',
    comment: 'Best haircut I\'ve ever had! The attention to detail is amazing.',
    rating: 5,
  },
  {
    name: 'Satish',
    comment: 'Great atmosphere and professional service. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Yaswanth',
    comment: 'Been coming here for years. They never disappoint!',
    rating: 5,
  },
]

const services = [
  'Premium Hair Cuts',
  'Traditional Hot Shaves', 
  'Beard Trimming',
  'Hair Styling'
];

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-screen bg-gradient-to-r from-primary-900 to-primary-800"
        style={{
          backgroundImage: `url(${barbershopImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative w-full h-full px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="text-white">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              Welcome to Disco
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-gray-200"
            >
              Where style meets precision
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/services"
                className="inline-flex items-center justify-center bg-white text-primary-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Book Now
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-900 transition-colors duration-200"
              >
                <PhoneIcon className="h-5 w-5 mr-2" />
                Contact Us
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <section className="w-full py-16 bg-white dark:bg-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Expert Grooming Services</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                At Modern Cuts, we believe that every haircut tells a story. Our experienced barbers
                are dedicated to helping you look and feel your best with precision cuts, traditional
                hot towel shaves, and modern styling techniques.
              </p>
              <ul className="space-y-4">
                {services.map((service, index) => (
                  <motion.li 
                    key={service} 
                    className="flex items-center text-gray-700 dark:text-gray-300"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CheckCircleIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3 flex-shrink-0" />
                    <span className="font-medium">{service}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <Link
                  to="/services"
                  className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  View Services
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
              </motion.div>
            </motion.div>
            <motion.div 
              className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Barber Shop Interior"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 bg-gray-50 dark:bg-gray-900">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Us</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the perfect blend of tradition and innovation in our modern barber shop
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Expert Barbers',
                description: 'Our skilled professionals have years of experience in creating the perfect look for every client.',
                icon: '👨‍💼'
              },
              {
                title: 'Premium Quality',
                description: 'We use only the finest tools and products to ensure exceptional results every time.',
                icon: '✨'
              },
              {
                title: 'Modern Atmosphere',
                description: 'Enjoy a comfortable and stylish environment designed for your relaxation and satisfaction.',
                icon: '🏠'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 bg-white dark:bg-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 dark:text-gray-300">Don't just take our word for it - hear from our satisfied clients</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed italic">"{testimonial.comment}"</p>
                <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-primary-900 dark:bg-primary-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready for Your Perfect Look?</h2>
            <p className="text-primary-100 mb-8 text-lg">
              Book your appointment today and experience the difference
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="inline-flex items-center justify-center bg-white text-primary-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Book Appointment
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-900 transition-colors duration-200"
              >
                <MapPinIcon className="h-5 w-5 mr-2" />
                Visit Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}