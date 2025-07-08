import { motion } from 'framer-motion'
import { Link } from 'react-router-dom';
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

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[80vh] bg-gradient-to-r from-primary-900 to-primary-800"
        style={{
          backgroundImage: 'url(https://w0.peakpx.com/wallpaper/859/38/HD-wallpaper-barber-shop-shop-barber-rouge-chaise.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
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
              className="text-xl md:text-2xl mb-8"
            >
              Where style meets precision
            </motion.p>
            <motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.6 }}
>
  <Link
    to="/services"
    className="inline-block bg-white text-primary-900 px-8 py-3 rounded-md font-semibold hover:bg-primary-100 transition-colors"
  >
    Book Now
  </Link>
</motion.div>

          </div>
        </div>
      </motion.section>


      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Expert Grooming Services</h2>
              <p className="text-gray-600 mb-6">
                At Modern Cuts, we believe that every haircut tells a story. Our experienced barbers
                are dedicated to helping you look and feel your best with precision cuts, traditional
                hot towel shaves, and modern styling techniques.
              </p>
              <ul className="space-y-4">
                {['Premium Hair Cuts', 'Traditional Hot Shaves', 'Beard Trimming', 'Hair Styling'].map((service) => (
                  <li key={service} className="flex items-center">
                    <svg className="h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Barber Shop Interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.comment}</p>
                <p className="font-semibold">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}