// /api/calendar/astromania.js  (Serverless Function en Vercel)
import ical from 'ical-generator';
import { connectDB } from './db.js'
import Event from '../../src/models/Event.model.js'; 

export default async function handler(req, res) {
  await connectDB();

  const events = await Event.find({ published: true }).lean();
  const cal = ical({ name: 'Astromanía – Eventos' /*, timezone: 'America/Santiago'*/ });

  for (const ev of events) {
    cal.createEvent({
      id: String(ev._id),
      start: new Date(ev.start), // usa UTC o setea timezone si defines VTIMEZONE
      end: new Date(ev.end),
      summary: ev.title,
      description: ev.description,
      location: ev.location?.fullAddress ?? ev.location?.name,
      url: `https://astromania-web-nsgx.vercel.app/evento/${ev.slug}`,
    });
  }

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.send(cal.toString());
}
