import { useState, useEffect } from 'react'
import './App.css'

const services = [
  { icon: '🧹', name: 'Home Cleaning', price: 499, description: 'A spotless home, stress-free.' },
  { icon: '🔧', name: 'Plumbing', price: 299, description: 'Fix leaks and plumbing issues.' },
  { icon: '⚡', name: 'Electrician', price: 349, description: 'Safe and reliable electrical repairs.' },
  { icon: '❄️', name: 'AC Servicing', price: 599, description: 'Stay cool with expert care.' },
  { icon: '🛋️', name: 'Painting', price: 999, description: 'Give your home a fresh look.' },
  { icon: '🔌', name: 'Appliance Repair', price: 399, description: 'Repairs for everyday appliances.' },
]

function App() {
  const [selectedService, setSelectedService] = useState(null)
  const [bookingMessage, setBookingMessage] = useState('')
  const [bookings, setBookings] = useState([])
  const [showBookings, setShowBookings] = useState(false)
 useEffect(() => {
  fetch('http://localhost:5000/api/bookings')
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setBookings(data.bookings)
      }
    })
    .catch((error) => {
      console.error('Error fetching bookings:', error)
    })
}, [])
  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="#">
          <span className="logo-icon">H</span>
          HomeEase
        </a>

        <nav>
          <a href="#services">Services</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <button className="login-button" onClick={() => alert('Login page coming soon!')}>
          Login
        </button>
        <button
  className="primary-button"
  onClick={() => setShowBookings(!showBookings)}
>
  {showBookings ? 'Hide Bookings' : 'My Bookings'}
</button>
      </header>

      <main>
        <section className="hero">
  <div className="hero-content">
    <span className="eyebrow">YOUR HOME, OUR CARE</span>

    <h1>
      Home services,
      <br />
      made <span>easy.</span>
    </h1>

    <p>
      Trusted professionals for all your home needs.
      Book a service in just a few clicks.
    </p>

    <a className="primary-button" href="#services">
      Explore services ↗
    </a>

    <div className="hero-note">
      <span>✓ Verified professionals</span>
      <span>✓ Convenient booking</span>
    </div>
  </div>

  <div className="hero-visual">
    <img
      src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=85"
      alt="Professional cleaning service"
    />
    <div className="hero-badge">
      <span>✨</span>
      <div>
        <strong>Your home, cared for.</strong>
        <p>Simple. Reliable. Convenient.</p>
      </div>
    </div>
  </div>
</section>

        <section className="services-section" id="services">
          <div className="section-heading">
            <div>
              <span className="eyebrow">WHAT DO YOU NEED?</span>
              <h2>Services for every home</h2>
            </div>
            <span className="service-count">06 SERVICES</span>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.name}>
                <div className="service-icon">{service.icon}</div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="card-bottom">
                  <span>From <strong>₹{service.price}</strong></span>
                <button
                  className="book-button"
                  onClick={() => {
                    setSelectedService(service)
                    setBookingMessage('')
                  }}
                >
                  Book ↗
                </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        {selectedService && (
  <section className="booking-section" id="booking">
    <h2>Book {selectedService.name}</h2>
    <p>Starting at ₹{selectedService.price}</p>

    <form
  onSubmit={async (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const bookingData = {
  fullName: formData.get('name'),
  phone: formData.get('phone'),
  address: formData.get('address'),
  service: selectedService.name,
  price: selectedService.price,
  preferredDate: formData.get('date'),
  preferredTime: formData.get('time'),
}

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Booking failed')
      }

      setBookingMessage('Booking successful! 🎉')
    } catch (error) {
      setBookingMessage(error.message || 'Could not submit booking.')
    }
  }}
>
      <label>
        Full name
        <input name="name" required placeholder="Enter your name" />
      </label>

      <label>
        Phone number
        <input
          name="phone"
          type="tel"
          pattern="[0-9]{10}"
          required
          placeholder="10-digit mobile number"
        />
      </label>

      <label>
        Service address
        <textarea name="address" required placeholder="Enter your full address" />
      </label>

      <label>
        Preferred date
        <input
          name="date"
          type="date"
          min={new Date().toLocaleDateString('en-CA')}
          required
        />
      </label>

      <label>
        Preferred time
        <select name="time" required defaultValue="">
          <option value="" disabled>Select a time slot</option>
          <option>9 AM – 12 PM</option>
          <option>12 PM – 3 PM</option>
          <option>3 PM – 6 PM</option>
        </select>
      </label>

      <button className="primary-button" type="submit">
        Submit booking
      </button>

      <button
        className="cancel-button"
        type="button"
        onClick={() => setSelectedService(null)}
      >
        Cancel
      </button>

      {bookingMessage && <p role="status">{bookingMessage}</p>}
    </form>
  </section>
)}
{showBookings && (
  <section className="booking-section">
    <h2>My Bookings</h2>

    {bookings.length === 0 ? (
      <p>No bookings found.</p>
    ) : (
      <div className="service-grid">
        {bookings.map((booking) => (
          <article className="booking-card" key={booking._id}>
            <h3>{booking.serviceName || booking.service}</h3>
            <p>Customer: {booking.fullName || booking.name}</p>
            <p>Phone: {booking.phone}</p>
            <p>Address: {booking.address}</p>
            <p>Price: ₹{booking.price}</p>
            <p>Date: {booking.preferredDate || booking.date}</p>
            <p>Time: {booking.preferredTime || booking.time}</p>
          </article>
        ))}
      </div>
    )}
  </section>
)}
        <section className="how-section" id="how-it-works">
          <span className="eyebrow">SIMPLE & CONVENIENT</span>
          <h2>Your home, taken care of in 3 steps.</h2>

          <div className="steps">
            <div>
              <span>01</span>
              <h3>Choose a service</h3>
              <p>Find the help you need.</p>
            </div>

            <div>
              <span>02</span>
              <h3>Pick a time</h3>
              <p>Choose a convenient slot.</p>
            </div>

            <div>
              <span>03</span>
              <h3>Relax at home</h3>
              <p>Let our professionals help.</p>
            </div>
          </div>
        </section>
      


      </main>

      <footer>
        <a className="logo" href="#"><span className="logo-icon">H</span> HomeEase</a>
        <p>Making home care effortless. © 2026 HomeEase</p>
      </footer>
    </div>
  )
}

export default App