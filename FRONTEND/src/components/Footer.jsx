export default function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-300 ">
      <div className="w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Modern Cuts</h3>
            <p className="text-primary-300">
            Expert haircuts and grooming for gentlemen, kids, and seniors—style for every generation.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Hours</h3>
            <ul className="space-y-2 text-primary-300">
              <li>Monday - Friday: 7am - 8pm</li>
              <li>Saturday - sunday:7am - 9pm</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-2 text-primary-300 ">
              {/* <ul class="list-none space-y-1 text-gray-700"> */}
  <li><strong>Address:</strong> Opposite Court, Belagam</li>
  <li><strong>Location:</strong> Parvathipuram, Andhra Pradesh – 535501</li>
  <li><strong>Phone:</strong> +91 99637 38848</li>
  <li>Email:<a href="mailto:discohairstyles@gmail.com" class="text-blue-600 hover:none">discohairstyles@gmail.com</a></li>
</ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary-800 text-center text-primary-400">
          <p>&copy; {new Date().getFullYear()} Modern Cuts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}