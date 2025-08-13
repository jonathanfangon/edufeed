'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const sampleVideos = [
  { id: '1', title: 'Intro to React', category: 'Books' },
  { id: '2', title: 'Morning Workout Routine', category: 'Fitness' },
  { id: '3', title: 'Space Facts', category: 'Science' },
  { id: '4', title: 'Deep Dive into JavaScript', category: 'Books' },
];

const categories = ['All', 'Books', 'Fitness', 'Science'];

export default function FeedPage() {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedVideos, setLikedVideos] = useState<string[]>([]);

  // On mount, fetch liked videos for user
  useEffect(() => {
    if (!user) return;

    fetch(`/api/likedVideos?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setLikedVideos(data.likedVideos));
  }, [user]);

  async function toggleLike(id: string) {
    if (!user) {
      alert('Please sign in to like videos');
      return;
    }

    const isLiked = likedVideos.includes(id);
    const action = isLiked ? 'unlike' : 'like';

    // Optimistically update UI
    setLikedVideos((prev) =>
      isLiked ? prev.filter((vid) => vid !== id) : [...prev, id]
    );

    // Persist change on backend
    await fetch('/api/likedVideos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, videoId: id, action }),
    });
  }

  const filteredVideos =
    selectedCategory === 'All'
      ? sampleVideos
      : sampleVideos.filter((v) => v.category === selectedCategory);

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

      <div className='grid gap-4'>
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className='border border-gray-700 p-4 rounded flex justify-between items-center bg-gray-900'
          >
            <span>{video.title}</span>
            <button
              onClick={() => toggleLike(video.id)}
              className={`px-3 py-1 rounded transition-colors duration-200
                ${
                  likedVideos.includes(video.id)
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white'
                }`}
            >
              {likedVideos.includes(video.id) ? 'Liked' : 'Like'}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
