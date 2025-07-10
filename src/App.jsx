import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Carrito from "./pages/Carrito";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import ProductoDetalle from "./pages/ProductoDetalle";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import RutaProtegida from "./components/RutaProtegida";
import Register from "./components/Register";
import Busqueda from './pages/Busqueda';
import Checkout from './pages/Checkout';
import BotonWhatsapp from './components/BotonWhatsapp';


// Paginas de resultado de pago MercadoPago
import Success from './pages/Success';
import Failure from './pages/Failure';
import Pending from './pages/Pending';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} /> 
          <Route path="/admin" element={<RutaProtegida><Admin /></RutaProtegida>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/buscar" element={<Busqueda />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Rutas de resultado de pago MercadoPago */}
          <Route path="/success" element={<Success />} />
          <Route path="/failure" element={<Failure />} />
          <Route path="/pending" element={<Pending />} />
        </Routes>
      </MainLayout>
      <BotonWhatsapp />
    </Router>
    
  );
}

export default App;