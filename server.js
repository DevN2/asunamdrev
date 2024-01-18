// Import dan atur server Anda di sini
import express from 'express';
const app = express();

// Contoh endpoint
app.get('/', (req, res) => {
  res.send('Hello from Node.js server!');
});

// Tentukan port
const PORT = process.env.PORT || 3000;

// Mulai server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
