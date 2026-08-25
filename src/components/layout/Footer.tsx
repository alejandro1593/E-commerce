import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-cream-200/80 border-t border-cream-300/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-neon rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-xl font-bold text-dark-900">E-Commerce</span>
            </div>
            <p className="text-dark-900/60 text-sm">
              Tu tienda en línea de confianza. Los mejores productos al mejor precio.
            </p>
          </div>

          <div>
            <h4 className="text-dark-900 font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/productos" className="text-dark-900/60 hover:text-neon-cyan transition-colors duration-300">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/categorias" className="text-dark-900/60 hover:text-neon-cyan transition-colors duration-300">
                  Categorías
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-dark-900 font-semibold mb-4">Mi Cuenta</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-dark-900/60 hover:text-neon-cyan transition-colors duration-300">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/registro" className="text-dark-900/60 hover:text-neon-cyan transition-colors duration-300">
                  Registrarse
                </Link>
              </li>
              <li>
                <Link to="/mis-ordenes" className="text-dark-900/60 hover:text-neon-cyan transition-colors duration-300">
                  Mis Órdenes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-dark-900 font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-dark-900/60">
              <li>contacto@ecommerce.com</li>
              <li>+1 234 567 890</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream-300/50 mt-8 pt-8 text-center text-sm text-dark-900/40">
          © {new Date().getFullYear()} E-Commerce. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
