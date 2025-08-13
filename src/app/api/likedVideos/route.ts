// src/app/api/likedVideos/route.ts
import { NextResponse } from 'next/server';

let userLikesStore: Record<string, string[]> = {}; // userId -> array of liked video ids

export async function POST(request: Request) {
  try {
    const { userId, videoId, action } = await request.json();

    if (!userLikesStore[userId]) userLikesStore[userId] = [];

    if (action === 'like') {
      if (!userLikesStore[userId].includes(videoId)) {
        userLikesStore[userId].push(videoId);
      }
    } else if (action === 'unlike') {
      userLikesStore[userId] = userLikesStore[userId].filter(
        (id) => id !== videoId
      );
    }

    return NextResponse.json({ likedVideos: userLikesStore[userId] });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if (!userId) return NextResponse.json({ likedVideos: [] });

  return NextResponse.json({ likedVideos: userLikesStore[userId] || [] });
}
