import Image from 'next/image';
import PostsList from '@/components/PostsList';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 pt-18">
      <main className="w-[70vw] max-w-4xl flex flex-col items-center gap-12 bg-white p-10 mt-10 rounded-2xl shadow-lg">
        <Image
          src="/logo.png"
          alt="Logo"
          width={400}
          height={150}
          className="object-contain"
          priority
        />

        <PostsList />
        <div className="flex gap-6 w-full justify-center">
        </div>
      </main>

      <footer className="mt-16 text-gray-600 text-sm">
        <p>Created by David Molnar</p>
      </footer>

      <Link
        href="/posts/new"
        className="fixed bottom-8 right-8 bg-indigo-700 hover:bg-indigo-800 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg transition"
        aria-label="Add new post"
      >
        +
      </Link>
    </div>
  );
}
