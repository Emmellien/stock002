const express = require('express');
const {db} = require('./config/db');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;


const authRoutes = require('./routers/auth');
const productRoutes = require('./routers/product');
const productinRoutes = require('./routers/productin');
const productoutRoutes = require('./routers/productout');
const reportRoutes = require('./routers/report');


app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/productin', productinRoutes);
app.use('/api/productout', productoutRoutes);
app.use('/api/report', reportRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost${PORT}`);
});