import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';

const Dashboard = () => {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'family', label: 'Family' },
    { value: 'work', label: 'Work' },
    { value: 'health', label: 'Health' },
    { value: 'personal', label: 'Personal Growth' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchConfessions();
  }, [filter]);

  const fetchConfessions = async () => {
    try {
      setLoading(true);
      let q = query(collection(db, 'confessions'), orderBy('timestamp', 'desc'));
      
      if (filter !== 'all') {
        q = query(collection(db, 'confessions'), where('category', '==', filter), orderBy('timestamp', 'desc'));
      }

      const querySnapshot = await getDocs(q);
      const confessionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setConfessions(confessionsData);
    } catch (error) {
      console.error('Error fetching confessions:', error);
    } finally {
      setLoading(false);
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

  const filteredConfessions = confessions.filter(confession =>
    confession.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Confessions Dashboard</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search confessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:w-48">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">
            {filteredConfessions.length} confession{filteredConfessions.length !== 1 ? 's' : ''} found
          </p>
          <Link
            to="/confess"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            New Confession
          </Link>
        </div>
      </div>

      {filteredConfessions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No confessions found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Be the first to share a confession!'}
          </p>
          <Link
            to="/confess"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Share Your First Confession
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredConfessions.map((confession) => (
            <div key={confession.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                  {categories.find(cat => cat.value === confession.category)?.label || 'General'}
                </span>
                <span className="text-sm text-gray-500">
                  {formatTimestamp(confession.timestamp)}
                </span>
              </div>
              
              <p className="text-gray-800 mb-4 leading-relaxed">
                {confession.content}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>❤️ {confession.likes || 0}</span>
                  <span>💬 {confession.comments?.length || 0}</span>
                </div>
                <Link
                  to={`/confession/${confession.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Read more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 