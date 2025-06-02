'use client';

import Image from 'next/image';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import { ArrowRightStartOnRectangleIcon, UserPlusIcon } from '@heroicons/react/24/solid';

export default function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-200 text-white px-6 py-4 flex justify-between items-center z-50 shadow-md">
      <Link href="/">
        <div className="flex items-center gap-2 cursor-pointer">
          <Image src="/logo.png" alt="Logo" width={64} height={64} />
        </div>
      </Link>

      <div className="flex gap-4">
        {isAuthenticated ? (
          <LogoutButton />
        ) : (
          <>
            <Button href="/login" variant="primary">
              Login
              <ArrowRightStartOnRectangleIcon className="w-5 h-5 inline-block ml-2" />
            </Button>
            <Button href="/register" variant="secondary">
              Join
              <UserPlusIcon className="w-5 h-5 inline-block ml-2" />
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
