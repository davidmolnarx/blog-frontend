'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/posts', { title, content });
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating the post');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8 pt-18">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg">
        <Link href="/" className="inline-flex items-center text-gray-700 hover:text-gray-900 transition text-sm top-8 left-8">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
        </Link>
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">New Post</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-700 text-white py-3 rounded-lg hover:bg-indigo-800 transition duration-200"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
