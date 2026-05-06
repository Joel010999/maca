import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { date: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
  const { 
    customerName, 
    customerContact, 
    totalAmount, 
    advancePayment, 
    shippingMethod, 
    shippingAddress, 
    isHomeDelivery, 
    notes, 
    items 
  } = req.body;

  try {
    const balance = totalAmount - advancePayment;
    const order = await prisma.order.create({
      data: {
        customerName,
        customerContact,
        totalAmount,
        advancePayment,
        balance,
        shippingMethod,
        shippingAddress,
        isHomeDelivery,
        notes,
        items: {
          create: items.map((item: any) => ({
            productName: item.productName,
            quantity: item.quantity,
            requiresBlacksmith: item.requiresBlacksmith,
            blacksmithCost: item.blacksmithCost,
          })),
        },
      },
      include: { items: true },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error creating order' });
  }
});

// Update order status (Dispatch)
app.patch('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error updating status' });
  }
});

// Update blacksmith status
app.patch('/api/items/:id/blacksmith', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const item = await prisma.orderItem.update({
      where: { id },
      data: { blacksmithStatus: status },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error updating blacksmith status' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
