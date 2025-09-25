import express from 'express';
import dotenv from 'dotenv';
import eventRoutes from './routes/EventRoute';
import ticketRoutes from './routes/TicketRoute';
import orderRoutes from './routes/OrderRoute';
import authRoutes from './routes/AuthRoute';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/events', eventRoutes); //TODO: add event routes
app.use('/api/tickets', ticketRoutes); //TODO: add ticket routes
app.use('/api/orders', orderRoutes); //TODO: add order routes
app.use('/api/auth', authRoutes); //TODO: add auth routes

// Default route to check server status
app.get('/', (req, res) => {
  res.send('Ticketing Backend is running');
});

const port = process.env.PORT || 4000; // Use PORT from .env or default to 4000
app.listen(port, () => console.log(`Backend listening: http://localhost:${port}`));
export default app;