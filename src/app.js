const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const paymentReceiptRoutes = require('./routes/paymentReceiptRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/payments', paymentReceiptRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});