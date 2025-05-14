
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  firstName: string | undefined;
  userRole: string | undefined;
}

export function DashboardHeader({ firstName, userRole }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Bienvenido, {firstName || 'Usuario'}
        </p>
      </div>

      {userRole === 'landlord' && (
        <Button asChild>
          <Link to="/dashboard/properties/new">
            <PlusSquare className="mr-2 h-4 w-4" />
            Publicar propiedad
          </Link>
        </Button>
      )}
    </div>
  );
}
