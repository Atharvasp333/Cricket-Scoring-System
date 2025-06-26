import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OldNews = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://gnews.io/api/v4/search?q=cricket&apikey=9914b00bb34f7028b046b8586de86393');
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setNewsData(data.articles ? data.articles.slice(7) : []);
      } catch (err) {
        setError('Could not load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-[#16638A] hover:text-[#0F4C75] font-semibold">← Back</button>
        <h1 className="text-3xl font-bold text-[#16638A] mb-8 text-center">Previous Cricket News</h1>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#16638A]"></div>
            <span className="ml-4 text-[#16638A] font-medium">Loading news...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 font-semibold py-8">{error}</div>
        ) : newsData.length === 0 ? (
          <div className="text-center text-gray-500 font-medium py-8">No previous news available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsData.map((item, index) => (
              <div
                key={item.url || item.title}
                className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer fade-in`}
                onClick={() => window.open(item.url, '_blank')}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className={`bg-gradient-to-br from-[#16638A] to-[#0F4C75] flex items-center justify-center text-white h-32`}>
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="object-cover w-full h-full" style={{ maxHeight: '8rem' }} />
                  ) : (
                    <span className="text-5xl">📰</span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs px-2 py-1 bg-[#74D341] text-white rounded-full font-medium">
                      {item.source?.name || 'News'}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 leading-tight text-lg">{item.title}</h3>
                  {item.description && <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{item.description}</p>}
                  <div className="flex justify-end">
                    <span className="text-[#16638A] text-sm font-semibold hover:text-[#0F4C75] transition-colors">
                      Read More →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OldNews; 