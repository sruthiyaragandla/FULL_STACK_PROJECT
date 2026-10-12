const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Booking = require('./models/Booking');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to local MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/homeease')
  .then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });

app.get('/', (req, res) => {
  res.send('Welcome to HomeEase Backend! 🏠');
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'HomeEase API is working!'
  });
});
// Create a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      fullName,
      phone,
      address,
      service,
      price,
      preferredDate,
      preferredTime
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !address ||
      !service ||
      price == null ||
      !preferredDate ||
      !preferredTime
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all booking fields.'
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit phone number.'
      });
    }

    const booking = await Booking.create({
      fullName,
      phone,
      address,
      service,
      price,
      preferredDate,
      preferredTime
    });

    res.status(201).json({
      success: true,
      message: 'Booking saved successfully!',
      booking
    });
  } catch (error) {
    console.error('Booking error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Unable to save booking.'
    });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Fetch bookings error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Unable to fetch bookings.'
    });
  }
});
app.listen(PORT, () => {
  console.log(`HomeEase server running on http://localhost:${PORT}`);
});