import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://gnews.io/api/v4/search?q=cricket&apikey=9914b00bb34f7028b046b8586de86393');
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        const found = data.articles?.[parseInt(id, 10)];
        setNewsItem(found || null);
        if (!found) setError('News article not found.');
      } catch (err) {
        setError('Could not load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <button onClick={() => navigate(-1)} className="mb-4 text-[#16638A] hover:text-[#0F4C75] font-semibold">← Back</button>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#16638A]"></div>
            <span className="ml-4 text-[#16638A] font-medium">Loading article...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 font-semibold py-8">{error}</div>
        ) : newsItem ? (
          <>
            {newsItem.image && (
              <img src={newsItem.image} alt={newsItem.title} className="w-full h-64 object-cover rounded-lg mb-6" />
            )}
            <h1 className="text-3xl font-bold text-[#16638A] mb-4">{newsItem.title}</h1>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs px-2 py-1 bg-[#74D341] text-white rounded-full font-medium">
                {newsItem.source?.name || 'News'}
              </span>
              <span className="text-xs text-gray-500 font-medium">{newsItem.publishedAt ? new Date(newsItem.publishedAt).toLocaleDateString() : ''}</span>
            </div>
            {newsItem.description && <p className="text-gray-700 text-lg mb-6">{newsItem.description}</p>}
            {newsItem.content && <p className="text-gray-600 text-base mb-6">{newsItem.content}</p>}
            {newsItem.url && (
              <a href={newsItem.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-[#16638A] hover:text-[#0F4C75] font-semibold underline">Read Full Article at Source</a>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default NewsDetail;
