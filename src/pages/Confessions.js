import React, { useEffect, useState } from 'react';
import InfiniteScroll from '../components/InfiniteScroll';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'general', label: 'General' },
  { value: 'personal', label: 'Personal' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'family', label: 'Family' },
  { value: 'work', label: 'Work' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' },
];

const Confessions = () => {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedConfessions, setExpandedConfessions] = useState(new Set());
  const [commentTexts, setCommentTexts] = useState({});
  const [likedConfessions, setLikedConfessions] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchConfessions = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('https://sheetdb.io/api/v1/9mujptibwzyii');
        if (!res.ok) throw new Error('Failed to fetch confessions');
        const data = await res.json();
        const parsed = data.map((item, idx) => {
          let comments = [];
          try {
            if (Array.isArray(item.comments)) comments = item.comments;
            else if (typeof item.comments === 'string' && item.comments.trim()) comments = JSON.parse(item.comments);
          } catch { comments = []; }
          return {
            id: item.id || idx.toString(),
            title: item.title || 'Untitled',
            content: item.content || 'No content',
            category: (item.category || 'General').toLowerCase(),
            timestamp: item.timestamp || '',
            likes: Number(item.likes) || 0,
            comments: Array.isArray(comments) ? comments : [],
          };
        });
        parsed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setConfessions(parsed);
      } catch (err) {
        setError('Could not load confessions.');
      } finally {
        setLoading(false);
      }
    };
    fetchConfessions();
  }, []);

  const toggleExpanded = (confessionId) => {
    setExpandedConfessions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(confessionId)) {
        newSet.delete(confessionId);
      } else {
        newSet.add(confessionId);
      }
      return newSet;
    });
  };

  const handleLike = async (confession) => {
    const isLiked = likedConfessions.has(confession.id);
    const newLikes = isLiked ? confession.likes - 1 : confession.likes + 1;
    setConfessions(prev => prev.map(c => c.id === confession.id ? { ...c, likes: newLikes } : c));
    setLikedConfessions(prev => {
      const newSet = new Set(prev);
      if (isLiked) newSet.delete(confession.id);
      else newSet.add(confession.id);
      return newSet;
    });
    try {
      await fetch(`https://sheetdb.io/api/v1/9mujptibwzyii/id/${confession.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: newLikes })
      });
    } catch (error) {
      setConfessions(prev => prev.map(c => c.id === confession.id ? { ...c, likes: confession.likes } : c));
    }
  };

  const handleComment = async (confession) => {
    const commentText = commentTexts[confession.id]?.trim();
    if (!commentText) return;
    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      timestamp: new Date().toISOString(),
      author: 'Anonymous'
    };
    const updatedComments = [...confession.comments, newComment];
    setConfessions(prev => prev.map(c => c.id === confession.id ? { ...c, comments: updatedComments } : c));
    setCommentTexts(prev => ({ ...prev, [confession.id]: '' }));
    try {
      await fetch(`https://sheetdb.io/api/v1/9mujptibwzyii/id/${confession.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: JSON.stringify(updatedComments) })
      });
    } catch (error) {
      setConfessions(prev => prev.map(c => c.id === confession.id ? { ...c, comments: confession.comments } : c));
    }
  };

  const truncateText = (text, maxLines = 3) => {
    const lines = text.split('\n');
    if (lines.length <= maxLines) return text;
    return lines.slice(0, maxLines).join('\n') + '...';
  };

  // Filter confessions by selected category
  const filteredConfessions = selectedCategory === 'all'
    ? confessions
    : confessions.filter(c => c.category === selectedCategory);

  // Prepare items for InfiniteScroll
  const confessionItems = filteredConfessions.map((c) => ({
    content: (
      <div key={c.id} className="w-full max-w-2xl mx-auto bg-black/40 border border-white/10 rounded-2xl shadow-xl backdrop-blur-lg p-6 mb-8">
        <div className="flex items-center mb-2">
          <span className="text-xs bg-purple-700/30 text-purple-200 px-2 py-1 rounded-full mr-2 capitalize">
            {c.category}
          </span>
          <span className="text-xs text-gray-400">
            {c.timestamp ? new Date(c.timestamp).toLocaleString() : ''}
          </span>
        </div>
        <h2 className="text-xl font-bold text-purple-100 mb-2">{c.title}</h2>
        <div className="mb-4">
          <p className="text-lg text-white/90 whitespace-pre-line">
            {expandedConfessions.has(c.id) ? c.content : truncateText(c.content, 3)}
          </p>
          {c.content.split('\n').length > 3 && (
            <button
              onClick={() => toggleExpanded(c.id)}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium mt-2 transition-colors"
            >
              {expandedConfessions.has(c.id) ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>
        {c.comments && c.comments.length > 0 && (
          <div className="mb-4 bg-black/20 rounded-lg p-3">
            <h4 className="text-sm font-medium text-purple-200 mb-2">Comments ({c.comments.length})</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {c.comments.map((comment) => (
                <div key={comment.id} className="text-sm">
                  <span className="text-purple-300 font-medium">{comment.author || 'Anonymous'}:</span>
                  <span className="text-white/80 ml-2">{comment.text || ''}</span>
                  <span className="text-gray-500 text-xs ml-2">
                    {comment.timestamp ? new Date(comment.timestamp).toLocaleTimeString() : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center space-x-6 mb-4">
          <button
            onClick={() => handleLike(c)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all duration-200 ${
              likedConfessions.has(c.id)
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
            }`}
          >
            <span>❤️</span>
            <span className="text-sm font-medium">{c.likes}</span>
          </button>
          <span className="text-gray-400 text-sm">💬 {c.comments.length}</span>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={commentTexts[c.id] || ''}
            onChange={(e) => setCommentTexts(prev => ({ ...prev, [c.id]: e.target.value }))}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 bg-black/30 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleComment(c)}
          />
          <button
            onClick={() => handleComment(c)}
            disabled={!commentTexts[c.id]?.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
          >
            Comment
          </button>
        </div>
      </div>
    )
  }));

  return (
    <div className="w-full flex justify-center items-start min-h-screen py-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 sm:p-8 border border-white/10 max-w-xs sm:max-w-3xl w-full flex flex-col">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Latest Confessions</h1>
        {/* Category Filter Bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-1 rounded-full border text-sm font-semibold transition-all duration-150
                ${selectedCategory === cat.value
                  ? 'bg-purple-600 text-white border-purple-600 shadow'
                  : 'bg-white/10 text-purple-200 border-white/20 hover:bg-purple-700/20 hover:text-white'}
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {loading && <div className="text-gray-300">Loading...</div>}
        {error && <div className="text-red-400 mb-4">{error}</div>}
        {!loading && !error && confessionItems.length === 0 && (
          <div className="text-gray-400">No confessions yet.</div>
        )}
        <div style={{height: '600px', position: 'relative'}}>
          <InfiniteScroll
            items={confessionItems}
            isTilted={false}
            autoplay={true}
            autoplaySpeed={0.15}
            autoplayDirection="down"
            pauseOnHover={true}
            width="100%"
            maxHeight="600px"
            itemMinHeight={260}
            negativeMargin={-24}
          />
        </div>
      </div>
    </div>
  );
};

export default Confessions; 