import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
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
    ? ['https://ecommerce-jvetools.vercel.app'] // dominio de Vercel (sin barra final)
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '18325929',
  database: process.env.DB_NAME || 'tienda',
  port: process.env.DB_PORT || 3306
});

db.connect(err => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos:', err.message);
  } else {
    console.log('✅ Conectado a la base de datos');
  }
});

// Logging simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/productos',
      'GET /api/categorias',
      'GET /api/buscar',
      'POST /api/register',
      'POST /api/login',
      'POST /api/google-login',
      'POST /create_preference'
    ]
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
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
app.get('/api/categorias', (req, res) => {
  db.query('SELECT * FROM categorias', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener categorías' });
    res.json(results);
  });
});

// PRODUCTOS
app.get('/api/productos', (req, res) => {
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

  db.query(countSql, countParams, (err, countResult) => {
    if (err) return res.status(500).json({ error: 'Error al contar productos' });
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(dataSql, dataParams, (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al obtener productos' });

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
    });
  });
});

app.get('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  db.query('SELECT * FROM productos WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener el producto' });
    if (results.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    
    const p = results[0];
    const producto = {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      precio_oferta: p.precio_oferta || null,
      imagen: p.imagen,
      categoria_id: p.categoria_id
    };
    res.json(producto);
  });
});

app.get('/api/buscar', (req, res) => {
  const busqueda = req.query.q;
  if (!busqueda || !busqueda.trim()) return res.status(400).json({ error: 'Falta término de búsqueda' });

  const sql = 'SELECT * FROM productos WHERE name LIKE ?';
  const term = `%${busqueda.trim()}%`;
  db.query(sql, [term], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la búsqueda' });

    const productos = results.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      precio_oferta: p.precio_oferta,
      imagen: p.imagen,
      categoria_id: p.categoria_id
    }));

    res.json(productos);
  });
});

app.post('/api/productos', (req, res) => {
  const { name, description, price, precio_oferta, imagen, categoria_id } = req.body;
  if (!name || !price || !categoria_id) {
    return res.status(400).json({ error: 'Name, price y categoria_id son requeridos' });
  }

  const sql = `
    INSERT INTO productos
      (name, description, price, precio_oferta, imagen, categoria_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [name, description, price, precio_oferta, imagen, categoria_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al crear producto' });
    res.status(201).json({
      id: result.insertId,
      name,
      description,
      price,
      precio_oferta,
      imagen,
      categoria_id
    });
  });
});

app.put('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description, price, precio_oferta, imagen, categoria_id } = req.body;
  if (!name || !price || !categoria_id) {
    return res.status(400).json({ error: 'Name, price y categoria_id son requeridos' });
  }

  const sql = `
    UPDATE productos
    SET name = ?, description = ?, price = ?, precio_oferta = ?, imagen = ?, categoria_id = ?
    WHERE id = ?
  `;
  db.query(sql, [name, description, price, precio_oferta, imagen, categoria_id, id], err => {
    if (err) return res.status(500).json({ error: 'Error al actualizar producto' });
    res.json({ message: 'Producto actualizado correctamente' });
  });
});

app.delete('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.query('DELETE FROM productos WHERE id = ?', [id], err => {
    if (err) return res.status(500).json({ error: 'Error al eliminar el producto' });
    res.json({ message: 'Producto eliminado correctamente' });
  });
});

// Rutas de compatibilidad (redirigen a /api/)
app.get('/productos', (req, res) => {
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

  db.query(countSql, countParams, (err, countResult) => {
    if (err) return res.status(500).json({ error: 'Error al contar productos' });
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(dataSql, dataParams, (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al obtener productos' });

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
    });
  });
});

app.get('/categorias', (req, res) => {
  db.query('SELECT * FROM categorias', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener categorías' });
    res.json(results);
  });
});

// USUARIOS
app.post('/api/register', (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) return res.status(400).json({ error: 'Faltan datos requeridos' });

  const sql = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
  db.query(sql, [nombre, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
    res.status(201).json({ id: result.insertId, nombre, email, rol: 'user' });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error del servidor' });
    if (results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

    const user = results[0];
    if (user.password !== password) return res.status(401).json({ error: 'Contraseña incorrecta' });

    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol || 'user',
      metodo: 'email'
    });
  });
});

app.post('/api/google-login', (req, res) => {
  const { nombre, email, googleId } = req.body;
  if (!email || !googleId) return res.status(400).json({ error: 'Faltan datos obligatorios' });

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error del servidor' });

    if (results.length > 0) {
      const user = results[0];
      if (!user.googleId) {
        db.query('UPDATE usuarios SET googleId = ? WHERE id = ?', [googleId, user.id], upErr => {
          if (upErr) return res.status(500).json({ error: 'Error al actualizar usuario' });
          res.json({ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol || 'user', metodo: 'google' });
        });
      } else {
        res.json({ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol || 'user', metodo: 'google' });
      }
    } else {
      db.query('INSERT INTO usuarios (nombre, email, googleId) VALUES (?, ?, ?)', [nombre, email, googleId], (inErr, result) => {
        if (inErr) return res.status(500).json({ error: 'Error al crear usuario' });
        res.status(201).json({ id: result.insertId, nombre, email, rol: 'user', metodo: 'google' });
      });
    }
  });
});

// MERCADOPAGO
app.post('/create_preference', async (req, res) => {
  const { carrito, nombre, email, direccion, baseUrl } = req.body;

  console.log('📦 Datos recibidos:', { carrito, nombre, email, direccion, baseUrl });

  if (!carrito || carrito.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío' });
  }

  if (!nombre || !email || !direccion) {
    return res.status(400).json({ error: 'Faltan datos del comprador' });
  }

  const frontendUrl = baseUrl || process.env.FRONTEND_URL || 'http://localhost:5173';
  console.log('🌐 URL base detectada:', frontendUrl);

  const items = carrito.map(item => {
    const title = item.name || item.nombre || 'Producto';
    const quantity = parseInt(item.cantidad) || 1;
    const unitPrice = parseFloat(item.precio || item.price) || 0;

    return {
      title: title,
      quantity: quantity,
      currency_id: 'ARS',
      unit_price: unitPrice,
    };
  });

  const preferenceData = {
    items: items,
    payer: {
      name: nombre,
      email: email,
    },
    back_urls: {
      success: `${frontendUrl}/success`,
      failure: `${frontendUrl}/failure`, 
      pending: `${frontendUrl}/pending`
    },
    external_reference: `order_${Date.now()}`,
    statement_descriptor: "Tu Tienda"
  };

  try {
    const response = await preference.create({
      body: preferenceData
    });
    
    console.log('✅ Preferencia creada exitosamente:', response.id);
    
    res.json({ 
      id: response.id,
      sandbox_init_point: response.sandbox_init_point,
      init_point: response.init_point,
      status: 'success'
    });
    
  } catch (error) {
    console.error('❌ Error al crear preferencia:', error);
    res.status(500).json({ 
      error: 'Error al crear preferencia de pago',
      details: error.message || 'Error desconocido'
    });
  }
});

app.post('/webhook', (req, res) => {
  console.log('🔔 Webhook recibido:', req.body);
  res.status(200).send('OK');
});

// Servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});