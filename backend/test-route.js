const express = require('express');
const app = express();

const router1 = express.Router();
router1.get('/:id', (req, res) => res.send('router1'));

const router2 = express.Router({ mergeParams: true });
router2.get('/', (req, res) => res.send('router2'));

app.use('/api/bookings', router1);
app.use('/api/bookings/:bookingId/messages', router2);

const request = require('supertest');

request(app)
  .get('/api/bookings/123/messages')
  .end((err, res) => {
    console.log('Result:', res.text);
    process.exit(0);
  });
