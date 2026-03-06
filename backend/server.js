const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://baochaudeptrai300_db_user:ditcumai123@test.xvhjnkx.mongodb.net/mma_shop');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});