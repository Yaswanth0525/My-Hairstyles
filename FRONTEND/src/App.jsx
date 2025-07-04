import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Services from './pages/Services'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import { Toaster ,toast} from "sonner";


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster position="bottom-right" richColors />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App