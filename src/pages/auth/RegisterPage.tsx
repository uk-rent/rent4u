
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Card } from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  );
}
