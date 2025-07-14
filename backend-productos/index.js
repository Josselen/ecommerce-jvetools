import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise'; // Cambiado a la versión promise-based
import path from 'path';
import { fileURLToPath } from 'url';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración de __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ecommerce-jvetools.vercel.app'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Conexión a la base de datos con Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'metro.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'QOHqMozGTHFyLZYhHclOviMVblSerThQ',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT || 43129,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  acquireTimeout: 10000
});

// Verificar conexión a la base de datos
const testDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado a la base de datos MySQL');
    connection.release();
    
    // Verificar tablas esenciales
    const [tables] = await pool.query('SHOW TABLES');
    console.log('📊 Tablas disponibles:', tables.map(t => Object.values(t)[0]));
  } catch (err) {
    console.error('❌ Error de conexión a la base de datos:', {
      message: err.message,
      code: err.code,
      host: pool.config.connectionConfig.host,
      port: pool.config.connectionConfig.port
    });
    process.exit(1);
  }
};

testDbConnection();

// Middleware de logging mejorado
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Ruta raíz mejorada
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    dbStatus: pool.pool.config.connectionConfig,
    endpoints: [
      'GET /api/productos',
      'GET /api/categorias',
      'GET /api/usuarios',
      'GET /api/buscar',
      'POST /api/register',
      'POST /api/login',
      'POST /api/google-login',
      'POST /create_preference'
    ]
  });
});

// Ruta de health check mejorada
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime()
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      database: 'disconnected',
      error: err.message
    });
  }
});

// INICIALIZAR MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-5285711695437565-070313-bfe0da3826ac1809d1d8f28cda8cfb5d-286051526',
  options: {
    timeout: 5000,
  }
});

const preference = new Preference(client);

// CATEGORIAS
app.get('/api/categorias', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM categorias');
    res.json(results);
  } catch (err) {
    console.error('Error en GET /api/categorias:', err);
    res.status(500).json({ 
      error: 'Error al obtener categorías',
      details: err.message
    });
  }
});

// PRODUCTOS
app.get('/api/productos', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const offset = (page - 1) * limit;
    const categoriaId = parseInt(req.query.categoria);

    let countSql = 'SELECT COUNT(*) AS total FROM productos';
    let dataSql = 'SELECT * FROM productos';
    const countParams = [];
    const dataParams = [];

    if (!isNaN(categoriaId)) {
      countSql += ' WHERE categoria_id = ?';
      dataSql += ' WHERE categoria_id = ?';
      countParams.push(categoriaId);
      dataParams.push(categoriaId);
    }

    dataSql += ' LIMIT ? OFFSET ?';
    dataParams.push(limit, offset);

    const [[countResult]] = await pool.query(countSql, countParams);
    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);

    const [results] = await pool.query(dataSql, dataParams);

    const productos = results.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      precio_oferta: p.precio_oferta,
      imagen: p.imagen,
      categoria_id: p.categoria_id
    }));

    res.json({ productos, totalPages });
  } catch (err) {
    console.error('Error en GET /api/productos:', err);
    res.status(500).json({ 
      error: 'Error al obtener productos',
      details: err.message
    });
  }
});

// Resto de tus rutas de productos con async/await
app.get('/api/productos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const [results] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    const p = results[0];
    res.json({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      precio_oferta: p.precio_oferta || null,
      imagen: p.imagen,
      categoria_id: p.categoria_id
    });
  } catch (err) {
    console.error('Error en GET /api/productos/:id:', err);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// USUARIOS
app.post('/api/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, password]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      nombre, 
      email, 
      rol: 'user' 
    });
  } catch (err) {
    console.error('Error en POST /api/register:', err);
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    res.status(500).json({ 
      error: 'Error al registrar usuario',
      details: err.message
    });
  }
});

// Resto de tus rutas convertidas a async/await...

// MERCADOPAGO (ya estaba bien)
app.post('/create_preference', async (req, res) => {
  // ... (mantener tu implementación actual)
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('🔥 Error global:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});