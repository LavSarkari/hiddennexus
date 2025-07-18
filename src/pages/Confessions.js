import React, { useEffect, useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';

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

function sortComments(comments) {
  // Sort by recency (newest first)
  return [...comments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

const ThreadedComment = ({ comment, onReplyClick, replyingTo, replyText, onReplyTextChange, onReplySubmit, confessionId, depth = 0 }) => {
  const [showReplies, setShowReplies] = React.useState(true);
  const hasReplies = comment.replies && comment.replies.length > 0;
  // Calculate indentation: max 3 levels for ml-0, ml-4, ml-8, ml-12
  const indentClass = `ml-${Math.min(depth * 4, 12)} pl-2`;
  const borderClass = depth > 0 ? 'border-l-2 border-purple-700/30' : 'border-l-4 border-gray-200 dark:border-gray-700';
  const bgClass = depth > 0 ? 'bg-black/10 dark:bg-white/5 rounded-md' : '';
  // Format timestamp: relative for recent, full for tooltip
  const dateObj = comment.timestamp ? new Date(comment.timestamp) : new Date();
  const relativeTime = formatDistanceToNow(dateObj, { addSuffix: true });
  const fullTime = format(dateObj, 'PPpp');
  return (
    <div className={`${indentClass} ${borderClass} ${bgClass} py-2 mb-2 transition-all`}> {/* Indent by depth */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">{comment.author || 'Anonymous'}</span>
        <span className="text-[11px] text-gray-400 dark:text-gray-500" title={fullTime}>{relativeTime}</span>
      </div>
      <p className="text-gray-800 dark:text-white text-sm break-words mb-2 whitespace-pre-line">{comment.text || comment.content || ''}</p>
      <div className="flex gap-3 items-center mb-1">
        <button className="text-xs text-purple-600 hover:underline" onClick={() => onReplyClick(comment.id)}>
          Reply
        </button>
        {hasReplies && (
          <button className="text-xs text-purple-600 hover:underline" onClick={() => setShowReplies(v => !v)}>
            {showReplies ? 'Hide Replies' : `Show Replies (${comment.replies.length})`}
          </button>
        )}
      </div>
      {replyingTo === comment.id && (
        <form className="flex flex-col sm:flex-row gap-2 items-end mb-2" onSubmit={e => { e.preventDefault(); onReplySubmit(comment, confessionId); }}>
          <textarea
            value={replyText}
            onChange={e => onReplyTextChange(comment.id, e.target.value)}
            rows={2}
            maxLength={500}
            className="flex-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm bg-white dark:bg-black/40 text-gray-900 dark:text-white"
            placeholder="Write a reply..."
            required
          />
          <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm transition-colors">Reply</button>
        </form>
      )}
      {hasReplies && showReplies && (
        <div className="mt-2">
          {sortComments(comment.replies).map(reply => (
            <ThreadedComment
              key={reply.id}
              comment={reply}
              onReplyClick={onReplyClick}
              replyingTo={replyingTo}
              replyText={replyText}
              onReplyTextChange={onReplyTextChange}
              onReplySubmit={onReplySubmit}
              confessionId={confessionId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentThread = ({ comments, showAll, onToggle, confessionId, onReplyClick, replyingTo, replyText, onReplyTextChange, onReplySubmit }) => {
  const sorted = sortComments(comments || []);
  const topComments = sorted.slice(0, 2);
  const hasMore = sorted.length > 2;
  return (
    <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
      {(showAll ? sorted : topComments).map((comment) => (
        <ThreadedComment
          key={comment.id}
          comment={comment}
          onReplyClick={onReplyClick}
          replyingTo={replyingTo}
          replyText={replyText}
          onReplyTextChange={onReplyTextChange}
          onReplySubmit={onReplySubmit}
          confessionId={confessionId}
        />
      ))}
      {hasMore && !showAll && (
        <button
          className="text-xs text-purple-600 hover:underline mt-2"
          onClick={() => onToggle(confessionId)}
        >
          View more comments ({sorted.length - 2} more)
        </button>
      )}
      {showAll && hasMore && (
        <button
          className="text-xs text-purple-600 hover:underline mt-2"
          onClick={() => onToggle(confessionId)}
        >
          Hide comments
        </button>
      )}
      {sorted.length === 0 && (
        <div className="text-gray-400 text-sm">No comments yet. Be the first to share your thoughts!</div>
      )}
    </div>
  );
};

const ConfessionCard = ({
  confession,
  isExpanded,
  onExpand,
  commentText,
  onCommentTextChange,
  onCommentSubmit,
  loadingComment,
  showAllComments,
  onToggleComments,
  onLike,
  liked,
  onReplyClick,
  replyingTo,
  replyText,
  onReplyTextChange,
  onReplySubmit,
}) => {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };
  return (
    <div className="w-full bg-white dark:bg-black/80 border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg p-6 mb-8 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
        <span className="text-xs bg-purple-700/10 text-purple-700 dark:text-purple-200 px-2 py-1 rounded-full capitalize font-semibold">
          {confession.category}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatTimestamp(confession.timestamp)}
        </span>
        {confession.views !== undefined && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium ml-2">
            Viewed {confession.views} times
          </span>
        )}
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-purple-100 mb-2 break-words">{confession.title}</h2>
      <p className="text-base sm:text-lg text-gray-800 dark:text-white/90 whitespace-pre-line mb-4 break-words">
        {confession.content}
      </p>
      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 border-t pt-4 mb-2">
        <button
          className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all duration-200 ${
            liked
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
          }`}
          onClick={() => onLike(confession)}
        >
          <span>❤️</span>
          <span className="text-sm font-medium">{confession.likes}</span>
        </button>
        <span>💬 {confession.comments?.length || 0}</span>
        <button
          className="ml-auto px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors text-xs"
          onClick={onExpand}
        >
          {isExpanded ? 'Hide Comments' : 'Comment'}
        </button>
      </div>
      {isExpanded && (
        <div className="mt-4">
          <CommentThread
            comments={confession.comments}
            showAll={showAllComments}
            onToggle={onToggleComments}
            confessionId={confession.id}
            onReplyClick={onReplyClick}
            replyingTo={replyingTo}
            replyText={replyText}
            onReplyTextChange={onReplyTextChange}
            onReplySubmit={onReplySubmit}
          />
          <form
            className="flex flex-col sm:flex-row gap-2 items-end"
            onSubmit={e => {
              e.preventDefault();
              onCommentSubmit(confession);
            }}
          >
            <textarea
              value={commentText}
              onChange={e => onCommentTextChange(confession.id, e.target.value)}
              rows={2}
              maxLength={500}
              className="flex-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm bg-white dark:bg-black/40 text-gray-900 dark:text-white"
              placeholder="Share your thoughts on this confession..."
              required
            />
            <button
              type="submit"
              disabled={loadingComment || !commentText.trim()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors"
            >
              {loadingComment ? 'Posting...' : 'Post'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const Confessions = () => {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [commentTexts, setCommentTexts] = useState({});
  const [loadingComment, setLoadingComment] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAllComments, setShowAllComments] = useState({});
  const [likedConfessions, setLikedConfessions] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('likedConfessions') || '[]'));
    } catch {
      return new Set();
    }
  });
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});

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
            views: Number(item.views) || undefined,
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

  const handleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleCommentTextChange = (id, value) => {
    setCommentTexts(prev => ({ ...prev, [id]: value }));
  };

  const handleCommentSubmit = async (confession) => {
    const commentText = commentTexts[confession.id]?.trim();
    if (!commentText) return;
    setLoadingComment(true);
    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      timestamp: new Date().toISOString(),
      author: 'Anonymous',
      replies: [],
    };
    const updatedComments = [...(confession.comments || []), newComment];
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
    } finally {
      setLoadingComment(false);
    }
  };

  const handleToggleComments = (confessionId) => {
    setShowAllComments(prev => ({ ...prev, [confessionId]: !prev[confessionId] }));
  };

  const handleLike = async (confession) => {
    const isLiked = likedConfessions.has(confession.id);
    const newLikes = isLiked ? confession.likes - 1 : confession.likes + 1;
    setConfessions(prev => prev.map(c => c.id === confession.id ? { ...c, likes: newLikes } : c));
    setLikedConfessions(prev => {
      const newSet = new Set(prev);
      if (isLiked) newSet.delete(confession.id);
      else newSet.add(confession.id);
      localStorage.setItem('likedConfessions', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
    try {
      await fetch(`https://sheetdb.io/api/v1/9mujptibwzyii/id/${confession.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: newLikes })
      });
    } catch (error) {
      // Revert UI if backend fails
      setConfessions(prev => prev.map(c => c.id === confession.id ? { ...c, likes: confession.likes } : c));
      setLikedConfessions(prev => {
        const newSet = new Set(prev);
        if (isLiked) newSet.add(confession.id);
        else newSet.delete(confession.id);
        localStorage.setItem('likedConfessions', JSON.stringify(Array.from(newSet)));
        return newSet;
      });
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyingTo(commentId);
  };

  const handleReplyTextChange = (commentId, value) => {
    setReplyTexts(prev => ({ ...prev, [commentId]: value }));
  };

  // Recursively add a reply to the correct comment in the tree
  function addReplyToComments(comments, parentId, reply) {
    return comments.map(comment => {
      if (comment.id === parentId) {
        return { ...comment, replies: [...(comment.replies || []), reply] };
      } else if (comment.replies && comment.replies.length > 0) {
        return { ...comment, replies: addReplyToComments(comment.replies, parentId, reply) };
      } else {
        return comment;
      }
    });
  }

  const handleReplySubmit = async (parentComment, confessionId) => {
    const replyText = replyTexts[parentComment.id]?.trim();
    if (!replyText) return;
    const newReply = {
      id: Date.now().toString(),
      text: replyText,
      timestamp: new Date().toISOString(),
      author: 'Anonymous',
      replies: [],
    };
    setConfessions(prev => prev.map(c => {
      if (c.id !== confessionId) return c;
      return {
        ...c,
        comments: addReplyToComments(c.comments, parentComment.id, newReply),
      };
    }));
    setReplyTexts(prev => ({ ...prev, [parentComment.id]: '' }));
    setReplyingTo(null);
    // Save to backend
    const confession = confessions.find(c => c.id === confessionId);
    const updatedComments = addReplyToComments(confession.comments, parentComment.id, newReply);
    try {
      await fetch(`https://sheetdb.io/api/v1/9mujptibwzyii/id/${confessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: JSON.stringify(updatedComments) })
      });
    } catch (error) {
      // Optionally revert UI or show error
    }
  };

  // Filter confessions by selected category
  const filteredConfessions = selectedCategory === 'all'
    ? confessions
    : confessions.filter(c => c.category === selectedCategory);

  return (
    <div className="w-full min-h-screen py-8 bg-gray-50 dark:bg-black flex flex-col items-center">
      <div className="w-full max-w-5xl flex flex-col gap-4 px-2 sm:px-6 md:px-8 lg:px-12 xl:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Latest Confessions</h1>
        {/* Category Filter Bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-1 rounded-full border text-sm font-semibold transition-all duration-150
                ${selectedCategory === cat.value
                  ? 'bg-purple-600 text-white border-purple-600 shadow'
                  : 'bg-white/10 text-purple-700 dark:text-purple-200 border-white/20 hover:bg-purple-700/20 hover:text-white'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {loading && <div className="text-gray-400 dark:text-gray-300">Loading...</div>}
        {error && <div className="text-red-400 mb-4">{error}</div>}
        {!loading && !error && filteredConfessions.length === 0 && (
          <div className="text-gray-400">No confessions yet.</div>
        )}
        <div className="flex flex-col gap-6 w-full">
          {filteredConfessions.map((confession) => (
            <ConfessionCard
              key={confession.id}
              confession={confession}
              isExpanded={expandedId === confession.id}
              onExpand={() => handleExpand(confession.id)}
              commentText={commentTexts[confession.id] || ''}
              onCommentTextChange={handleCommentTextChange}
              onCommentSubmit={handleCommentSubmit}
              loadingComment={loadingComment && expandedId === confession.id}
              showAllComments={!!showAllComments[confession.id]}
              onToggleComments={handleToggleComments}
              onLike={handleLike}
              liked={likedConfessions.has(confession.id)}
              onReplyClick={handleReplyClick}
              replyingTo={replyingTo}
              replyText={replyTexts[replyingTo] || ''}
              onReplyTextChange={handleReplyTextChange}
              onReplySubmit={handleReplySubmit}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Confessions; 