import express from 'express';
import agente from './routes/ruta_agente.js';
import cors from 'cors';
const app = express();

// Middlewares  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configurado para permitir archivos locales
app.use(cors({
  origin: [
    'http://localhost:3000',
    'file://',  // Para archivos HTML locales
    'null'      // Para archivos HTML abiertos directamente
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para logging
/*app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});*/

// Servir archivos estáticos
app.use(express.static('public'));

// Rutas
app.use('/agente',agente);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send({message:"Probando"})
});


export default app;