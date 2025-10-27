import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// --- THIS IS THE FIX ---
// The 'motion' import was missing, which caused the modal to crash.
import { AnimatePresence, motion } from 'framer-motion';
// --- END FIX ---
import apiClient from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { FiMessageSquare, FiPlus } from 'react-icons/fi';

function ForumListPage() {
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchThreads = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await apiClient.get('/forum/threads');
        setThreads(response.data);
      } catch (err) {
        console.error("Failed to fetch forum threads:", err);
        setError('Could not load forum threads.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchThreads();
  }, []);

  const handleThreadCreated = (newThread) => {
    setThreads(prev => [newThread, ...prev]);
    setIsCreateModalOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Community Forum</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
        >
          <FiPlus /> Start New Discussion
        </button>
      </div>

      {isLoading ? (
        <p className="text-center py-10 text-text-secondary">Loading discussions...</p>
      ) : error ? (
        <p className="text-red-500 bg-red-100 p-4 rounded-lg text-center">{error}</p>
      ) : (
        <div className="bg-surface rounded-xl shadow-md border">
          <div className="divide-y">
            {threads.length > 0 ? threads.map(thread => (
              <Link to={`/app/forum/threads/${thread.id}`} key={thread.id} className="block p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {thread.owner?.full_name ? thread.owner.full_name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="flex-grow">
                    <h2 className="font-semibold text-text-primary">{thread.title}</h2>
                    <p className="text-xs text-text-secondary mt-1">
                      Started by {thread.owner?.full_name || 'Anonymous'} • {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="text-center hidden md:block">
                    <p className="font-bold text-text-primary">{thread.posts?.length || 0}</p>
                    <p className="text-xs text-text-secondary">Replies</p>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="text-center p-10">
                  <FiMessageSquare className="mx-auto text-5xl text-gray-300" />
                  <p className="mt-4 text-text-secondary">No discussions have been started yet.</p>
                  <button onClick={() => setIsCreateModalOpen(true)} className="mt-4 text-primary font-semibold hover:underline">
                      Be the first to start one!
                  </button>
              </div>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateThreadModal
            onClose={() => setIsCreateModalOpen(false)}
            onThreadCreated={handleThreadCreated}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CreateThreadModal({ onClose, onThreadCreated }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!title.trim() || title.length < 3) {
            setError('Title must be at least 3 characters.');
            return;
        }
        if (!content.trim() || content.length < 10) {
            setError('Content must be at least 10 characters.');
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await apiClient.post('/forum/threads', { title, content });
            onThreadCreated(response.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.detail || 'Could not start discussion.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Start a New Discussion</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                {error && <p className="text-red-600 bg-red-100 p-3 rounded mb-4 text-sm border border-red-300">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="threadTitle" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input type="text" id="threadTitle" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary" maxLength="150" required disabled={isSubmitting} />
                    </div>
                    <div>
                        <label htmlFor="threadContent" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                        <textarea id="threadContent" value={content} onChange={(e) => setContent(e.target.value)} rows="5" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary" required disabled={isSubmitting}></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="py-2 px-4 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-sm">Cancel</button>
                        <button type="submit" disabled={isSubmitting || !title.trim() || !content.trim()} className="py-2 px-4 rounded bg-primary text-white hover:bg-green-700 transition disabled:opacity-50 text-sm">{isSubmitting ? 'Posting...' : 'Start Discussion'}</button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}

export default ForumListPage;