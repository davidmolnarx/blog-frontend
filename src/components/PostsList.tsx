'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  content: string;
  user: { id: number; name: string };
  created_at: string;
}

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts');
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching posts', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (err) {
      console.error('Error during deletion', err);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="grid gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition relative flex flex-col"
        >
          <h2 className="text-xl font-semibold text-indigo-700">{post.title}</h2>
          <p className="text-sm text-gray-500 mb-2">by {post.user?.name ?? 'Unknown'}</p>
          <p className="text-gray-700 line-clamp-4 flex-grow">{post.content}</p>

          <div className="flex justify-between items-end mt-4">
            <Link
              href={`/posts/${post.id}`}
              className="text-indigo-600 hover:underline"
            >
              Read more →
            </Link>

            {user?.id === post.user.id && (
              <div className="absolute bottom-4 right-4 flex gap-3">
                <button
                  aria-label="Edit"
                  onClick={() => router.push(`/posts/edit/${post.id}`)}
                  className="text-indigo-700 hover:text-indigo-900"
                >
                  <PencilIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-indigo-700 hover:text-indigo-900 transition"
                  aria-label="Delete"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
