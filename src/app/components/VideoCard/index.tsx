import { useEffect, useRef, useState } from 'react';

interface VideoCardProps {
  video: any;
  likedVideos: string[];
  toggleLike: (id: string) => void;
}

export function VideoCard({ video, likedVideos, toggleLike }: VideoCardProps) {
  const [play, setPlay] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setPlay(true);
          else setPlay(false);
        });
      },
      { threshold: 0.5 } // 50% of the video visible
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className='border border-gray-700 p-4 rounded snap-start h-screen flex flex-col justify-center bg-gray-900'
    >
      {play ? (
        <iframe
          src={`https://www.youtube.com/embed/${video.id}?rel=0&autoplay=1&mute=1&modestbranding=1`}
          title={video.title}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          className='w-[70%] aspect-video rounded-lg mb-2'
        />
      ) : (
        <img
          src={video.thumbnail}
          alt={video.title}
          className='w-[70%] aspect-video rounded-lg mb-2'
        />
      )}
      <span className='text-white'>{video.title}</span>
      <button
        onClick={() => toggleLike(video.id)}
        className={`px-3 py-1 mt-2 rounded transition-colors duration-200
          ${
            likedVideos.includes(video.id)
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white'
          }`}
      >
        {likedVideos.includes(video.id) ? 'Liked' : 'Like'}
      </button>
    </div>
  );
}
