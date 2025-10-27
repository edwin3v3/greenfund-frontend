import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

function ForumThreadPage() {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState('');

  useEffect(() => {
    const fetchThread = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await apiClient.get(`/forum/threads/${threadId}`);
        setThread(response.data);
        setPosts(response.data.posts || []);
      } catch (err) {
        setError('Could not load discussion.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchThread();
  }, [threadId]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    setIsPosting(true);
    setPostError('');
    try {
      const response = await apiClient.post('/forum/posts', {
        thread_id: parseInt(threadId, 10),
        content: newPostContent
      });
      setPosts(prev => [...prev, response.data]);
      setNewPostContent('');
    } catch (err) {
      setPostError(err.response?.data?.detail || 'Could not post reply.');
    } finally {
      setIsPosting(false);
    }
  };

  if (isLoading) return <p className="text-center mt-8">Loading discussion...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!thread) return <p className="text-center mt-8">Discussion not found.</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Link to="/app/forum" className="text-primary hover:underline mb-4 block">&larr; Back to All Discussions</Link>

      {/* Main Thread Post */}
      <div className="bg-surface p-6 rounded-xl shadow-md mb-6 border">
        <h1 className="text-3xl font-bold text-text-primary mb-4">{thread.title}</h1>
        <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                {thread.owner?.full_name ? thread.owner.full_name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-grow">
                <p className="font-semibold text-text-primary">{thread.owner?.full_name || 'Anonymous'}</p>
                <p className="text-xs text-text-secondary">{formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}</p>
                <p className="text-text-secondary whitespace-pre-wrap mt-3">{thread.content}</p>
            </div>
        </div>
      </div>

      {/* Replies */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-surface p-4 rounded-lg shadow-sm flex items-start gap-4 border">
             <div className="w-10 h-10 rounded-full bg-gray-200 text-text-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
                {post.owner?.full_name ? post.owner.full_name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-grow">
                <div className="flex items-baseline gap-2">
                    <p className="font-semibold text-text-primary">{post.owner?.full_name || 'Anonymous'}</p>
                    <p className="text-xs text-text-secondary">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</p>
                </div>
                <p className="text-text-secondary whitespace-pre-wrap mt-1">{post.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Post Reply Form */}
      <div className="bg-surface p-5 rounded-lg shadow mt-8 border">
        <h3 className="text-xl font-semibold text-text-primary mb-3">Post a Reply</h3>
        {postError && <p className="text-red-500 text-sm mb-2">{postError}</p>}
        <form onSubmit={handlePostSubmit}>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows="4"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
            placeholder="Write your reply..."
            required
          ></textarea>
          <div className="text-right mt-3">
            <button
              type="submit"
              disabled={isPosting || !newPostContent.trim()}
              className="py-2 px-5 rounded-lg bg-primary text-white hover:bg-green-700 transition disabled:opacity-50 font-semibold"
            >
              {isPosting ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default ForumThreadPage;