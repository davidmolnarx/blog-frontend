import Link from 'next/link';
import { ReactNode } from 'react';

type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
};

export default function Button({ href, children, variant = 'primary', onClick }: ButtonProps) {
  const baseClasses = 'py-2 px-4 rounded font-medium transition-colors duration-200';

  const variants = {
    primary: 'bg-indigo-700 text-white hover:bg-indigo-800',
    secondary: 'bg-gray-300 text-gray-800 hover:bg-gray-400',
  };

  const className = `${baseClasses} ${variants[variant]}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}
