
import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import {
  Menu,
  X,
  Home,
  Settings,
  LogOut,
  Bell,
  Search,
  Heart,
  LayoutDashboard,
  FileText,
  Calendar,
  MessageSquare,
  CreditCard,
  Users,
  Building,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getInitials = () => {
    if (!user) return 'U';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <span className="text-xl font-bold text-primary">RentEasy</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="px-4 py-6">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 ${
                    isActive ? 'bg-gray-100 text-primary' : 'text-gray-700'
                  }`
                }
                end
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/properties"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 ${
                    isActive ? 'bg-gray-100 text-primary' : 'text-gray-700'
                  }`
                }
              >
                <Building className="h-5 w-5" />
                <span>Properties</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/bookings"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 ${
                    isActive ? 'bg-gray-100 text-primary' : 'text-gray-700'
                  }`
                }
              >
                <Calendar className="h-5 w-5" />
                <span>Bookings</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/saved"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 ${
                    isActive ? 'bg-gray-100 text-primary' : 'text-gray-700'
                  }`
                }
              >
                <Heart className="h-5 w-5" />
                <span>Saved</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 ${
                    isActive ? 'bg-gray-100 text-primary' : 'text-gray-700'
                  }`
                }
              >
                <MessageSquare className="h-5 w-5" />
                <span>Messages</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/payments"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 ${
                    isActive ? 'bg-gray-100 text-primary' : 'text-gray-700'
                  }`
                }
              >
                <CreditCard className="h-5 w-5" />
                <span>Payments</span>
              </NavLink>
            </li>
          </ul>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 ${
                      isActive ? 'bg-gray-100 text-primary' : 'text-gray-700'
                    }`
                  }
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </NavLink>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="mr-4 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 lg:block">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={`${user?.firstName} ${user?.lastName}`} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
