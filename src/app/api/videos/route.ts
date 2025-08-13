import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const category =
    new URL(request.url).searchParams.get('category') || 'Science';
  const API_KEY = process.env.YOUTUBE_API_KEY; // Add your API key to .env

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${category}+shorts&type=video&videoDuration=short&maxResults=5&key=${API_KEY}`
    );

    if (!res.ok) throw new Error('YouTube API request failed');

    const data = await res.json();

    const videos = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      category,
    }));

    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
