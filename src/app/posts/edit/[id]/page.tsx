'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        const post = res.data;

        if (post.user.id !== user?.id) {
          alert('You do not have permission to edit this post.');
          router.push('/');
          return;
        }

        setTitle(post.title);
        setContent(post.content);
      } catch (err) {
        console.error(err);
        setError('Failed to load the post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await api.put(`/posts/${id}`, { title, content });
      router.push(`/posts/${id}`);
    } catch (err) {
      setError('Failed to save the post.');
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8 pt-18">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg">
        <Link href="/" className="inline-flex items-center text-gray-700 hover:text-gray-900 transition text-sm mb-4">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back
        </Link>
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">Edit Post</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Title"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Content"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-48 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-700 text-white py-3 rounded-lg hover:bg-indigo-800 transition duration-200"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
