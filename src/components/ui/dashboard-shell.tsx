
import React from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Building2, 
  PlusSquare, 
  Heart, 
  CreditCard,
  Bell,
  Settings,
  LogOut,
  User,
  Menu
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { user, userRole, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Obtener iniciales del usuario para el avatar
  const getUserInitials = () => {
    if (!user?.profile) return '';
    
    const firstName = user.profile.first_name || '';
    const lastName = user.profile.last_name || '';
    
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Navegar sin la concha del dashboard
  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  // Definir enlaces de navegación según el rol
  const navigationLinks = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: <Home className="w-5 h-5" />, 
      roles: ['tenant', 'landlord', 'admin']
    },
    { 
      name: 'Mis propiedades', 
      href: '/dashboard/properties', 
      icon: <Building2 className="w-5 h-5" />, 
      roles: ['landlord', 'admin']
    },
    { 
      name: 'Publicar propiedad', 
      href: '/dashboard/properties/new', 
      icon: <PlusSquare className="w-5 h-5" />, 
      roles: ['landlord', 'admin']
    },
    { 
      name: 'Propiedades guardadas', 
      href: '/dashboard/saved', 
      icon: <Heart className="w-5 h-5" />, 
      roles: ['tenant', 'admin']
    },
    { 
      name: 'Suscripción', 
      href: '/dashboard/subscription', 
      icon: <CreditCard className="w-5 h-5" />, 
      roles: ['landlord', 'admin']
    },
    { 
      name: 'Notificaciones', 
      href: '/dashboard/notifications', 
      icon: <Bell className="w-5 h-5" />, 
      roles: ['tenant', 'landlord', 'admin']
    },
    { 
      name: 'Configuración', 
      href: '/dashboard/settings', 
      icon: <Settings className="w-5 h-5" />, 
      roles: ['tenant', 'landlord', 'admin']
    },
  ];

  // Filtrar enlaces según el rol del usuario
  const filteredLinks = navigationLinks.filter(link => 
    link.roles.includes(userRole || 'tenant')
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar para escritorio */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r p-4">
        <div className="flex items-center mb-8">
          <Link to="/" className="text-xl font-bold">
            <span className="text-secondary">Rent</span>
            <span className="text-primary">4</span>
            <span className="text-secondary">U</span>
          </Link>
        </div>

        <nav className="space-y-1 flex-1">
          {filteredLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center py-2 px-3 rounded-md transition-colors",
                location.pathname === link.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {link.icon}
              <span className="ml-3">{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header móvil */}
        <header className="md:hidden sticky top-0 z-10 bg-white border-b h-16 flex items-center justify-between px-4">
          <Link to="/" className="text-xl font-bold">
            <span className="text-secondary">Rent</span>
            <span className="text-primary">4</span>
            <span className="text-secondary">U</span>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-6">
                  <Avatar className="h-9 w-9 mr-2">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {user?.profile?.first_name} {user?.profile?.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <nav className="space-y-1 flex-1">
                  {filteredLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cn(
                        "flex items-center py-2 px-3 rounded-md transition-colors",
                        location.pathname === link.href
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.icon}
                      <span className="ml-3">{link.name}</span>
                    </Link>
                  ))}
                </nav>

                <Button
                  variant="ghost"
                  className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mt-4"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Cerrar sesión
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Contenido de la página */}
        <main className="flex-1 p-4 md:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
