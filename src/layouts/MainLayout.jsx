import Header from "../components/Header";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import CarritoFlotante from "../components/CarritoFlotante";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Nav />
      <main className="flex-grow">
        {children}
      </main>
      <CarritoFlotante />
      <Footer />
    </div>
  );
}
