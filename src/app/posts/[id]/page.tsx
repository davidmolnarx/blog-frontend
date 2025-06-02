'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/context/AuthContext';
import CommentForm from '@/components/CommentForm';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
  comments?: {
    id: number;
    content: string;
    created_at: string;
    user: {
      id: number;
      name: string;
    };
  }[];
}

export default function PostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error('Error fetching the post', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${id}`);
      router.push('/');
    } catch (err) {
      console.error('Error deleting the post', err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
  
    try {
      await api.delete(`/comments/${commentId}`);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments?.filter((c) => c.id !== commentId),
            }
          : prev
      );
    } catch (err) {
      console.error('Error deleting the comment:', err);
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!post) return <p className="text-center mt-8 text-red-500">Post not found.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 pt-18">
      <main className="w-[70vw] max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-8 relative">
        <Link href="/" className="inline-flex items-center text-gray-700 hover:text-gray-900 transition text-sm mb-4">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back
        </Link>

        <h1 className="text-3xl font-bold text-indigo-700 mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          Written by: {post.user.name} • {new Date(post.created_at).toLocaleString()}
        </p>
        <div className="text-gray-800 whitespace-pre-line mb-8">
          {post.content}
        </div>

        {user?.id === post.user.id && (
          <div className="flex gap-3">
            <button
              aria-label="Edit"
              onClick={() => router.push(`/posts/edit/${post.id}`)}
              className="text-indigo-700 hover:text-indigo-900"
            >
              <PencilIcon className="w-6 h-6" />
            </button>
            <button 
              onClick={handleDelete}
              className="text-indigo-700 hover:text-indigo-900 transition"
              aria-label="Delete"
            >
              <TrashIcon className="w-6 h-6" />
            </button>
          </div>
        )}

        <section className="p-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Comments</h2>
          <CommentForm
            postId={post.id}
            onCommentAdded={(newComment) => {
              setPost((prev) =>
                prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : prev
              );
            }}
          />
          {post.comments && post.comments.length > 0 && (
            <ul className="space-y-4 mt-6">
              {post.comments.map((comment) => {
                const canDelete =
                  user && (user.id === comment.user?.id || user.id === post.user.id);

                return (
                  <li key={comment.id} className="border-t pt-2 relative pb-4">
                    <div className="text-sm text-gray-600 mb-1">
                      <strong>{comment.user?.name ?? 'Guest'}</strong> • {new Date(comment.created_at).toLocaleString()}
                    </div>

                    <p className="text-gray-800">{comment.content}</p>

                    {canDelete && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="absolute bottom-1 right-1 text-red-500 hover:text-red-700 transition text-sm"
                        aria-label="Delete comment"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
