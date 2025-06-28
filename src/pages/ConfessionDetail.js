import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';

const ConfessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confession, setConfession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'family', label: 'Family' },
    { value: 'work', label: 'Work' },
    { value: 'health', label: 'Health' },
    { value: 'personal', label: 'Personal Growth' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchConfession();
  }, [id]);

  const fetchConfession = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'confessions', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setConfession({ id: docSnap.id, ...docSnap.data() });
      } else {
        setMessage('Confession not found');
      }
    } catch (error) {
      console.error('Error fetching confession:', error);
      setMessage('Error loading confession');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const docRef = doc(db, 'confessions', id);
      await updateDoc(docRef, {
        likes: increment(1)
      });
      
      setConfession(prev => ({
        ...prev,
        likes: (prev.likes || 0) + 1
      }));
    } catch (error) {
      console.error('Error liking confession:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setMessage('Please enter a comment');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const docRef = doc(db, 'confessions', id);
      const newComment = {
        id: Date.now().toString(),
        content: comment.trim(),
        timestamp: new Date(),
        author: 'Anonymous'
      };

      await updateDoc(docRef, {
        comments: arrayUnion(newComment)
      });

      setConfession(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment]
      }));

      setComment('');
      setMessage('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      setMessage('Error adding comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/6 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!confession) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Confession Not Found</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <Link
            to="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
            {categories.find(cat => cat.value === confession.category)?.label || 'General'}
          </span>
          <span className="text-sm text-gray-500">
            {formatTimestamp(confession.timestamp)}
          </span>
        </div>

        <div className="prose max-w-none mb-6">
          <p className="text-gray-800 text-lg leading-relaxed">
            {confession.content}
          </p>
        </div>

        <div className="flex items-center space-x-6 text-sm text-gray-500 border-t pt-4">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 hover:text-red-500 transition-colors"
          >
            <span>❤️</span>
            <span>{confession.likes || 0}</span>
          </button>
          <div className="flex items-center space-x-2">
            <span>💬</span>
            <span>{confession.comments?.length || 0}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Comments</h3>

        {message && (
          <div className={`p-4 rounded-md mb-6 ${
            message.includes('Error') 
              ? 'bg-red-100 text-red-700 border border-red-300' 
              : 'bg-green-100 text-green-700 border border-green-300'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleComment} className="mb-8">
          <div className="mb-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Share your thoughts on this confession..."
              maxLength="500"
            />
            <div className="text-sm text-gray-500 mt-1">
              {comment.length}/500 characters
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        {confession.comments && confession.comments.length > 0 ? (
          <div className="space-y-4">
            {confession.comments.map((comment) => (
              <div key={comment.id} className="border-l-4 border-gray-200 pl-4">
                <p className="text-gray-800 mb-2">{comment.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{comment.author}</span>
                  <span>{formatTimestamp(comment.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">💬</div>
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfessionDetail; 