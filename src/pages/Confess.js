import React, { useState } from 'react';

const Confess = () => {
  const [title, setTitle] = useState('');
  const [confession, setConfession] = useState('');
  const [category, setCategory] = useState('general');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confession.trim()) {
      setMessage('Please enter your confession');
      return;
    }
    setIsSubmitting(true);
    setMessage('');
    try {
      const res = await fetch('https://sheetdb.io/api/v1/9mujptibwzyii', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [
            {
              id: Date.now().toString(),
              title: title.trim() || 'Untitled',
              content: confession.trim() || 'No content',
              category: category || 'General',
              timestamp: new Date().toISOString(),
              likes: 0,
              comments: '[]'
            }
          ]
        })
      });
      if (!res.ok) throw new Error('Failed to submit confession');
      setMessage('Confession submitted successfully!');
      setConfession('');
      setCategory('general');
      setTitle('');
    } catch (error) {
      setMessage('Error submitting confession. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen py-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 sm:p-8 border border-white/10 max-w-xs sm:max-w-2xl w-full flex flex-col">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Share Your Confession</h1>
        {message && (
          <div className={`p-4 rounded-md mb-6 ${
            message.includes('Error')
              ? 'bg-red-100 text-red-700 border border-red-300'
              : 'bg-green-100 text-green-700 border border-green-300'
          }`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 flex-1 flex flex-col">
          <div>
            <label htmlFor="title" className="block text-xs sm:text-sm font-medium text-gray-200 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2 sm:px-3 py-2 border border-gray-700 bg-black/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-base sm:text-lg"
              placeholder="Title (e.g. My Secret, A Regret, etc.)"
              maxLength="100"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-gray-200 mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-2 sm:px-3 py-2 border border-gray-700 bg-black/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-base sm:text-lg"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="confession" className="block text-xs sm:text-sm font-medium text-gray-200 mb-2">
              Your Confession
            </label>
            <textarea
              id="confession"
              value={confession}
              onChange={(e) => setConfession(e.target.value)}
              rows="8"
              className="w-full px-2 sm:px-3 py-2 border border-gray-700 bg-black/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-base sm:text-lg resize-none"
              placeholder="Share your thoughts, feelings, or experiences here..."
              maxLength="1000"
              required
            />
            <div className="text-sm text-gray-400 mt-1">
              {confession.length}/1000 characters
            </div>
          </div>
          <div className="bg-purple-900/10 p-4 rounded-md">
            <h3 className="font-medium text-purple-300 mb-2">Privacy Notice</h3>
            <p className="text-sm text-purple-200">
              Your confession will be posted anonymously. No personal information will be shared.
              Please be respectful and considerate of others in your submission.
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform duration-200 disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Confession'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Confess; 