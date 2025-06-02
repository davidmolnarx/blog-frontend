'use client';

import { useState } from 'react';
import api from '@/services/api';

interface CommentFormProps {
  postId: number;
  onCommentAdded: (comment: any) => void;
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);

    try {
      const res = await api.post(`posts/${postId}/comments`, {
        content: newComment,
      });

      onCommentAdded(res.data);
      setNewComment('');
    } catch (err) {
      console.error('Error saving the comment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
        rows={3}
        placeholder="Write your comment..."
      ></textarea>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Submit Comment'}
      </button>
    </form>
  );
}
