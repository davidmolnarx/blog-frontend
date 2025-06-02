'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/solid';

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      logout();
      router.push('/');
    } catch (err) {
      console.error('Error during logout', err);
    }
  };

  return (
    <Button onClick={handleLogout} variant="secondary">
      Logout
      <ArrowLeftStartOnRectangleIcon className="w-5 h-5 inline-block ml-2" />
    </Button>
  );
}
