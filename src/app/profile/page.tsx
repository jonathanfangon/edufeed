import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function fetchLikedVideos(userId: string) {
  const res = await fetch(
    `http://localhost:3000/api/likedVideos?userId=${userId}`,
    { cache: 'no-store' }
  );
  const data = await res.json();
  return data.likedVideos || [];
}

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const likedVideoIds = await fetchLikedVideos(user.id);

  return (
    <main className='p-6'>
      <h1>Welcome, {user.firstName}</h1>

      <h2>Your Liked Videos</h2>
      <ul>
        {likedVideoIds.length === 0 && (
          <li>You haven’t liked any videos yet.</li>
        )}
        {likedVideoIds.map((id: string) => (
          <li key={id}>Video ID: {id}</li>
        ))}
      </ul>

      <div className='mt-6'>
        <Link
          href='/feed'
          className='text-blue-600 underline hover:text-blue-800'
        >
          ← Back to Feed
        </Link>
      </div>
    </main>
  );
}
