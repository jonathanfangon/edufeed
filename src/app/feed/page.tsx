'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { VideoCard } from '../components/VideoCard';

const categories = ['All', 'Books', 'Fitness', 'Science'];

export default function FeedPage() {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [videos, setVideos] = useState<any[]>([]);
  const [likedVideos, setLikedVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch videos for the selected category
  useEffect(() => {
    setLoading(true);
    const categoryQuery =
      selectedCategory === 'All' ? 'Science' : selectedCategory;

    fetch(`/api/videos?category=${categoryQuery}`)
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch(() => alert('Failed to load videos'))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  // Fetch liked videos for user
  useEffect(() => {
    if (!user) return;
    fetch(`/api/likedVideos?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setLikedVideos(data.likedVideos))
      .catch(() => alert('Failed to load liked videos'));
  }, [user]);

  async function toggleLike(id: string) {
    if (!user) {
      alert('Please sign in to like videos');
      return;
    }

    const isLiked = likedVideos.includes(id);
    const action = isLiked ? 'unlike' : 'like';

    setLikedVideos((prev) =>
      isLiked ? prev.filter((vid) => vid !== id) : [...prev, id]
    );

    try {
      const res = await fetch('/api/likedVideos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, videoId: id, action }),
      });

      if (!res.ok) throw new Error('Failed to update like');
    } catch {
      alert('Error updating like, please try again');
      setLikedVideos((prev) =>
        isLiked ? [...prev, id] : prev.filter((vid) => vid !== id)
      );
    }
  }

  return (
    <main className='p-6 max-w-4xl mx-auto bg-black min-h-screen min-w-screen text-white'>
      <header className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>EduFeed</h1>
        <Link
          href='/profile'
          className='text-blue-400 hover:text-blue-600 underline'
        >
          Profile
        </Link>
      </header>

      <div className='mb-6 flex gap-3'>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded transition-colors duration-200
              ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading videos...</p>
      ) : (
        <div className='grid gap-4 h-screen overflow-y-scroll snap-y snap-mandatory'>
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              likedVideos={likedVideos}
              toggleLike={toggleLike}
            />
          ))}
        </div>
      )}
    </main>
  );
}
