import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold text-primary">
              Rent4U
            </Link>
            <div className="flex gap-6">
              <Link 
                to="/properties" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Propiedades
              </Link>
              <Link 
                to="/how-it-works" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Cómo Funciona
              </Link>
              <Link 
                to="/auth/login" 
                className="text-sm font-medium text-primary hover:text-primary/90 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/auth/register" 
                className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Rent4U. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;